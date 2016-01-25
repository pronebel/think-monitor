<template>
<form method="post" action="#" v-on="submit: onSubmit">
  <div class="form-group">
    <span>NTP服务器地址</span>
    <input type="text" class="form-control" v-model="ntpdServer" v-attr='disabled: !(ntpRole==="server")'>
  </div>
  <div class="form-group">
    <span>设备时间</span>
    <div class="input-group"> 
      <input type="text" class="form-control" v-model="showTime" readonly>
      <span class="input-group-btn">
        <button class="btn btn-default" type="button" v-on="click: onSyncPc">同步计算机时间</button>
      </span>
    </div>
  </div>
  <button class="btn btn-default" v-attr='disabled: !(ntpRole === "client")' v-on="click: onSyncServer">同步服务器时间</button>
  <button type="submit" class="btn btn-default">保存</button>
</form>
</template>

<script>
var hostname = require('../lib/settings').hostname;
var platformApi = require('../lib/platformApi');
var utils = require('../lib/utils');
var log = require('../lib/log');

module.exports = {
  replace: true,
  props: ['mainServerIp', 'ntpdServer'],
  data: function() {
    return {
      showTime: ''
    }
  },
  computed: {
    'ntpRole': function() {
      if (this.mainServerIp === '') {
        return 'unknown';
      } else {
        if (this.mainServerIp === hostname) {
          return 'server';
        } else {
          return 'client';
        }
      }
    }
  },
  methods: {
    doGetSystemTime: function() {
      platformApi.system.sendCmd('getSystemTime', null, function(res) {
        if (res && res.code === 0) {
          var devDate = new Date(Date.parse(res.data.paramlist.time));
          this.now = devDate;
          //console.log(devDate.toLocaleString());
        }
      }.bind(this));
    },
    onSubmit: function(e) {
      e && e.preventDefault();
      var paramlist = {
        time: utils.getTimeStr(this.now)
      };
      platformApi.system.sendCmd('setSystemTime', paramlist);

      if (this.ntpRole === 'server') {
        var req = {
          _info: {
            ntpd: {
              server: this.ntpdServer
            }
          }
        };
        platformApi.system.setCfg(req);
      }
    },
    onSyncServer: function(e) {
      var paramlist = {
        server: this.mainServerIp
      };
      platformApi.system.sendCmd('syncNtpdate', paramlist);
      log.showWait('Sync', 6);

      var router = this.$route.router;
      setTimeout(function() {
        location.reload(true);
      }, 6000);
    },
    onSyncPc: function() {
      var now = new Date();
      this.showTime = now.toLocaleString();
      this.now = now;
    },
    tick: function() {
      if (this.now != undefined) {
        var time = this.now.valueOf();
        time += 1000;
        this.now = new Date(time);
        this.showTime = this.now.toLocaleString();
      }
      this.tickTimeOut = setTimeout(this.tick, 1000);
    }
  },
  ready: function() {
    this.doGetSystemTime();
    this.tickTimeOut = setTimeout(this.tick, 1000);
  },
  beforeDestroy: function() {
    clearTimeout(this.tickTimeOut);
  }
}
</script>

<style>
</style>