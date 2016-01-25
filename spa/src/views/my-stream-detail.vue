<template>
<form class="form-horizontal">
  <div class="form-group">
    <label class="col-sm-2 control-label">视频编码格式</label>
    <div class="col-sm-10">
      <p class="form-control-static">{{streamCfg.protocol}}</p>
    </div>
  </div> 
  <div class="form-group">
    <label class="col-sm-2 control-label">分辨率</label>
    <div class="col-sm-10">
      <select class="form-control" v-model="streamCfg.resolution" options="resolutionOptions | resolutionFilter">
      </select>
    </div>
  </div> 
  <div class="form-group">
    <label class="col-sm-2 control-label">帧率</label>
    <div class="col-sm-10">
      <select class="form-control" v-model="streamCfg.framerate" options="framerateOptions | framerateFilter" number>
      </select>
    </div>
  </div>   
  <div class="form-group" v-class="has-error: !validBitRate">
    <label class="col-sm-2 control-label">码率</label>
    <div class="col-sm-10">
      <input type="number" class="form-control" v-model="streamCfg.bitRate" number min="192000" max="8000000" step="8000">
    </div>
  </div>
  <div class="form-group">
    <label class="col-sm-2 control-label">码控</label>
    <div class="col-sm-10">
      <select class="form-control" v-model="streamCfg.rateControl" options="rateControlOptions" disabled>
      </select>
    </div>
  </div>  
  <div class="form-group">
    <label class="col-sm-2 control-label">I帧间隔</label>
    <div class="col-sm-10">
      <select class="form-control" v-model="streamCfg.gops" options="gopsOptions" number>
      </select>
    </div>
  </div>   
</form>
</template>

<script>
var log = require('../lib/log');

module.exports = {
  replace: true,
  props: ['streamCfg'],
  data: function() {
    return {
      resolutionOptions: [{
        text: '1080p',
        value: '1080p',
        filter: 'main|sub'
      }, {
        text: '720p',
        value: '720p',
        filter: 'main|sub'
      }, {
        text: '480p',
        value: '480p',
        filter: 'sub|third|preview'
      }, {
        text: 'cif',
        value: 'cif',
        filter: 'third|preview'
      }, {
        text: 'qcif',
        value: 'qcif',
        filter: 'third|preview'
      }],
      framerateOptions: [60, 50, 40, 30, 25, 20, 10, 5, 1],
      rateControlOptions: ['vbr', 'cbr'],
      gopsOptions: [1, 2, 3, 4, 5]
    }
  },
  computed: {
    validBitRate: function() {
      return this.streamCfg.bitRate >= 192000 && this.streamCfg.bitRate <= 8000000;
    }
  },
  methods: {
    framerateRange: function() {
      var streamName = this.streamCfg._id;
      if (streamName === 'main') {
        return {max: 60, min: 30};
      } else if (streamName === 'sub') {
        return {max: 40, min: 20};
      } else if (streamName === 'third') {
        return {max: 30, min: 20};
      } else {
        return {max: 30, min: 20};
      }
    }
  },
  filters: {
    resolutionFilter: function(list) {
      return _.filter(list, function(item) {
        return item.filter.indexOf(this._id) != -1;
      }, this.streamCfg);
    },
    framerateFilter: function(list) {
      return _.filter(list, function(num) {
        return (num <= this.max && num >= this.min);
      }, this.framerateRange());
    }
  }
}
</script>

<style>
</style>