<template>
<div class="row">
  <div class="col-md-12">
    <rd-widget>
      <rd-widget-header header="{{* backgroundInfo.header}}">
        <form class="form-inline">
          <div class="form-group">
            <label class="control-label">LCD</label>
            <select class="form-control input-sm" v-model="currTopoLcdDev" options="topoLcdDevs | topoOptionsExtrace" v-on="change: onTopoLcdChange">
            </select>
          </div>
          <button class="btn btn-sm btn-default" v-on="click:doShowLocation">
            <span class="glyphicon glyphicon-retweet"></span> 定位
          </button>
          <button class="btn btn-sm btn-default" v-on="click:doClearLocation">
            <span class="glyphicon glyphicon-retweet"></span> 清除定位
          </button>
          <button class="btn btn-sm btn-default" v-on="click:doSyncBackground">
            <span class="glyphicon glyphicon-retweet"></span> 同步背景图片
          </button>        
        </form>
      </rd-widget-header>
      <rd-widget-body>    
        <my-img-upload params="{{* backgroundInfo.params}}" submit="{{doSubmit}}"></my-img-upload>
      </rd-widget-body>
    <rd-widget>
  </div>
</div>
</template>

<script>
var api = require('../lib/api');
var async = require('async');
var serverApi = require('../lib/serverApi');
var log = require('../lib/log');

