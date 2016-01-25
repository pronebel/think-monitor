<template>
<form class="form-horizontal">
  <div class="form-group">
    <label class="col-sm-2 control-label">名字</label>
    <div class="col-sm-10">
      <input type="text" class="form-control" v-model="vidLayoutCfg.name">
    </div>
  </div>
  <div class="form-group">
    <label class="col-sm-2 control-label">适用宽高</label>
    <div class="col-sm-10">
      <p class="form-control-static">{{vidLayoutCfg.multiScreenX + 'x' + vidLayoutCfg.multiScreenY}}</p>
    </div>
  </div>
  <div class="form-group">
    <label class="col-sm-2 control-label">布局示意图</label>
    <div class="col-sm-10">
      <canvas v-el="preview" width="576" height="324" style="width:576px;height:324px;margin:0;margin-left:auto;margin-right:auto"></canvas>
    </div>
  </div>
</form>
</template>

<script>
var log = require('../lib/log');
var video = require('../lib/video');

module.exports = {
  replace: true,
  props: ['show', 'vidLayoutCfg', 'getStreamSrcName'],
  watch: {
    'show': function(newVal, oldVal) {
      if (newVal) {
        video.drawVidLayout(this.$$.preview, 
          this.vidLayoutCfg.windowList, 
          12 * this.vidLayoutCfg.multiScreenX, 
          12 * this.vidLayoutCfg.multiScreenY, 
          this.getStreamSrcName);
      }
    }
  }
}
</script>

<style>
</style>