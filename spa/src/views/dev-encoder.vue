<template>
<div class="row">
  <vs-modal show="{{@ showVidPreview}}" effect="fade" width="800">
    <div class="modal-header">
      <h4 class="modal-title">视频预览</h4>
    </div>  
    <div class="modal-body">
      <div class="my-vid-preview">
        <canvas v-el="container"></canvas>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-default" v-on="click: doExitVidPreview">退出</button>
    </div>    
  </vs-modal>
  <div class="col-md-12">
    <rd-widget>
      <rd-widget-header header="{{* windowSubtitleInfo.header}}">
      </rd-widget-header>
      <rd-widget-body>    
        <my-vid-subtitle list-name="subtitleListOfWindow"></my-vid-subtitle>
      </rd-widget-body>
    <rd-widget>
  </div>  
  <div class="col-md-12">
    <rd-widget>
      <rd-widget-header header="{{* encWindow.header}}">
        <button class="btn btn-sm btn-default" v-on="click: doShowVidPreview">
          <span class="glyphicon glyphicon-play"></span> 视频预览
        </button>
      </rd-widget-header>
      <rd-widget-body>
        <my-enc-window params="{{encWindow.params}}" do-save={{doSaveEncWindow}}></my-enc-window>
      </rd-widget-body>
    <rd-widget>    
  </div>
  <div class="col-md-12" v-repeat="encVpIn in encVpIns">
    <rd-widget>
      <rd-widget-header header="{{* encVpIn.header}}">
      </rd-widget-header>
      <rd-widget-body>
        <my-vp-in index="{{$index}}" params="{{encVpIn.params}}" state="{{encVpIn.state}}" do-save-req="{{doSaveReq}}"></my-vp-in>
      </rd-widget-body>
    <rd-widget>
  </div> 
  <div class="col-md-12" v-repeat="encVpOut in encVpOuts">
    <rd-widget>
      <rd-widget-header header="{{* encVpOut.header}}">
      </rd-widget-header>
      <rd-widget-body>
        <my-vp-out 
        index="{{$index}}" 
        params="{{encVpOut.params}}" 
        vid-loop-en="true" 
        display-cfg-en="true" 
        do-save-req="{{doSaveReq}}">
        </my-vp-out>
      </rd-widget-body>
    <rd-widget>
  </div>
  <div class="col-md-12">
    <rd-widget>
      <rd-widget-header header="{{* encApMic.header}}">
      </rd-widget-header>
      <rd-widget-body>
        <my-ap-mic params="{{encApMic.params}}" do-save-req="{{doSaveReq}}"></my-ap-mic>
      </rd-widget-body>
    <rd-widget>
  </div> 
  <div class="col-md-12">
    <rd-widget>
      <rd-widget-header header="{{* encAp.header}}">
      </rd-widget-header>
      <rd-widget-body>
        <template v-repeat="params in encAp.params">
          <my-ap-vol params="{{params}}" do-save-req="{{doSaveReq}}"></my-ap-vol>
        </template>
      </rd-widget-body>
    <rd-widget>
  </div>      
</div>
</template>

<script>
var api = require('../lib/api');
var log = require('../lib/log');
var utils = require('../lib/utils');
var devCodecApi = require('../lib/devCodecApi');
var WSAvcPlayer = require('../lib/wsAvc');
var _ = require('underscore');

