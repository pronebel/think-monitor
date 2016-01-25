<template>
<form method="post" action="#" v-on="submit: onSubmit">
  <div class="checkbox">
    <label>
      <input type="checkbox" v-model="params.ntpEnable" true-exp=1 false-exp=0> 启用NTP
    </label>
  </div>
  <div class="form-group">
    <span>NTP服务器地址</span>
    <input type="text" class="form-control" v-model="params.ntpServer" v-attr="readonly: params.ntpEnable==0">
  </div>
  <div class="form-group">
    <span>当前时间</span>
    <div class="input-group"> 
      <input type="text" class="form-control" v-model="showTime" readonly>
      <span class="input-group-btn">
        <button class="btn btn-default" type="button" v-on="click: onSyncPc">同步计算机时间</button>
      </span>
    </div>
  </div>
  <button type="submit" class="btn btn-default">保存</button>
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
      showTime: ''
    }
  },
  methods: {
    onSubmit: function(e) {
      e && e.preventDefault();
      this.params.date = utils.getTimeStr(this.now);
      this.doSave();
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
    },
    parseDate: function(dStr) {
      var tmp = dStr.split('T');
      var ymd = tmp[0].split('-');
      var hms = tmp[1].split(':');
      return new Date(ymd[0], ymd[1]-1, ymd[2], hms[0], hms[1], hms[2]);
    }
  },
  watch: {
    'params.date': function(newVal, oldVal) {
      this.now = this.parseDate(newVal);
    }
  },
  ready: function() {
    if (this.params.date != '') {
      this.now = this.parseDate(this.params.date);
    }
    this.tickTimeOut = setTimeout(this.tick, 1000);
  },
  beforeDestroy: function() {
    clearTimeout(this.tickTimeOut);
  }
}
</script>

<style>
</style>