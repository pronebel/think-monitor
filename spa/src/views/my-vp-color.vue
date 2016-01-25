<template>
<div class="form-horizontal">
  <div class="form-group" v-repeat="vpColor in vpColors">
    <label class="col-sm-2 control-label">{{vpColor.text}}</label>
    <div class="col-sm-10">
      <div class="input-group"> 
        <input class="form-control" type="range" min="0" max="100" step="1" v-model="vpColor.value" v-on="change: onChange"/>
        <span class="input-group-addon">{{vpColor.value}}</span>
      </div>
    </div>
  </div>
</div>
</template>

<script>
var log = require('../lib/log');

module.exports = {
  replace: true,
  props: ['params', 'doSave'],
  data: function() {
    return {
      vpColors: [{
        text: '亮度',
        field: 'bright',
        value: 1
      }, {
        text: '饱和度',
        field: 'saturation',
        value: 1
      }, {
        text: '色度',
        field: 'hue',
        value: 1
      }, {
        text: '对比度',
        field: 'contrast',
        value: 1
      }]
    }
  },
  methods: {
    initVpColor: function(params) {
      _.each(this.vpColors, function(item, index, list) {
        if (params[item.field] != undefined) {
          item.value = params[item.field];
        }
      });
    },
    vpColorsUpdate: function(newVal, oldVal) {
      _.each(this.vpColors, function(item, index, list) {
        if (this.params[item.field] != undefined) {
          this.params[item.field] = item.value;
        }
      }, this);
      this.doSave();      
    },
    onChange: function() {
      log.DEBUG_TRACE(this.vpColors[0].value);
      this.vpColorsUpdate();
    }
  },
  watch: {
    'params': function(newVal, oldVal) {
      //if (this.unwatch) {
      //  this.unwatch();
      //}
      this.initVpColor(newVal);
      //this.unwatch = this.$watch('vpColors', 
      //  this.vpColorsUpdate, {
      //  deep: true
      //});
    }
  }
}
</script>

<style>
</style>