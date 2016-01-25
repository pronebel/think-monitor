<template>
<ms-vid-layout ops="{{ ops}}"></ms-vid-layout>
<ms-open-window stream-src="{{ streamSrc}}"></ms-open-window>
<ms-record-room ops="{{ ops}}"></ms-record-room>
<ms-topo-lcd></ms-topo-lcd>
</template>

<script>
var serverApi = require('../lib/serverApi');
var log = require('../lib/log');

module.exports = {
  props: ['productCfg'],
  components: {
    msVidLayout: require('./ms-vid-layout.vue'),
    msOpenWindow: require('./ms-open-window.vue'),
    msRecordRoom: require('./ms-record-room.vue'),
    msTopoLcd: require('./ms-topo-lcd.vue'),
  },
  data: function() {
    return {
      streamSrc: {
        lists: [],
        state: {
          listsLoading: true
        }
      },
      ops: {
        getStreamSrcName: this.getStreamSrcName
      }
    }
  },
  methods: {
    doLoadTopoDevs: function() {
      serverApi.devmng.getItems('topoDevsSummary', function(res) {
        if (res && res.code == 0) {
          this.$broadcast('topoDevsSummary', res.data.topoDevsSummary);
        }
      }.bind(this));
    },
    doLoadVidLayouts: function() {
      serverApi.multimedia.getItems('vidLayouts', function(res) {
        if (res && res.code == 0) {
          this.$broadcast('vidLayouts', res.data.vidLayouts);
        }
      }.bind(this));  
    },
    doLoadDevMngState: function() {
      serverApi.devmng.getState(function(res) {
        if (res && res.code == 0) {
          this.$broadcast('devmngState', res.data);
        }
      }.bind(this));
    },
    doLoadEncoders: function() {
      serverApi.streamsrc.getItems('encoders', function(res) {
        if (res && res.code == 0) {
          _.each(res.data.encoders, function(item, index, list) {
            this.streamSrc.lists.splice(this.streamSrc.lists.length, 0, {
              _checked: 0,
              topoId: item.topoId,
              name: item.name,
              portName: item.portName,
              mainUrl: item.mainUrl,
              previewUrl: item.previewUrl,
              srcType: 'encoder',
              srcTypeText: '编码器'
            });
          }, this);
        }
        this.streamSrc.state.listsLoading = false;
      }.bind(this));
    },
    doLoadIpcams: function() {
      serverApi.streamsrc.getItems('ipcameras', function(res) {
        if (res && res.code == 0) {
          _.each(res.data.ipcameras, function(item, index, list) {
            this.streamSrc.lists.splice(this.streamSrc.lists.length, 0, {
              _checked: 0,
              topoId: 0,
              name: item.name,
              portName: 'ipc_' + item._id,
              mainUrl: item.mainUrl,
              previewUrl: item.previewUrl,
              srcType: 'ipcam',
              srcTypeText: '网络摄像机'
            });
          }, this);
        }
        this.streamSrc.state.listsLoading = false;
      }.bind(this));
    },
    doLoadSoftencs: function() {
      serverApi.streamsrc.getItems('softencs', function(res) {
        if (res && res.code == 0) {
          _.each(res.data.softencs, function(item, index, list) {
            this.streamSrc.lists.splice(this.streamSrc.lists.length, 0, {
              _checked: 0,
              topoId: 0,
              name: item.name,
              portName: 'softenc_' + item._id,
              mainUrl: item.mainUrl,
              previewUrl: item.previewUrl,
              srcType: 'softenc',
              srcTypeText: '软编码器'
            });
          }, this);
        }
        this.streamSrc.state.listsLoading = false;
      }.bind(this));
    },
    doLoadProxys: function() {
      serverApi.streamsrc.getItems('proxys', function(res) {
        if (res && res.code == 0) {
          _.each(res.data.proxys, function(item, index, list) {
            this.streamSrc.lists.splice(this.streamSrc.lists.length, 0, {
              _checked: 0,
              topoId: item.topoId,
              name: item.name,
              portName: item.portName,
              mainUrl: item.mainUrl,
              previewUrl: item.previewUrl,
              srcType: 'proxy',
              srcTypeText: '转发流'
            });
          }, this);
        }
        this.streamSrc.state.listsLoading = false;
      }.bind(this));
    },
    doLoadStreamSrc: function() {
      this.streamSrc.lists.splice(0, this.streamSrc.lists.length);
      this.doLoadEncoders();
      this.doLoadIpcams();
      this.doLoadSoftencs();
      this.doLoadProxys();
    },
    getStreamSrcName: function(srcTopoId, srcPortName) {
      for (var i = 0; i < this.streamSrc.lists.length; i++) {
        var item = this.streamSrc.lists[i];
        if ((item.topoId === srcTopoId)
          && (item.portName === srcPortName)) {
          return item.name;
        }
      }
      return '[' + srcTopoId + '][' + srcPortName + ']';
    }
  },
  created: function() {
    this.$on('get-topoDevsSummary', function() {
      log.DEBUG_TRACE('get-topoDevsSummary');
      this.doLoadTopoDevs();
    });
    this.$on('get-vidLayouts', function() {
      this.doLoadVidLayouts();
    });
    this.$on('get-devmngState', function() {
      this.doLoadDevMngState();
    });
    this.$on('get-streamSrc', function() {
      this.doLoadStreamSrc();
    });
  },
  ready: function() {
    this.doLoadDevMngState();
    this.doLoadTopoDevs();
    this.doLoadVidLayouts();
  }
}
</script>

<style>
</style>