"use strict";

var Avc            = require('h264-live-player/broadway/Decoder');
var YUVWebGLCanvas = require('h264-live-player/canvas/YUVWebGLCanvas');
var Size           = require('h264-live-player/utils/Size');
var log = require('./log');

function WSAvcPlayer(canvas, canvastype, nals, delay) {
  this.canvas = canvas;
  this.nals = nals;
  this.delay = delay;
  // AVC codec initialization
  this.avc = new Avc();
  if(false) this.avc.configure({
    filter: "original",
    filterHorLuma: "optimized",
    filterVerLumaEdge: "optimized",
    getBoundaryStrengthsA: "optimized"
  });

  //WebSocket variable
  this.ws;
  this.pktnum = 0;
  this.rcvtime;
  this.prevframe;
  
  function onPictureDecodedWebGL(buffer, width, height) {
    if (!buffer) {
      return;
    }
    var lumaSize = width * height;
    var chromaSize = lumaSize >> 2;

    this.webGLCanvas.YTexture.fill(buffer.subarray(0, lumaSize));
    this.webGLCanvas.UTexture.fill(buffer.subarray(lumaSize, lumaSize + chromaSize));
    this.webGLCanvas.VTexture.fill(buffer.subarray(lumaSize + chromaSize, lumaSize + 2 * chromaSize));
    this.webGLCanvas.drawScene();
    
    var date = new Date();
    log.TEST_TRACE("WSAvcPlayer: Decode time: " + (date.getTime() - this.rcvtime) + " ms");
  }
  
  function onPictureDecodedCanvas(buffer, width, height) {
    if (!buffer) {
      return;
    }
    var lumaSize = width * height;
    var chromaSize = lumaSize >> 2;
    
    var ybuf = buffer.subarray(0, lumaSize);
    var ubuf = buffer.subarray(lumaSize, lumaSize + chromaSize);
    var vbuf = buffer.subarray(lumaSize + chromaSize, lumaSize + 2 * chromaSize);
    
    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        var yIndex = x + y * width;
        var uIndex = ~~(y / 2) * ~~(width / 2) + ~~(x / 2);
        var vIndex = ~~(y / 2) * ~~(width / 2) + ~~(x / 2);
        var R = 1.164 * (ybuf[yIndex] - 16) + 1.596 * (vbuf[vIndex] - 128);
        var G = 1.164 * (ybuf[yIndex] - 16) - 0.813 * (vbuf[vIndex] - 128) - 0.391 * (ubuf[uIndex] - 128);
        var B = 1.164 * (ybuf[yIndex] - 16) + 2.018 * (ubuf[uIndex] - 128);
        
        var rgbIndex = yIndex * 4;
        this.canvasBuffer.data[rgbIndex+0] = R;
        this.canvasBuffer.data[rgbIndex+1] = G;
        this.canvasBuffer.data[rgbIndex+2] = B;
        this.canvasBuffer.data[rgbIndex+3] = 0xff;
      }
    }
    
    this.canvasCtx.putImageData(this.canvasBuffer, 0, 0);
    
    var date = new Date();
    log.TEST_TRACE("WSAvcPlayer: Decode time: " + (date.getTime() - this.rcvtime) + " ms");
  }

  this.decode = function(data) {
    var naltype = "invalid frame";
    if (data.length > 4) {
      var nalUnitType = data[4] & 0x1f;
      if (nalUnitType == 5) {
        naltype = "I frame";
      }
      else if (nalUnitType == 1) {
        naltype = "P frame";
      }
      else if (nalUnitType == 7) {
        naltype = "SPS";
      }
      else if (nalUnitType == 8) {
        naltype = "PPS";
      }
    }
    log.TEST_TRACE("WSAvcPlayer: Passed " + naltype + " to decoder" + 'nalUnitType:' + nalUnitType);
    /* Decode Pictures */
    this.avc.decode(data);
  };
  
  this.connect = function(url, cb) {    
    // Websocket initialization
    if (this.ws != undefined) {
      this.ws.close();
      delete this.ws;
    }
    this.ws = new WebSocket(url, ['chat']);
    this.ws.binaryType = "arraybuffer";
    this.ws.onopen = function() {
      log.INFO_TRACE("WSAvcPlayer: Connected to " + url);
      cb && cb(this);
    }.bind(this);
    this.ws.onmessage = function(evt) {
      if(typeof evt.data == "string")
        return this.cmd(JSON.parse(evt.data));

      this.pktnum++;
      var data = new Uint8Array(evt.data);
      log.TEST_TRACE("WSAvcPlayer: [Pkt " + this.pktnum + " (" + evt.data.byteLength + " bytes)]");
      var date = new Date();
      this.rcvtime = date.getTime();
      this.decode(data);
      this.prevframe = data;
    }.bind(this);
    this.ws.onclose = function()  { 
      // websocket is closed.
      log.INFO_TRACE("WSAvcPlayer: Connection closed")
    };
  };

  this.initCanvas = function(width, height){
    log.DEBUG_TRACE("canvastype:" + canvastype);
    if (canvastype == "webgl") {
      this.webGLCanvas = new YUVWebGLCanvas(this.canvas, new Size(width, height));
      this.avc.onPictureDecoded = onPictureDecodedWebGL.bind(this);
    } else if (canvastype == "canvas") {
      this.avc.onPictureDecoded = onPictureDecodedCanvas.bind(this);
      this.canvasCtx = this.canvas.getContext("2d");
      this.canvasBuffer = this.canvasCtx.createImageData(width, height);
    }
  };

  this.cmd = function(cmd){
    log.DEBUG_TRACE("Incoming request", cmd);

    if(cmd.action == "init") {
      this.initCanvas(cmd.width, cmd.height);
      this.canvas.width  = cmd.width;
      this.canvas.height = cmd.height;
    }
  };
  
  this.disconnect = function() {
    this.ws.close();
  };
  
  this.flush = function() {
    console.log("Flush: " + this.prevframe.length);
    this.decode(this.prevframe);
  };

  this.startPlay = function() {
    var message = {
      action: 'startPlay'
    }
    this.ws.send(JSON.stringify(message));
  };

  this.stopPlay = function() {
    var message = {
      action: 'stopPlay'
    }
    this.ws.send(JSON.stringify(message));
  };
}

module.exports = WSAvcPlayer;