module.exports = {
  replace: true,
  components: {
    myImgUpload: require('./my-img-upload.vue'),
  },
  filters: {
    topoOptionsExtrace: function(lists) {
      return lists.map(function(item, index) {
        return {
          text: item.devName,
          value: index
        }
      });
    }
  },
  data: function() {
    return {
      backgroundInfo: {
        header: {
          icon: 'fa fa-file',
          title: 'LCD设置'
        },
        params: {
          typeCfg: 'background',
          maxSize: 20*1024*1024,
          multiScreenX: 1,
          multiScreenY: 1,
          submit: this.doSubmit, 
          fixedName: 'background.jpg'
        }, 
        progress: 0
      },
      currTopoLcdDev: 0,
      topoLcdDevs: [], 
    }
  },
  methods: {
    doShowLocation: function() {
      log.showWait('Sync', 3);
      var topoLcdDev = this.topoLcdDevs[this.currTopoLcdDev];
      if (topoLcdDev && topoLcdDev.topoId > 0) {
        serverApi.mediaPhy.setDevId(topoLcdDev.topoId);
        serverApi.mediaPhy.sendCmd('showLocation');
      }
    },
    doClearLocation: function() {
      log.showWait('Sync', 3);
      var topoLcdDev = this.topoLcdDevs[this.currTopoLcdDev];
      if (topoLcdDev && topoLcdDev.topoId > 0) {
        serverApi.mediaPhy.setDevId(topoLcdDev.topoId);
        serverApi.mediaPhy.sendCmd('clearLocation');
      }
    },
    doSyncBackground: function() {
      log.showWait('Sync', 3);
      this.syncBackground();
    },
    syncBackground: function() {
      var topoLcdDev = this.topoLcdDevs[this.currTopoLcdDev];
      if (topoLcdDev && topoLcdDev.topoId > 0) {
        serverApi.mediaPhy.setDevId(topoLcdDev.topoId);
        serverApi.mediaPhy.sendCmd('syncBackground');
      }
    },
    syncToDec: function(callback) {
      this.syncBackground();
      callback();
    },
    uploadBgOfDec: function(data, callback) {
      var topoId = data.topoId;

      api.storage.uploadFile('Server', 
        'topoConfig', 
        topoId + '-' + data.index + '-background.json', 
        JSON.stringify({
          dataURL: data.dataURL
        }), 
        function(res) {
          this.backgroundInfo.progress++;
          callback();
        }.bind(this),
        function(res) {
          callback('Upload Fail');
          data.callback('Upload Fail');
        }.bind(this));
    },
    uploadBackgroundData: function(data, callback) {
      var bgsOfLcd = data.bgsOfLcd;
      var totalCnt = data.totalCnt;
      var topoId = data.topoId;

      var queue = async.queue(this.uploadBgOfDec, 1);
      _.each(bgsOfLcd, function(item, index) {
        queue.push({
          topoId: topoId,
          index: index, 
          dataURL: item.dataURL,
          callback: callback
        });
      });
      queue.drain = function() {
        if (this.backgroundInfo.progress === totalCnt) {
          callback();
        }
      }.bind(this);
    },
    makeBackgroundData: function(canvas, callback) {
      var bgsOfLcd = [];
      var lcdScreenCfg = this.lcdScreenCfg;
      var totalCnt = lcdScreenCfg.multiScreenX * lcdScreenCfg.multiScreenY;

      var offCanvas = document.createElement("canvas");
      var offContext = offCanvas.getContext("2d");
      offCanvas.width = 1920;
      offCanvas.height = 1080;

      var image = new Image();
      image.src = canvas.toDataURL('image/jpeg', 1.0);
      image.onload = function() {
        for (var index = 0; index < totalCnt; index++) {
          var posX = index % lcdScreenCfg.multiScreenX;
          var posY = Math.floor(index / lcdScreenCfg.multiScreenY);

          offContext.drawImage(image, 
            posX * 1920, posY * 1080, offCanvas.width, offCanvas.height, 
            0, 0, offCanvas.width, offCanvas.height);
          var dataURL = offCanvas.toDataURL('image/jpeg', 1.0);
          bgsOfLcd.splice(bgsOfLcd.length, 0, {dataURL: dataURL});
        }
        callback(null, {
          topoId: lcdScreenCfg.topoId, 
          bgsOfLcd: bgsOfLcd, 
          totalCnt: totalCnt
        });
      };
    },
    doSubmit: function(canvas, resetState) {
      swal({
        title: "Are you sure?",
        text: "Please Make Sure All Device Is Online!",
        type: "info",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Upload & Sync",
        closeOnConfirm: false,
        showLoaderOnConfirm: true,      
      }, 
      function() {
        this.backgroundInfo.progress = 0;
        async.waterfall([
          function(callback) {
            callback(null, canvas);
          }, 
          this.makeBackgroundData,
          this.uploadBackgroundData,
          this.syncToDec,
          ], function(err, result) {
            if (err) {
              log.showError(err);
            } else {
              log.showSuccess('Upload Success, Please Wait Server Sync To Device!');
            }
        });        
      }.bind(this));
      resetState();
    },
    initLcdCfg: function() {
      var lcdScreenCfg = this.getCurrLcdScreenCfg();
      if (lcdScreenCfg != null) {
        this.lcdScreenCfg = lcdScreenCfg;
        if ((lcdScreenCfg.multiScreenX > 8)
          || (lcdScreenCfg.multiScreenY > 8)) {
          swal({
            title: 'Opps!',
            text: lcdScreenCfg.multiScreenX + 'x' + lcdScreenCfg.multiScreenY + ' Is Too Bigger Than 8x8',
            type: "error",
            showConfirmButton: true
          });          
          return;
        }
        this.backgroundInfo.params.multiScreenX = lcdScreenCfg.multiScreenX;
        this.backgroundInfo.params.multiScreenY = lcdScreenCfg.multiScreenY;
      }
    },
    onTopoLcdChange: function() {
      this.initLcdCfg();
    },
    getCurrLcdScreenCfg: function() {
      var topoLcdDev = this.topoLcdDevs[this.currTopoLcdDev];
      var cfg = {
        multiScreenX: 1,
        multiScreenY: 1,
        topoId: -1
      }
      if (!topoLcdDev) {
        return null;
      }
      cfg.topoId = topoLcdDev.topoId;
      if (topoLcdDev.devModel.indexOf('lcdwall') != -1) {
        var multis = topoLcdDev.devModel.split('.')[2];
        cfg.multiScreenX = parseInt(multis[0] + multis[1]);
        cfg.multiScreenY = parseInt(multis[2] + multis[3])
        //log.DEBUG_TRACE('multiScreenX: ' + cfg.multiScreenX);
        //log.DEBUG_TRACE('multiScreenY: ' + cfg.multiScreenY);
      }

      return cfg;
    },
  },
  created: function() {
    this.$on('topoDevsSummary', function(list) {
      this.topoLcdDevs.splice(0, this.topoLcdDevs.length);
      _.each(list, function(item, index, list) {
        if (item.devModel.indexOf('lcd') != -1) {
          this.topoLcdDevs.splice(0, 0, item);
        }
      }, this);

      this.initLcdCfg();
    });
  }
}
</script>

<style>
</style>