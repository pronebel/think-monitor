<template>
<form method="post" action="#" v-on="submit: onSubmit, reset: onReset">
  <div class="checkbox" v-if="cfg.showEnable">
    <label>
      <input type="checkbox" v-model="netCfg.enable" true-exp=1 false-exp=0> 启用网口
    </label>
  </div>
  <div class="checkbox" v-if="cfg.showDhcp">
    <label>
      <input type="checkbox" v-model="netCfg.dhcp" true-exp=1 false-exp=0> 自动获取IP
    </label>
  </div>
  <div class="form-group" v-class="has-error: !validIpaddr">
    <span>IP地址</span>
    <input type="text" class="form-control" v-model="netCfg.ipaddr" v-attr="readonly: netCfg.dhcp==1">
  </div>
  <div class="form-group" v-class="has-error: !validNetmask">
    <span>子网掩码</span>
    <input type="text" class="form-control" v-model="netCfg.netmask" v-attr="readonly: netCfg.dhcp==1">
  </div>
  <div class="form-group" v-class="has-error: !validGateway">
    <span>默认网关</span>
    <input type="text" class="form-control" v-model="netCfg.gateway" v-attr="readonly: netCfg.dhcp==1">
  </div>
  <div class="form-group" v-if="cfg.showDns">
    <span>DNS地址</span>
    <input type="text" class="form-control" v-model="netCfg.dns" v-attr="readonly: netCfg.dhcp==1">
  </div>
  <button type="submit" class="btn btn-default">保存</button>
  <button type="reset" class="btn btn-default">重置</button>
</form>
</template>

<script>
var isValidIp = require('../lib/utils').isValidIp;
var log = require('../lib/log');

module.exports = {
  replace: true,
  props: ['cfg', 'params', 'doSave'],
  data: function() {
    return {
      netCfg: {
        phyIntf: '',
        enable: 1,
        macaddr: '',
        dhcp: 1,
        ipaddr: '',
        netmask: '',
        gateway: '',
        dns: ''
      }
    }
  },
  computed: {
    validIpaddr: function() {
      return isValidIp(this.netCfg.ipaddr);
    },
    validNetmask: function() {
      return isValidIp(this.netCfg.netmask);
    },
    validGateway: function() {
      return isValidIp(this.netCfg.gateway);
    }
  },
  methods: {
    initNetCfg: function(params) {
      this.netCfg.phyIntf = params.phyIntf;
      this.netCfg.dhcp = params.dhcp;
      if (params.enable != undefined) {
        this.netCfg.enable = params.enable;
      }
      this.netCfg.macaddr = params.macaddr;
      this.netCfg.ipaddr = params.ipaddr;
      this.netCfg.netmask = params.netmask;
      this.netCfg.gateway = params.gateway;
      if (params.dns != undefined) {
        this.netCfg.dns = params.dns;
      }    
    },
    onSubmit: function(e) {
      e && e.preventDefault();
      if (this.validIpaddr && this.validNetmask && this.validGateway) {
        this.doSave(this.netCfg);
      } else {
        log.ERROR_TRACE('Invalid Params');
      }
    },
    onReset: function(e) {
      e && e.preventDefault();
      this.initNetCfg(this.params);
    }
  },
  watch: {
    'params': function(newVal, oldVal) {
      this.initNetCfg(newVal);
    },
    'netCfg.enable': function(newVal, oldVal) {
      if (newVal === 0) {
        swal({
          title: 'Warning',
          text: 'Disable lan may cause the admin web is not available',
          type: 'warning',
          showConfirmButton: true
        });
      }
    }
  },
  ready: function() {
    this.initNetCfg(this.params);
  }
}
</script>

<style>
</style>