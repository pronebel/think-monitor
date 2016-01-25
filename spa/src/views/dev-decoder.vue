<template>
<div class="row">
  <div class="col-md-12">
    <rd-widget>
      <rd-widget-header header="{{* bgProcessInfo.header}}">
      </rd-widget-header>
      <rd-widget-body>    
        <my-img-upload params="{{* bgProcessInfo.params}}"></my-img-upload>
      </rd-widget-body>
    <rd-widget>
  </div>
  <div class="col-md-12" v-if="false">
    <rd-widget>
      <rd-widget-header header="{{* bgFileInfo.header}}">
      </rd-widget-header>
      <rd-widget-body>    
        <my-file-upload params="{{* bgFileInfo.params}}"></my-file-upload>
      </rd-widget-body>
    <rd-widget>
  </div>
  <div class="col-md-12" v-repeat="decVpOut in decVpOuts">
    <rd-widget>
      <rd-widget-header header="{{* decVpOut.header}}">
      </rd-widget-header>
      <rd-widget-body>
        <my-vp-out 
        index="{{$index}}" 
        params="{{decVpOut.params}}" 
        vid-loop-en="false" 
        display-cfg-en="{{decVpOut.displayCfgEn}}" 
        do-save-req="{{doSaveReq}}">
        </my-vp-out>
      </rd-widget-body>
    <rd-widget>
  </div>
  <div class="col-md-12">
    <rd-widget>
      <rd-widget-header header="{{* decAp.header}}">
      </rd-widget-header>
      <rd-widget-body>
        <template v-repeat="params in decAp.params">
          <my-ap-vol params="{{params}}" do-save-req="{{doSaveReq}}"></my-ap-vol>
        </template>
      </rd-widget-body>
    <rd-widget>
  </div>    
</div>
</template>

<script>
var utils = require('../lib/utils');
var log = require('../lib/log');
var devCodecApi = require('../lib/devCodecApi');

module.exports = {
  components: {
    myImgUpload: require('./my-img-upload.vue'),
    myFileUpload: require('./my-file-upload.vue'),
    myVpOut: require('./my-vp-out.vue'),
    myApVol: require('./my-ap-vol.vue')
  },
  data: function() {
    return {
      bgProcessInfo: {
        header: {
          icon: 'fa fa-file',
          title: '背景设置'
        },
        params: {
          moduleName: 'Codec',
          typeCfg: 'background',
          maxSize: 10*1024*1024,
          multiScreenX: 1,
          multiScreenY: 1,
          success: this.uploadSuccess,
          error: this.uploadError,
          fixedName: 'background.jpg'
        }
      },   
      bgFileInfo: {
        header: {
          icon: 'fa fa-file',
          title: '背景图片'
        },
        params: {
          moduleName: 'Codec',
          typeCfg: 'background',
          maxSize: 6*1024*1024,
          success: this.uploadSuccess,
          error: this.uploadError,
          fixedName: 'background.jpg'          
        }
      },    
      decVpOuts: [{
        header: {
          icon: 'fa fa-edit',
          title: 'HDMI OUT'
        },
        displayCfgEn: true,
        params: {}
      }, {
        header: {
          icon: 'fa fa-edit',
          title: 'DVI-I OUT'
        },
        displayCfgEn: false,
        params: {}
      }],
      decAp: {
        header: {
          icon: 'fa fa-edit',
          title: '音量'
        },
        params: [{
          text: 'LINE OUT',
          type: 'apOut',
          index: 0,
          data: {}
        }, {
          text: 'HDMI OUT',
          type: 'apOut',
          index: 1,
          data: {}
        }, {
          text: 'DVI-I OUT',
          type: 'apOut',
          index: 2,
          data: {}
        }]
      }
    }
  },
  methods: {
    uploadSuccess: function(res) {
      log.showSuccess('Upload Success');  
    },
    uploadError: function(res) {
      swal({
        title: 'Opps!',
        text: res.msg ? res.msg: 'Connect Fail!',
        type: "error",
        showConfirmButton: true
      });
    },
    doLoadDecVpOut: function(vpOutCfg) {
      _.each(vpOutCfg, function(item, key, list) {
        this.decVpOuts[key].params = item;
      }, this);
    },
    doLoadDecAp: function(apOutCfg) {
      _.each(apOutCfg, function(item, index, list) {
        this.decAp.params[index].data = item;
      }, this);
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
        var vpOutCfg = res.data.vpOut;
        if (vpOutCfg) {
          this.doLoadDecVpOut(vpOutCfg);
        }
        var apOutCfg = res.data.apOut;
        if (apOutCfg) {
          this.doLoadDecAp(apOutCfg);
        }
      }.bind(this));    
    }
  },
  ready: function () {
    this.doLoadMultimediaCfg();
  }
}
</script>

<style>
</style>