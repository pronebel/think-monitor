<template>
<form method="post" action="#" v-on="submit: onSubmit, reset: onReset">
  <div class="checkbox">
    <label>
      <input type="checkbox" v-model="cfg.enable" true-exp=1 false-exp=0> 启用组播
    </label>
  </div>
  <div class="form-group" v-class="has-error: !validMultiIpaddr">
    <span>组播地址</span>
    <div class="input-group">
      <span class="input-group-btn">
        <button class="btn btn-default" type="button" v-on="click: onRandGen">随机指定</button>
      </span>
      <input type="text" class="form-control" v-model="cfg.multiIpaddr" placeholder="225.0.0.0~238.255.255.255">     
    </div>
  </div>
  <div class="form-group" v-class="has-error: !validPortLimit">
    <span>端口范围</span>
    <div class="input-group">
      <input type="text" class="form-control" v-model="cfg.portStart" number placeholder="请输入一个不小于9000数">
      <div class="input-group-addon">-</div>
      <input type="text" class="form-control" v-model="cfg.portEnd" number placeholder="请输入一个不大于65535数">
    </div>
  </div>
  <button type="submit" class="btn btn-default">保存</button>
  <button type="reset" class="btn btn-default">重置</button>
</form>
</template>

<script>
var log = require('../lib/log');
var utils = require('../lib/utils');

module.exports = {
  replace: true,
  props: ['params', 'doSave'],
  data: function() {
    return {
      cfg: {
        enable: 1,
        multiIpaddr: '',
        portStart: 9000,
        portEnd: 27000
      }
    }
  },
  computed: {
    validMultiIpaddr: function() {
      return utils.checkValidIp(this.cfg.multiIpaddr) && utils.checkValidMultiIp(this.cfg.multiIpaddr);
    },
    validPortLimit: function() {
      return (this.cfg.portEnd > this.cfg.portStart) && (this.cfg.portStart >= 9000) && (this.cfg.portEnd <= 65535);
    }
  },
  methods: {
    initCfg: function(params) {
      this.cfg.enable = params.enable;
      this.cfg.multiIpaddr = params.multiIpaddr; 
      this.cfg.portStart = params.portStart; 
      this.cfg.portEnd = params.portEnd; 
    },
    onRandGen: function(e) {
      e && e.preventDefault();
      var p1 = 225 + Math.floor(Math.random()*13 + 1);
      var p2 = Math.floor(Math.random()*255 + 1);
      var p3 = Math.floor(Math.random()*255 + 1);
      var p4 = Math.floor(Math.random()*255 + 1);
      this.cfg.multiIpaddr = p1 + '.' + p2 + '.' + p3 + '.' + p4;
    },
    onSubmit: function(e) {
      e && e.preventDefault();
      if (this.validMultiIpaddr && this.validPortLimit) {
        this.doSave(this.cfg);
      } else {
        log.ERROR_TRACE('Invalid Params');
      }
    },
    onReset: function(e) {
      e && e.preventDefault();
      this.initCfg(this.params);
    }
  },
  watch: {
    'params': function(newVal, oldVal) {
      this.initCfg(newVal);
    }
  },
  ready: function() {
    this.initCfg(this.params);
  }
}
</script>

<style>
</style>