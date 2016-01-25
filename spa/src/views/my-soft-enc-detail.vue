<template>
<form class="form-horizontal">
  <div class="form-group">
    <label class="col-sm-2 control-label">名字</label>
    <div class="col-sm-10">
      <input type="text" class="form-control" v-model="softEncCfg.name">
    </div>
  </div>
  <div class="form-group" v-class="has-error: !validIpaddr">
    <label class="col-sm-2 control-label">IP地址</label>
    <div class="col-sm-10">
      <input type="text" class="form-control" v-model="softEncCfg.ipaddr" v-on="change: onChange">
    </div>
  </div>
  <div class="form-group" v-class="has-error: !validPort">
    <label class="col-sm-2 control-label">端口号</label>
    <div class="col-sm-10">
      <input type="text" class="form-control" v-model="softEncCfg.port" number v-on="change: onChange">
    </div>
  </div>
  <div class="form-group">
    <label class="col-sm-2 control-label">标签</label>
    <div class="col-sm-10">
      <input type="text" class="form-control" v-model="softEncCfg.tag" placeholder="使用“|”分割多个标签">
    </div>
  </div>
  <div class="form-group" v-if="softEncCfg._id > 0">
    <label class="col-sm-2 control-label">主码流地址</label>
    <div class="col-sm-10">
      <p class="form-control-static">{{softEncCfg.mainUrl}}</p>
    </div>
  </div>
  <div class="form-group" v-if="softEncCfg._id > 0">
    <label class="col-sm-2 control-label">次码流地址</label>
    <div class="col-sm-10">
      <p class="form-control-static">{{softEncCfg.previewUrl}}</p>
    </div>
  </div>
</form>
</template>

<script>
var checkValidIp = require('../lib/utils').checkValidIp;
var isValidPort = require('../lib/utils').isValidPort;
var log = require('../lib/log');

module.exports = {
  replace: true,
  props: ['softEncCfg'],
  methods: {
    onChange: function() {
      this.softEncCfg.valid = this.validIpaddr && this.validPort;
    }
  },
  computed: {
    validIpaddr: function() {
      return checkValidIp(this.softEncCfg.ipaddr);
    },
    validPort: function() {
      return isValidPort(this.softEncCfg.port);
    }
  }
}
</script>

<style>
</style>