module.exports = {
  components: {
    myEncWindow: require('./my-enc-window.vue'),
    myVpIn: require('./my-vp-in.vue'),
    myVpOut: require('./my-vp-out.vue'),
    myApMic: require('./my-ap-mic.vue'),
    myApVol: require('./my-ap-vol.vue'),
    myVidSubtitle: require('./my-vid-subtitle.vue')
  },
  data: function() {
    return {
      showVidPreview: false,
      encWindow: {
        header: {
          icon: 'fa fa-edit',
          title: '流媒体'
        },
        params: {}
      },
      encVpIns: [{
        header: {
          icon: 'fa fa-edit',
          title: 'DVI-I IN'
        },
        params: {},
        state: {}
      }, {
        header: {
          icon: 'fa fa-edit',
          title: '3G-SDI IN'
        },
        params: {},
        state: {}
      }],
      encVpOuts: [{
        header: {
          icon: 'fa fa-edit',
          title: 'HDMI OUT'
        },
        params: {}
      }],
      encApMic: {
        header: {
          icon: 'fa fa-edit',
          title: 'MIC'
        },
        params: {
          type: 'apIn',
          index: 0,
          data: {}
        }
      },
      encAp: {
        header: {
          icon: 'fa fa-edit',
          title: '音量'
        },
        params: [{
          text: 'MIC',
          type: 'apIn',
          index: 0,
          data: {}
        }, {
          text: 'DVI-I IN',
          type: 'apIn',
          index: 1,
          data: {}
        }, {
          text: 'HDMI OUT',
          type: 'apOut',
          index: 0,
          data: {}
        }]
      },
      windowSubtitleInfo: {
        header: {
          icon: 'fa fa-list',
          title: '窗口字幕'
        },
      }  
    }
  },
  methods: {
    vidPreviewInit: function() {
      var wsUrl = api.getWsHost("Codec") + "/wsstream/preview";
      var wsavc = new WSAvcPlayer(this.$$.container, "webgl", 1, 35);
      wsavc.connect(wsUrl, function(handler) {
        handler.startPlay();
      });
      this.wsavc = wsavc;
    },
    vidPreviewUninit: function() {
      if (this.wsavc) {
        this.wsavc.disconnect();
        this.wsavc = undefined;
      }
    },
    doShowVidPreview: function() {
      this.vidPreviewInit();
      this.showVidPreview = true;
    },    
    doExitVidPreview: function() {
      this.vidPreviewUninit();
      this.showVidPreview = false;
    },
    doLoadEncWindow: function(windowCfg, infoCfg) {
      this.encWindow.params = {
        vidSrcPortNames: JSON.parse(windowCfg.vidSrcPortNames),
        audSrcPortNames: JSON.parse(windowCfg.audSrcPortNames),
        audProtocol: windowCfg.audio.protocol,
        streamLists: {}
      };

      if (infoCfg != undefined) {
        this.encWindow.params.rtsp = infoCfg.rtsp;
      }

      this.encWindow.params.vidSrcPortName = this.encWindow.params.vidSrcPortNames[0];

      _.each(windowCfg, function(item, key, list) {
        if ((key === 'main') 
          || (key === 'sub') 
          || (key === 'third') 
          || (key === 'preview')) {
          this.streamLists[key] = {
            _id: key,
            enable: item.enable,
            protocol: item.protocol,
            resolution: item.resolution,
            framerate: item.framerate,
            bitRate: item.bitRate,
            rateControl: item.rateControl,
            gops: item.gops
          };
          //utils.printObj(this.streamLists[key]);
        } 
      }, this.encWindow.params);
    },
    doSaveEncWindow: function(req) {
      devCodecApi.multimedia.setCfg(req, function(res) {
        if (res === undefined || res.code != 0) {
          log.showErrorWithRes(res);
          this.doLoadMultimediaCfg();
        }      
      }.bind(this));
    },
    doLoadEncVpInCfg: function(vpInCfg) {
      _.each(vpInCfg, function(item, key, index) {
        this.encVpIns[key].params = item;
      }, this);
    },
    doLoadEncVpInState: function(vpInState) {
      _.each(vpInState, function(item, key, index) {
        this.encVpIns[key].state = item;
      }, this);
    },
    doLoadEncVpOut: function(vpOutCfg) {
      _.each(vpOutCfg, function(item, key, index) {
        this.encVpOuts[key].params = item;
      }, this);
    },
    doLoadEncAp: function(apInCfg, apOutCfg) {
      if (apInCfg) {
        this.encAp.params[0].data = apInCfg['0'];
        this.encAp.params[1].data = apInCfg['1'];
      }
      if (apOutCfg) {
        this.encAp.params[2].data = apOutCfg['0'];
      }
    },
    doLoadEncApMic: function(apMicCfg) {
      this.encApMic.params.data = apMicCfg;
    },
    doSaveReq: function(req) {
      devCodecApi.multimedia.setCfg(req, function(res) {
        if (res === undefined || res.code != 0) {
          log.showErrorWithRes(res);
          this.doLoadMultimediaCfg();
        } else {
          swal.close();
        }          
      });
    },
    doLoadMultimediaCfg: function() {
      devCodecApi.multimedia.getCfg(function(res) {
        var infoCfg = res.data._info;
        var windowCfg = res.data.window['0'];
        if (windowCfg) {
          this.doLoadEncWindow(windowCfg, infoCfg);
        }
        var vpInCfg = res.data.vpIn;
        if (vpInCfg) {
          this.doLoadEncVpInCfg(vpInCfg);
        }
        var vpOutCfg = res.data.vpOut;
        if (vpOutCfg) {
          this.doLoadEncVpOut(vpOutCfg);
        }
        var apInCfg = res.data.apIn;
        if (apInCfg) {
          this.doLoadEncApMic(apInCfg['0']);
        }
        var apOutCfg = res.data.apOut;
        this.doLoadEncAp(apInCfg, apOutCfg);
      }.bind(this));    
    },
    doLoadMultimediaState: function() {
      devCodecApi.multimedia.getState(function(res) {
        var vpInState = res.data.vpIn;
        if (vpInState) {
          this.doLoadEncVpInState(vpInState);
        }
      }.bind(this));
    }
  },  
  ready: function () {
    this.doLoadMultimediaCfg();
    this.doLoadMultimediaState();
    this.stateTimer = setInterval(this.doLoadMultimediaState, 3000);
  },
  beforeDestroy: function() {
    if (this.stateTimer) {
      clearInterval(this.stateTimer);
      this.stateTimer = undefined;
    }    
  }
}
</script>

<style>
.my-vid-preview {
  width: 640px;
  height: 360px;
  margin: 0 auto;
}
</style>