<template>
<my-vp-color params="{{@ params.colorParam}}" do-save="{{doSaveColorParam}}"></my-vp-color>
<template v-if="displayCfgEn">
<hr />
<my-vp-out-display 
params="{{vpOutDisplay}}" 
vid-loop-en="{{vidLoopEn}}" 
do-save="{{doSaveVpOutDisplay}}">
</my-vp-out-display>
</template>
</template>

<script>
var log = require('../lib/log');
var _ = require('underscore');

module.exports = {
  replace: true,
  props: ['index', 'params', 'vidLoopEn', 'displayCfgEn', 'doSaveReq'],
  components: {
    myVpColor: require('./my-vp-color.vue'),
    myVpOutDisplay: require('./my-vp-out-display.vue'),
  },
  data: function() {
    return {
      vpOutDisplay: {
        resolution: '',
        framerate: 60,
        loopSrcPortNames: []
      }
    }
  },
  methods: {
    doLoadVpOutDisplay: function(params) {
      this.vpOutDisplay = {
        resolution: params.resolution,
        framerate: params.framerate,
        loopSrcPortNames: JSON.parse(params.loopSrcPortNames)    
      }
    },
    doSaveVpOutDisplay: function(vpOutDisplay) {
      var req = {
        vpOut: {}
      };
      req.vpOut[this.index] = {
        outPortType: this.params.outPortType,
        outSignalType: this.params.outSignalType,
        colorParam: this.params.colorParam,
        resolution: vpOutDisplay.resolution,
        framerate: vpOutDisplay.framerate,
        loopSrcPortNames: JSON.stringify(vpOutDisplay.loopSrcPortNames)        
      };
      log.showWait('Saveing', 5);
      this.doSaveReq(req);    
    },
    doSaveColorParam: function() {
      var req = {
        vpOut: {}
      };
      req.vpOut[this.index] = this.params;
      this.doSaveReq(req);
    }
  },
  watch: {
    'params': function(newVal, oldVal) {
      this.doLoadVpOutDisplay(newVal);
    }
  }
}
</script>

<style>
</style>