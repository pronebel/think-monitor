<template>
<div class="row">
  <div class="col-md-12">
    <rd-widget>
      <rd-widget-header header="{{* sysInfo.header}}">
      </rd-widget-header>
      <rd-widget-body>
        <my-sys-info lists={{sysInfo.lists}}></my-sys-info>
      </rd-widget-body>
    <rd-widget>    
  </div>
  <div class="col-md-12" v-repeat="ipItem in ipItems">
    <rd-widget>
      <rd-widget-header header="{{* ipItem.header}}">
      </rd-widget-header>
      <rd-widget-body>
        <my-lan-cfg cfg="{{* ipShowCfg}}" params={{ipItem.params}} do-save={{doSaveNetCfg}}></my-lan-cfg>
      </rd-widget-body>
    <rd-widget>
  </div>
  <div class="col-md-12">
    <rd-widget>
      <rd-widget-header header="{{* timeInfo.header}}">
      </rd-widget-header>
      <rd-widget-body>
        <my-time-cfg params="{{@ timeInfo.params}}" do-save={{doSaveTimeCfg}}></my-time-cfg>
      </rd-widget-body>
    <rd-widget>    
  </div>
  <div class="col-md-12">
    <rd-widget>
      <rd-widget-header header="{{* patitionInfo.header}}">
      </rd-widget-header>
      <rd-widget-body>
        <my-table cfg="{{* patitionInfo.cfg}}" lists="{{patitionInfo.lists}}"></my-table>
      </rd-widget-body>
    <rd-widget>
  </div>
  <div class="col-md-12">
    <rd-widget>
      <rd-widget-header header="{{* storageInfo.header}}">
      </rd-widget-header>
      <rd-widget-body>
        <my-record-storage-cfg params="{{@ storageInfo.params}}" do-save={{doSaveStorageCfg}}></my-record-storage-cfg>
      </rd-widget-body>
    <rd-widget>
  </div>
  <div class="col-md-12">
    <rd-widget>
      <rd-widget-header header="{{* multicastInfo.header}}">
      </rd-widget-header>
      <rd-widget-body>
        <my-multicast-cfg params="{{@ multicastInfo.params}}" do-save={{doSaveMulticastCfg}}></my-multicast-cfg>
      </rd-widget-body>
    <rd-widget>
  </div>
  <div class="col-md-12">
    <rd-widget>
      <rd-widget-header header="{{* upgradeInfo.header}}">
      </rd-widget-header>
      <rd-widget-body>
        <div class="progress">
          <vs-progressbar now="{{upgradeInfo.progress}}" type="primary" striped animated></vs-progressbar>
        </div>        
        <my-file-upload params="{{* upgradeInfo.params}}" progress="{{@ upgradeInfo.progress}}"></my-file-upload>
      </rd-widget-body>
    <rd-widget>
  </div>
</div>
</template>

<script>
var api = require('../lib/api');
var log = require('../lib/log');
var mediaServerApi = require('../lib/mediaServerApi');

