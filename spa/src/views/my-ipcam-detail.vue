<template>
<form class="form-horizontal">
  <div class="form-group">
    <label class="col-sm-2 control-label">名字</label>
    <div class="col-sm-10">
      <input type="text" class="form-control" v-model="ipcamCfg.name">
    </div>
  </div>
  <div class="form-group">
    <label class="col-sm-2 control-label">厂商</label>
    <div class="col-sm-10">
      <select class="form-control" v-model="ipcamCfg.manufacture" options="manufactureOptions">
      </select>
    </div>
  </div>  
  <div class="form-group">
    <label class="col-sm-2 control-label">产品型号</label>
    <div class="col-sm-10">
      <select class="form-control" v-model="ipcamCfg.productModel" options="productModelOptions">
      </select>
    </div>
  </div>
  <div class="form-group" v-class="has-error: !validIpaddr">
    <label class="col-sm-2 control-label">IP地址</label>
    <div class="col-sm-10">
      <input type="text" class="form-control" v-model="ipcamCfg.ipaddr" v-on="change: onChange">
    </div>
  </div>
  <div class="form-group" v-class="has-error: !validPort">
    <label class="col-sm-2 control-label">端口号</label>
    <div class="col-sm-10">
      <input type="text" class="form-control" v-model="ipcamCfg.port" number v-on="change: onChange">
    </div>
  </div>
  <div class="form-group">
    <label class="col-sm-2 control-label">用户名</label>
    <div class="col-sm-10">
      <input type="text" class="form-control" v-model="ipcamCfg.username">
    </div>
  </div>
  <div class="form-group">
    <label class="col-sm-2 control-label">通道号</label>
    <div class="col-sm-10">
      <input type="text" class="form-control" v-model="ipcamCfg.channel" number>
    </div>
  </div>
  <div class="form-group">
    <label class="col-sm-2 control-label">密码</label>
    <div class="col-sm-10">
      <input type="text" class="form-control" v-model="ipcamCfg.password">
    </div>
  </div>
  <div class="form-group" v-if="ipcamCfg._id <= 0">
    <div class="col-sm-offset-2 col-sm-10">
      <div class="checkbox">
        <label>
          <input type="checkbox" v-model="ipcamCfg.subStatus" true-exp=1 false-exp=0> 启用次码流
        </label>
      </div>
    </div>
  </div>
  <div class="form-group">
    <label class="col-sm-2 control-label">标签</label>
    <div class="col-sm-10">
      <input type="text" class="form-control" v-model="ipcamCfg.tag" placeholder="使用“|”分割多个标签">
    </div>
  </div>
  <div class="form-group">
    <div class="col-sm-offset-2 col-sm-10">
      <div class="checkbox">
        <label>
          <input type="checkbox" v-model="ipcamCfg.useCustomUrl" true-exp=1 false-exp=0> 自定义URL
        </label>
      </div>
    </div>
  </div>
  <div class="form-group">
    <label class="col-sm-2 control-label">主码流地址</label>
    <div class="col-sm-10">
      <input type="text" class="form-control" v-model="ipcamCfg.mainUrl" placeholder="rtsp://[username]:[password]@[ipaddr]:[port]/[path]" v-attr="readonly: ipcamCfg.useCustomUrl==0">
    </div>
  </div>
  <div class="form-group">
    <label class="col-sm-2 control-label">次码流地址</label>
    <div class="col-sm-10">
      <input type="text" class="form-control" v-model="ipcamCfg.previewUrl" placeholder="rtsp://[username]:[password]@[ipaddr]:[port]/[path]" v-attr="readonly: ipcamCfg.useCustomUrl==0">
    </div>
  </div>
</form>
</template>

<script>
var checkValidIp = require('../lib/utils').checkValidIp;
var isValidPort = require('../lib/utils').isValidPort;
var log = require('../lib/log');
var _ = require('underscore');

module.exports = {
  replace: true,
  props: ['ipcamCfg', 'vendorLists'],
  data: function() {
    return {
      manufactureOptions: [],
      productModelOptions: []
    }
  },
  methods: {
    onChange: function() {
      this.ipcamCfg.valid = this.validIpaddr && this.validPort;
      log.DEBUG_TRACE(this.ipcamCfg.valid);
    }
  },
  watch: {
    'vendorLists': function(newVal, oldVal) {
      var allManufactures = _.map(newVal, function(item) {
        return item.manufacture;
      });
      this.manufactureOptions = _.uniq(allManufactures);
    },
    'ipcamCfg.manufacture': function(newVal, oldVal) {
      var allManufactures = _.filter(this.vendorLists, function(item) {
        return item.manufacture === newVal;
      });
      var allProductModels = _.map(allManufactures, function(item) {
        return JSON.parse(item.productModels);
      });
      this.productModelOptions = _.union(_.flatten(allProductModels));
      this.ipcamCfg.productModel = _.first(this.productModelOptions);
    }
  },
  computed: {
    validIpaddr: function() {
      return checkValidIp(this.ipcamCfg.ipaddr);
    },
    validPort: function() {
      return isValidPort(this.ipcamCfg.port);
    }
  }
}
</script>

<style>
</style>