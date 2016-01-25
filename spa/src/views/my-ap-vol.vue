<template>
<form class="form-horizontal">
  <div class="form-group">
    <label class="col-sm-2 control-label">{{params.text}}</label>
    <div class="col-sm-10">
      <a class="col-sm-1 my-mute" v-on="click: onClick">
      <i class="fa fa-2x" 
      v-class="
      fa-volume-off: apCfg.mute === 1,
      fa-volume-up: showLevel >= 50,
      fa-volume-down: isVolumeDown
      "></i></a>    
      <div class="input-group"> 
        <input class="form-control" type="range" min="0" max="4.0" step="0.04" v-model="showGain" debounce="40" />
        <span class="input-group-addon">{{showLevel}}</span>
      </div>
    </div>
  </div>
</form>
</template>

<script>
var log = require('../lib/log');
var _ = require('underscore');
var utils = require('../lib/utils');

module.exports = {
  replace: true,
  props: ['params', 'doSaveReq'],
  data: function() {
    return {
      apCfg: {
        mute: 0,
        gain: 1.0
      },
      showGain: 1.0
    }
  },
  methods: {
    onClick: function() {
      if (this.apCfg.mute === 0) {
        this.apCfg.mute = 1;
        this.showGain = 0;
      } else {
        this.apCfg.mute = 0;
        this.showGain = this.apCfg.gain;
      }
    },
    apCfgUpdate: function(newVal, oldVal) {
      var req = {};
      var apCfg = {};

      apCfg[this.params.index] = {
        mute: this.apCfg.mute,
        gain: this.apCfg.gain
      };
      req[this.params.type] = apCfg;

      this.doSaveReq(req);
    }
  },
  computed: {
    isVolumeDown: function() {
      return this.showGain > 0 && this.showGain < 2.0;
    },
    showLevel: function() {
      return (this.showGain * 25).toFixed(0);
    }
  },
  watch: {
    'params.data': function(newVal, oldVal) {
      this.apCfg.gain = newVal.gain;
      this.apCfg.mute = newVal.mute;
      if (this.apCfg.mute == 0) {
        this.showGain = this.apCfg.gain;
      } else {
        this.showGain = 0;
      }

      if (this.unwatch) {
        this.unwatch();
      }
      this.unwatch = this.$watch('apCfg', 
        this.apCfgUpdate, {
          deep: true
      });
    },
    'showGain': function(newVal, oldVal) {
      if (newVal === 0) {
        this.apCfg.mute = 1;
      } else {
        this.apCfg.mute = 0;
        this.apCfg.gain = newVal;
      }
    }
  }
}
</script>

<style>
.my-mute {
  cursor: pointer;
}
</style>