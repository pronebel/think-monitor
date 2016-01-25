<template>
<form class="form-horizontal" method="post" action="#" v-on="submit: onSubmit">
  <vs-modal show="{{@ showStreamDetail}}" effect="fade" width="800" callback="{{doSaveStream}}">
    <div class="modal-header">
      <h4 class="modal-title" >{{tmpStreamCfg._id}}</h4>
    </div>
    <div class="modal-body">
      <my-stream-detail stream-cfg="{{@ tmpStreamCfg}}">
      </my-stream-detail>
    </div>
  </vs-modal>
  <div class="form-group">
    <div class="col-sm-offset-2 col-sm-10">
      <div class="checkbox">
        <label>
          <input type="checkbox" v-model="encWindow.rtsp.enableMulticast" true-exp=1 false-exp=0> 启用组播
        </label>
      </div>
    </div>    
  </div>
  <div class="form-group" v-class="has-error: !validMultiIpaddr">
    <label class="col-sm-2 control-label">组播地址</label>
    <div class="col-sm-10">
      <div class="input-group">
        <span class="input-group-btn">
          <button class="btn btn-default" type="button" v-on="click: onRandGen">随机指定</button>
        </span>
        <input type="text" class="form-control" v-model="encWindow.rtsp.multiIpaddr" placeholder="225.0.0.0~238.255.255.255">     
      </div>
    </div>
  </div>
  <div class="form-group" v-class="has-error: !validVidSrcPortName">
    <label class="col-sm-2 control-label">视频源</label>
    <div class="col-sm-10">
      <select class="form-control" v-model="encWindow.vidSrcPortName" options="vidSrcPortOptions"></select>
    </div>
  </div>
  <div class="form-group" v-class="has-error: !validAudSrcPortNames">
    <label class="col-sm-2 control-label">音频源</label>
    <div class="col-sm-10">
      <select class="form-control" v-model="encWindow.audSrcPortNames" multiple options="audSrcPortOptions"></select>
    </div>
  </div>  
  <div class="form-group">
    <label class="col-sm-2 control-label">音频编码格式</label>
    <div class="col-sm-10">
      <select class="form-control" v-model="encWindow.audProtocol" options="audProtocolOptions"></select>
    </div>
  </div>   
  <div class="form-group">
    <div class="col-sm-offset-2 col-sm-10">
      <button type="submit" class="btn btn-default">保存</button>
    </div>
  </div>
  <hr />
  <div class="form-group">
    <label class="col-sm-2 control-label">码流</label>
    <div class="col-sm-10">
      <my-table cfg="{{* streamTblCfg}}" lists="{{encWindow.streamLists}}"></my-table>
    </div>
  </div>
</form>
</template>

<script>
var isValidIp = require('../lib/utils').isValidIp;
var log = require('../lib/log');
var utils = require('../lib/utils');
var _ = require('underscore');

