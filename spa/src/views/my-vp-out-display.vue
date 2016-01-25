<template>
<form class="form-horizontal" method="post" action="#" v-on="submit: onSubmit, reset: onReset">
  <div class="form-group">
    <label class="col-sm-2 control-label">分辨率</label>
    <div class="col-sm-10">
      <select class="form-control" v-model="vpOutDisplay.resolution" options="resolutionOptions"></select>
    </div>
  </div>
  <div class="form-group">
    <label class="col-sm-2 control-label">帧率</label>
    <div class="col-sm-10">
      <select class="form-control" v-model="vpOutDisplay.framerate" options="framerateOptions" disabled></select>
    </div>
  </div>
  <div class="form-group" v-if="vidLoopEn">
    <label class="col-sm-2 control-label">自环源</label>
    <div class="col-sm-10">
      <select class="form-control" v-model="vpOutDisplay.loopSrcPortNames" multiple options="vidSrcPortOptions"></select>
    </div>
  </div>
  <div class="form-group">
    <div class="col-sm-offset-2 col-sm-10">
      <button type="submit" class="btn btn-default">保存</button>
      <button type="reset" class="btn btn-default">重置</button>
    </div>
  </div>
</form>
</template>

<script>
var log = require('../lib/log');
var _ = require('underscore');

module.exports = {
  replace: true,
  props: ['params', 'vidLoopEn', 'doSave'],
  data: function() {
    return {
      vpOutDisplay: {
        resolution: '',
        framerate: 60,
        loopSrcPortNames: []
      },
      vidSrcPortOptions: [{
        text: 'DVI-I IN',
        value: 'vpIn_0'
      }, {
        text: '3G-SDI IN',
        value: 'vpIn_1'
      }],
      resolutionOptions: [{
        text: '1080p',
        value: '1080p'
      }, {
        text: '720p',
        value: '720p'
      }, {
        text: '1024x768',
        value: '1024x768'
      }],
      framerateOptions: [60, 50, 30],
    }
  },
  methods: {
    initVpOutDisplay: function(params) {
      this.vpOutDisplay.resolution = params.resolution;
      this.vpOutDisplay.framerate = params.framerate;
      this.vpOutDisplay.loopSrcPortNames = _.clone(params.loopSrcPortNames);
    },
    onReset: function(e) {
      e && e.preventDefault();
      this.initVpOutDisplay(this.params);
    },
    onSubmit: function(e) {
      e && e.preventDefault();
      if (true) {
        this.doSave(this.vpOutDisplay);
      } else {
        log.ERROR_TRACE('Invalid Params');
      }
    }
  },
  watch: {
    'params': function(newVal, oldVal) {
      this.initVpOutDisplay(newVal);
    }
  }
}
</script>

<style>
</style>