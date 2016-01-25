<template>
<form class="form-horizontal">
  <div class="form-group" v-class="has-error: !validManufacture">
    <label class="col-sm-2 control-label">厂商</label>
    <div class="col-sm-10">
      <input type="text" class="form-control" v-model="ipcamVendorCfg.manufacture" v-on="change: onChange">
    </div>
  </div>  
  <div class="form-group" v-class="has-error: !validProductModelsEdit">
    <label class="col-sm-2 control-label">产品型号</label>
    <div class="col-sm-10">
      <input type="text" class="form-control" v-model="ipcamVendorCfg.productModelsEdit" placeholder="使用“|”分割多个型号" v-on="change: onChange">
    </div>
  </div>
  <div class="form-group" v-class="has-error: !validMainPathFmt">
    <label class="col-sm-2 control-label">主码流路径</label>
    <div class="col-sm-10">
      <input type="text" class="form-control" v-model="ipcamVendorCfg.mainPathFmt" v-on="change: onChange">
    </div>
  </div>
  <div class="form-group" v-class="has-error: !validSubPathFmt">
    <label class="col-sm-2 control-label">次码流路径</label>
    <div class="col-sm-10">
      <input type="text" class="form-control" v-model="ipcamVendorCfg.subPathFmt" v-on="change: onChange">
    </div>
  </div>
</form>
</template>

<script>
var log = require('../lib/log');

module.exports = {
  replace: true,
  props: ['ipcamVendorCfg'],
  methods: {
    onChange: function() {
      this.ipcamVendorCfg.valid = this.validManufacture && this.validProductModelsEdit && this.validMainPathFmt && this.validSubPathFmt;
      log.DEBUG_TRACE(this.ipcamVendorCfg.valid);
    }
  },
  computed: {
    validManufacture: function() {
      return this.ipcamVendorCfg.manufacture != '';
    },
    validProductModelsEdit: function() {
      return this.ipcamVendorCfg.productModelsEdit != '';
    },
    validMainPathFmt: function() {
      return this.ipcamVendorCfg.mainPathFmt != '';
    },
    validSubPathFmt: function() {
      return this.ipcamVendorCfg.subPathFmt != '';
    }
  }
}
</script>

<style>
</style>