module.exports = {
  components: {
    mySysInfo: require('./my-sys-info.vue'),
    myLanCfg: require('../components/my-lan-cfg.vue'),
    myTimeCfg: require('../components/my-time-cfg.vue'),
    myRecordStorageCfg: require('../components/my-record-storage-cfg.vue'),
    myMulticastCfg: require('../components/my-multicast-cfg.vue'),
    myFileUpload: require('./my-file-upload.vue'),
  },
  data: function() {
    return {
      sysInfo: {
        header: {
          icon: 'fa fa-info',
          title: '系统信息'
        },
        lists: require('../configs/sysInfoCfg')
      },
      ipShowCfg: {
        showDhcp: false,
        showDns: true,
        showEnable: true
      },
      ipItems: [{
        header: {
          icon: 'fa fa-edit',
          title: 'LAN1'
        },
        params: {
          phyIntf: '',
          enable: 1,
          macaddr: '',
          dhcp: 0,
          ipaddr: '',
          netmask: '',
          gateway: '',
          dns: ''     
        }
      }, {
        header: {
          icon: 'fa fa-edit',
          title: 'LAN2'
        },
        params: {
          phyIntf: '',
          enable: 1,
          macaddr: '',
          dhcp: 0,
          ipaddr: '',
          netmask: '',
          gateway: '',
          dns: ''        
        }
      }],
      patitionInfo: {
        header: {
          icon: 'fa fa-list',
          title: '分区信息'
        },
        cfg: {
          isCheckable: false,
          isShowHead: true,
          isShowOperation: false,
          columns: [{
            field: 'type',
            text: '类型',
            width: '10%'
          }, {
            field: 'localDisk',
            text: '名字',
            width: '20%'
          }, {
            field: 'localMount',
            text: '路径',
            width: '30%'
          }, {
            field: 'sizeInfo',
            text: '容量',
            width: 'auto'
          }]
        },
        state: {
          listsLoading: true
        }, 
        lists: [{
          type: "local",
          localDisk: "sda1",
          localMount: "/mnt/record/d1",
          localTotalSize: "250G",
          localFreeSize: "30G",
          sizeInfo: "30G/250G"
        }, {
          type: "local",
          localDisk: "sda2",
          localMount: "/mnt/record/d2",
          localTotalSize: "250G",
          localFreeSize: "512M",
          sizeInfo: "512M/250G"
        }]
      },
      storageInfo: {
        header: {
          icon: 'fa fa-edit',
          title: '存储配置'
        },
        params: {
          storePolicy: "overwrite",
          sizePerFile: 512000000
        }
      },
      timeInfo: {
        header: {
          icon: 'fa fa-edit',
          title: '时间配置'
        },
        params: {
          ntpEnable: 0,
          ntpServer: '',
          date: ''
        }
      },
      multicastInfo: {
        header: {
          icon: 'fa fa-edit',
          title: '组播配置'
        },
        params: {
          enable: 1,
          multiIpaddr: '',
          portStart: 9000,
          portEnd: 27000
        }
      },
      upgradeInfo: {
        header: {
          icon: 'fa fa-file',
          title: '软件升级'
        },
        params: {
          moduleName: 'MediaServer',
          typeCfg: 'upgrade',
          maxSize: 50*1024*1024,
          success: this.uploadFirmwareSuccess,
          error: this.uploadError,
          fixedName: 'MediaServer.tar.gz'
        },
        progress: 0
      }
    }
  },
  methods: {
    doSaveTimeCfg: function() {
      var timeCfg = this.timeInfo.params;
      var req1 = {
        time: {
          date: timeCfg.date
        }
      };
      var req2 = {
        ntpServer: {
          enable: timeCfg.ntpEnable,
          serverName: timeCfg.ntpServer
        }
      };

      log.showWait('Saving', 1);

      mediaServerApi.record.setCfg(req1, function(res) {
        if (res === undefined || res.code != 0) {
          log.showErrorWithRes(res);
        }
      });
      mediaServerApi.record.setCfg(req2, function(res) {
        if (res === undefined || res.code != 0) {
          log.showErrorWithRes(res);
        }
      });
    },
    doSaveNetCfg: function(netCfg) {
      var router = this.$route.router;
      var req = {
        lan: {}
      }

      if (netCfg.phyIntf === 'eth0') {
        req.lan['0'] = netCfg;
      } else if (netCfg.phyIntf === 'eth1') {
        req.lan['1'] = netCfg;
      } else {
        return;
      }

      log.DEBUG_TRACE(JSON.stringify(req));

      mediaServerApi.record.setCfg(req);
      swal({
        title: 'Saved!',
        text: 'Please reconnect the device.',
        type: "success",
        showConfirmButton: true,
        showLoaderOnConfirm: true,
      }, 
      function() {
        setTimeout(function() {
          router.go('/');
        }, 2000);
      });
    },
    doSaveMulticastCfg: function(multicastCfg) {
      var req = {
        multicast: multicastCfg
      };

      log.showWait('Saving', 1);

      mediaServerApi.record.setCfg(req, function(res) {
        if (res === undefined || res.code != 0) {
          log.showErrorWithRes(res);
        }
      });      
    },
    doSaveStorageCfg: function(storageCfg) {
      var req = {
        storage: storageCfg
      };

      log.showWait('Saving', 1);

      mediaServerApi.record.setCfg(req, function(res) {
        if (res === undefined || res.code != 0) {
          log.showErrorWithRes(res);
        }
      });
    },
    uploadFirmwareSuccess: function(res) {
      swal({
        title: 'Upload Success!',
        text: "Upgrade NOW?",
        type: "success",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, upgrade now!",
        closeOnConfirm: false,
        showLoaderOnConfirm: true, 
      }, 
      function() {
        var paramlist = {
          fileName: '/opt/upgrade/MediaServer.tar.gz'
        };
        mediaServerApi.record.sendCmd('updateSoftware', paramlist);
        setTimeout(function() {
          swal.close();
          location.reload(true);
        }, 5*1000);         
      });   
    },
    uploadError: function(res) {
      log.showErrorWithRes(res);
    },
    doLoadRecordCfg: function() {
      mediaServerApi.record.getCfg(function(res) {
        if (res === undefined || res.code != 0) {
          return;
        }
        var lan = res.data.lan;
        for (var i in lan) {
          if (lan[i].phyIntf === 'eth0') {
            this.ipItems[0].params = lan[i];
          }
          if (lan[i].phyIntf === 'eth1') {
            this.ipItems[1].params = lan[i];
          }
        }

        var time = res.data.time;
        this.timeInfo.params.date = time.date;

        var ntpServer = res.data.ntpServer;
        this.timeInfo.params.ntpEnable = ntpServer.enable;
        this.timeInfo.params.ntpServer = ntpServer.serverName;

        this.multicastInfo.params = res.data.multicast;

        this.storageInfo.params = res.data.storage;
      }.bind(this));

      mediaServerApi.record.getItems('patitions', function(res) {
        if (res === undefined || res.code != 0) {
          return;
        }

        this.patitionInfo.lists.splice(0, this.patitionInfo.lists.length);
        _.each(res.data.patitions, function(item, index, list) {
          this.splice(this.length, 0, {
            type: item.type,
            localDisk: item.localDisk,
            localMount: item.localMount,
            localTotalSize: item.localTotalSize,
            localFreeSize: item.localFreeSize,
            sizeInfo: item.localFreeSize + '/' + item.localTotalSize
          });
        }, this.patitionInfo.lists);
      }.bind(this));
    },
    doLoadSysCfg: function() {
      mediaServerApi.record.sendCmd('querySysInfo', null, function(res) {
        if (res && res.code == 0) {
          var sysInfo = res.data;
          _.each(this.sysInfo.lists, function(item, index, lists) {
            if (sysInfo[item.field]) {
              item.value = sysInfo[item.field];
            }
          });
        }
      }.bind(this));
      api.utils.getPlatformCfg(function(res) {
        if (res && res.code == 0) {
          var sysInfo = res.data;
          _.each(this.sysInfo.lists, function(item, index, lists) {
            if (item.field === 'devSN') {
              item.value = sysInfo.devSN;
            } else if (item.field === 'devModel') {
              item.value = sysInfo.devModel;
            }
          });
        }
      }.bind(this));
    }
  },
  ready: function () {
    this.doLoadRecordCfg();
    this.doLoadSysCfg();
  } 
}
</script>

<style>
</style>