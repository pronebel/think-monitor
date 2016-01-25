var log = require('./log');
var utils = require('./utils');
var colorOptions = require('../configs/colorOptions');

function drawVidLayout(canvas, windowList, windowMaxWidth, windowMaxHeight, getStreamSrcName) {
  if (!canvas.getContext) {
    log.ERROR_TRACE('Invalid canvas');
    return;
  }

  var context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
  var width = canvas.width;
  var height = canvas.height;
  var widthRatio = width / windowMaxWidth;
  var heightRatio = height / windowMaxHeight;

  context.textAlign = "center";

  context.fillStyle = '#99FFCC';
  context.fillRect(0, 0, width, height);

  //log.DEBUG_TRACE('width:' + canvas.width);
  //log.DEBUG_TRACE('height:' + canvas.height);

  var showWindowList = _.sortBy(windowList, function(item) {
    return item.layer;
  });

  for (var i = 0; i < showWindowList.length; i++) {
    var window = showWindowList[i];
    var coordinate = window.coordinate;
    var drawCfg = {
      x: coordinate.topHoriz * widthRatio + 2,
      y: coordinate.topVerti * heightRatio + 2,
      width: (coordinate.bottomHoriz - coordinate.topHoriz) * widthRatio - 4,
      height: (coordinate.bottomVerti - coordinate.topVerti) * heightRatio - 4
    };

    //utils.printObj(coordinate);
    //utils.printObj(drawCfg);
    //log.DEBUG_TRACE(window.layer);

    context.strokeStyle = '#000000';
    context.strokeRect(drawCfg.x, drawCfg.y, drawCfg.width, drawCfg.height);
    context.font = '10px Serif';
    context.fillStyle = '#000000';
    context.textBaseline = "middle";
    context.fillText(getStreamSrcName(window.srcTopoId, window.srcPortName), 
      drawCfg.x + (drawCfg.width/2), drawCfg.y + (drawCfg.height/2));
  };
}
exports.drawVidLayout = drawVidLayout;