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
  <div class="col-md-12">
    <rd-widget>
      <rd-widget-header header="{{* sysTime.header}}">
      </rd-widget-header>
      <rd-widget-body>
        <my-sys-time main-server-ip="{{ mainServerIp}}" ntpd-server="{{ ntpdServer}}"></my-sys-time>
      </rd-widget-body>
    <rd-widget>    
  </div>
  <div class="col-md-12">
    <rd-widget>
      <rd-widget-header header="{{* moduleInfo.header}}">
      </rd-widget-header>
      <rd-widget-body>
        <my-module-cfg params={{moduleInfo.params}} do-save={{doSaveModules}}></my-module-cfg>
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
var platformApi = require('../lib/platformApi');
var log = require('../lib/log');

module.exports = {
  components: {
    mySysInfo: require('./my-sys-info.vue'),
    mySysTime: require('./my-sys-time.vue'),
    myLanCfg: require('../components/my-lan-cfg.vue'),
    myModuleCfg: require('./my-module-cfg.vue'),
    myFileUpload: require('./my-file-upload.vue')
  },
  data: function() {
    return {
      mainServerIp: '',
      ntpdServer: '',
      sysInfo: {
        header: {
          icon: 'fa fa-info',
          title: '系统信息'
        },
        lists: require('../configs/sysInfoCfg')
      },
      sysTime: {
        header: {
          icon: 'fa fa-edit',
          title: '时间配置'
        }
      },
      moduleInfo: {
        header: {
          icon: 'fa fa-edit',
          title: '模块配置'
        },
        params: ['codec']
      },
      upgradeInfo: {
        header: {
          icon: 'fa fa-file',
          title: '固件升级'
        },
        params: {
          moduleName: 'Platform',
          typeCfg: 'upgrade',
          maxSize: 150*1024*1024,
          success: this.uploadFirmwareSuccess,
          error: this.uploadError,
          fixedName: 'firmware.tar'
        },
        progress: 0
      },
      ipShowCfg: {
        showDhcp: true,
        showDns: false,
        showEnable: false
      },
      ipItems: [{
        header: {
          icon: 'fa fa-edit',
          title: 'LAN1(POE)'
        },
        params: {
          phyIntf: '',
          enable: 1,
          macaddr: '',
          dhcp: 1,
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
          dhcp: 1,
          ipaddr: '',
          netmask: '',
          gateway: '',
          dns: ''         
        }
      }]
    }
  },
  methods: {
    doLoadSysCfg: function() {
      platformApi.system.getCfg(function(res) {
        var lan = res.data.lan;
        var macaddr = '';
        for (var i = 0; i < lan.length; i++) {
          if (lan[i].phyIntf === 'eth0') {
            this.ipItems[0].params = lan[i];
            macaddr = lan[i].macaddr;
          }
          if (lan[i].phyIntf === 'eth1') {
            this.ipItems[1].params = lan[i];
          }
        }
        var productInfo = res.data._info.product;
        _.each(this.sysInfo.lists, function(item, index, lists) {
          if (productInfo[item.field]) {
            item.value = productInfo[item.field];
          } else if (item.field === 'macaddr') {
            item.value = macaddr;
          }
        });

        var mainServer = res.data._info.mainServer;
        this.mainServerIp = mainServer.ipaddr;

        var ntpd = res.data._info.ntpd;
        this.ntpdServer = ntpd.server;
      }.bind(this));    
    },
    doLoadModules: function() {
      platformApi.storage.getServiceCfg(function(res) {
        if (res && res.runTags) {
          this.moduleInfo.params = JSON.parse(res.runTags);
        } else {
          log.DEBUG_TRACE('No ServiceCfg');
        }
      }.bind(this));
    },
    doSaveNetCfg: function(netCfg) {
      var router = this.$route.router;
      var req = new Object();

      if (netCfg.phyIntf === 'eth0') {
        req['lan.0'] = netCfg;
      } else if (netCfg.phyIntf === 'eth1') {
        req['lan.1'] = netCfg;
      } else {
        return;
      }

      log.DEBUG_TRACE(JSON.stringify(req));

      platformApi.system.setCfg(req);
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
    doSaveModules: function(modules) {
      var router = this.$route.router;

      swal({
        title: "Are you sure?",
        text: "The device need to restart, You need to wait for 1 minute.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, change it!",
        closeOnConfirm: false,
        showLoaderOnConfirm: true,      
      }, 
      function() {
        var paramlist = {
          runTags: JSON.stringify(modules)
        }
        platformApi.system.sendCmd('setServiceCfg', paramlist, function(res) {
          if (res.code === 0) {
            platformApi.system.sendCmd('restart');
            setTimeout(function() {
              swal.close();
              //router.go('/');
              location.reload(true);
            }, 1*60*1000);
          } else {
            swal({
              title: 'Opps!',
              text: res.msg ? res.msg: 'Code:' + res.code,
              type: "error",
              showConfirmButton: true
            });            
          }
        });
      }.bind(this));
    },
    uploadFirmwareSuccess: function(res) {
      swal({
        title: 'Upload Success!',
        text: "The Device Need Reboot To Update the Firmware, reboot NOW?",
        type: "success",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, reboot now!",
        closeOnConfirm: false,
        showLoaderOnConfirm: true, 
      }, 
      function() {
        platformApi.system.sendCmd('restart');
        setTimeout(function() {
          swal.close();
          location.reload(true);
        }, 5*60*1000);         
      });   
    },
    uploadError: function(res) {
      swal({
        title: 'Opps!',
        text: res.msg ? res.msg: 'Connect Fail!',
        type: "error",
        showConfirmButton: true
      });
    } 
  },
  ready: function () {
    this.doLoadSysCfg();
    this.doLoadModules();
  }  
}
</script>

<style>
</style>