module.exports = {
  replace: true,
  props: ['params', 'doSave'],
  components: {
    myStreamDetail: require('./my-stream-detail.vue'),
  },
  data: function() {
    return {
      showStreamDetail: false,
      tmpStreamCfg: {
        _id: '',
        enable: 1,
        protocol: "h264",
        resolution: '',
        framerate: 0,
        bitRate: 0,
        rateControl: "vbr",
        gops: 1
      },
      encWindow: {
        vidSrcPortName: '',
        audSrcPortNames: [],
        audProtocol: '',
        streamLists: {
          main: {
            _id: 'main',
            enable: 1,
            protocol: "h264",
            resolution: '',
            framerate: 0,
            bitRate: 0,
            rateControl: "vbr",
            gops: 1
          },
          sub: {
            _id: 'sub',
            enable: 1,
            protocol: "h264",
            resolution: '',
            framerate: 0,
            bitRate: 0,
            rateControl: "vbr",
            gops: 1            
          },
          third: {
            _id: 'third',
            enable: 1,
            protocol: "h264",
            resolution: '',
            framerate: 0,
            bitRate: 0,
            rateControl: "vbr",
            gops: 1             
          },
          preview: {
            _id: 'preview',
            enable: 1,
            protocol: "h264",
            resolution: '',
            framerate: 0,
            bitRate: 0,
            rateControl: "vbr",
            gops: 1             
          }
        },
        rtsp: {
          enableMulticast: 0,
          multiIpaddr: ''
        }
      },
      streamTblCfg: {
        isCheckable: false,
        isShowHead: true,
        isShowOperation: true,
        columns: [{
          field: '_id',
          text: '名字',
          width: 'auto'
        }, {
          field: 'resolution',
          text: '分辨率',
          width: 'auto'
        }, {
          field: 'framerate',
          text: '帧率',
          width: 'auto'
        }, {
          field: 'bitRate',
          text: '码率',
          width: 'auto'
        }, {
          field: 'gops',
          text: 'I帧间隔',
          width: 'auto'
        }],
        operation: {
          text: '详细',
          width: 'auto',
          actions: [{
            icon: 'glyphicon glyphicon-edit',
            doClick: this.doShowStreamDetail
          }]
        }
      },
      vidSrcPortOptions: [{
        text: 'DVI-I IN',
        value: 'vpIn_0'
      }, {
        text: '3G-SDI IN',
        value: 'vpIn_1'
      }],
      audSrcPortOptions: [{
        text: 'LINE IN',
        value: 'apIn_0'
      }, {
        text: 'DVI-I IN',
        value: 'apIn_1'
      }],
      audProtocolOptions: [{
        text: 'G.711 A-law',
        value: 'pcma'
      }, {
        text: 'G.711 u-law',
        value: 'pcmu'
      }, {
        text: 'G.722',
        value: 'g722'
      }, {
        text: 'AAC',
        value: 'aac'
      }]     
    }
  },
  computed: {
    validMultiIpaddr: function() {
      return utils.checkValidIp(this.encWindow.rtsp.multiIpaddr) && utils.checkValidMultiIp(this.encWindow.rtsp.multiIpaddr);
    },
    validAudSrcPortNames: function() {
      return this.encWindow.audSrcPortNames.length >= 1;
    },
    validVidSrcPortName: function() {
      return this.encWindow.vidSrcPortName != '';
    }
  },
  methods: {
    onRandGen: function(e) {
      e && e.preventDefault();
      var p1 = 225 + Math.floor(Math.random()*13 + 1);
      var p2 = Math.floor(Math.random()*255 + 1);
      var p3 = Math.floor(Math.random()*255 + 1);
      var p4 = Math.floor(Math.random()*255 + 1);
      this.encWindow.rtsp.multiIpaddr = p1 + '.' + p2 + '.' + p3 + '.' + p4;
    },
    cpStreamCfg: function(dst, src) {
      dst._id = src._id;
      dst.enable = src.enable;
      dst.protocol = src.protocol;
      dst.resolution = src.resolution;
      dst.framerate = src.framerate;
      dst.bitRate = src.bitRate;
      dst.rateControl = src.rateControl;
      dst.gops = src.gops;
    },    
    initEncWindow: function(params) {
      this.encWindow.vidSrcPortName = params.vidSrcPortName;
      this.encWindow.audSrcPortNames = _.clone(params.audSrcPortNames); 
      this.encWindow.audProtocol = params.audProtocol;
      _.each(params.streamLists, function(value, key, list) {
        this.cpStreamCfg(this.encWindow.streamLists[key], value);
      }, this);
      this.encWindow.rtsp.enableMulticast = params.rtsp.enableMulticast;
      this.encWindow.rtsp.multiIpaddr = params.rtsp.multiIpaddr;
    },
    resetTmpStreamCfgById: function(id) {
      var streamCfg = this.encWindow.streamLists[id];
      this.tmpStreamCfg = _.clone(streamCfg);
    },    
    doShowStreamDetail: function(id) {
      this.resetTmpStreamCfgById(id);
      this.showStreamDetail = true;
    },  
    doSaveStreamToDev: function() {
      var windowCfg = {
        vidSrcPortNames: JSON.stringify([this.encWindow.vidSrcPortName]),
      };
      windowCfg[this.tmpStreamCfg._id] = {
        enable: this.tmpStreamCfg.enable,
        protocol: this.tmpStreamCfg.protocol,
        resolution: this.tmpStreamCfg.resolution,
        framerate: this.tmpStreamCfg.framerate,
        bitRate: this.tmpStreamCfg.bitRate,
        rateControl: this.tmpStreamCfg.rateControl,
        gops: this.tmpStreamCfg.gops
      };    
      var req = {
        window: {
          '0': windowCfg
        }
      };
      this.doSave(req);
    },
    doSaveStream: function() {
      var streamLists = this.encWindow.streamLists;
      this.cpStreamCfg(streamLists[this.tmpStreamCfg._id], this.tmpStreamCfg);
      this.doSaveStreamToDev();
      this.showStreamDetail = false;
    },
    onReset: function(e) {
      e && e.preventDefault();
      this.initEncWindow(this.params);
    },
    doSaveEncWindowToDev: function() {
      var windowCfg = {
        vidSrcPortNames: JSON.stringify([this.encWindow.vidSrcPortName]),
        audSrcPortNames: JSON.stringify(this.encWindow.audSrcPortNames),
        audio: {
          protocol: this.encWindow.audProtocol
        }
      };
      var req = {
        _info: {
          rtsp: this.encWindow.rtsp
        },          
        window: {
          '0': windowCfg
        }
      };        
      this.doSave(req);
    },
    onSubmit: function(e) {
      e && e.preventDefault();
      if (this.validAudSrcPortNames && this.validVidSrcPortName) {
        log.showWait('必须手动重启才能生效', 3);
        this.doSaveEncWindowToDev();
      } else {
        log.showError('Invalid Params');
      }
    }
  },
  watch: {
    'params': function(newVal, oldVal) {
      this.initEncWindow(newVal);
    }
  }
}
</script>

<style>
</style>