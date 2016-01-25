<template>
<form class="form-horizontal">
  <div class="form-group">
    <label class="col-sm-2 control-label">幻相供电</label>
    <div class="col-sm-10 checkbox">
      <label>
        <input type="checkbox" v-model="apCfg.phant" true-exp=1 false-exp=0> 启用
      </label>
    </div>
  </div>
  <div class="form-group">
    <label class="col-sm-2 control-label">灵敏度</label>
    <div class="col-sm-10">
      <div class="input-group"> 
        <input class="form-control" type="range" min="0" max="54" step="6" v-model="apCfg.sens" />
        <span class="input-group-addon">{{apCfg.sens}}</span>
      </div>
    </div>
  </div>
</form>
</template>

<script>
var log = require('../lib/log');

module.exports = {
  replace: true,
  props: ['params', 'doSaveReq'],
  data: function() {
    return {
      apCfg: {
        sens: 0,
        phant: 0
      }
    }
  },
  methods: {
    apCfgUpdate: function(newVal, oldVal) {
      var req = {};
      var apCfg = {};

      apCfg[this.params.index] = {
        sens: this.apCfg.sens,
        phant: this.apCfg.phant
      };
      req[this.params.type] = apCfg;

      this.doSaveReq(req);
    }
  },
  watch: {
    'params.data': function(newVal, oldVal) {
      if (newVal.sens) {
        this.apCfg.sens = newVal.sens;
      }
      if (newVal.phant) {
        this.apCfg.phant = newVal.phant;
      }
      
      if (this.unwatch) {
        this.unwatch();
      }
      this.unwatch = this.$watch('apCfg', 
        this.apCfgUpdate, {
          deep: true
      });
    }
  }
}
</script>

<style>
</style>