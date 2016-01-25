<template>
<form class="form-horizontal">
  <div class="form-group">
    <label class="col-sm-2 control-label">预览</label>
    <div class="col-sm-10">
      <canvas v-el="preview" width="576" height="324" style="width:576px;height:324px;margin:0;margin-left:auto;margin-right:auto"></canvas>
    </div>
  </div>
  <div class="form-group">
    <div class="col-sm-offset-2 col-sm-10">
      <div class="checkbox">
        <label>
          <input type="checkbox" v-model="cfg.enable" true-exp=1 false-exp=0> 启用
        </label>
      </div>
    </div>
  </div>
  <div class="form-group">
    <label class="col-sm-2 control-label">字号</label>
    <div class="col-sm-10">
      <div class="input-group"> 
        <input type="range" class="form-control" v-model="cfg.fontSize" min="20" max="100" step="1" v-on="change: onChange">
        <span class="input-group-addon">{{cfg.fontSize}}</span>
      </div>
    </div>
  </div> 
  <div class="form-group">
    <label class="col-sm-2 control-label">横向</label>
    <div class="col-sm-10">
      <div class="input-group" v-if="cfg.posX >= 0"> 
        <input type="range" class="form-control" v-model="cfg.posX" min="0" max="192" step="1" v-on="change: onChange">
        <span class="input-group-addon">{{cfg.posX}}</span>
      </div>
      <p class="form-control-static" v-if="cfg.posX < 0">自动</p>
    </div>
  </div> 
  <div class="form-group">
    <label class="col-sm-2 control-label">纵向</label>
    <div class="col-sm-10">
      <div class="input-group"> 
        <input type="range" class="form-control" v-model="cfg.posY" min="0" max="192" step="1" v-on="change: onChange">
        <span class="input-group-addon">{{cfg.posY}}</span>
      </div>
    </div>
  </div> 
  <div class="form-group">
    <label class="col-sm-2 control-label">颜色</label>
    <div class="col-sm-10">
      <select class="form-control" v-model="cfg.fontColor" options="colorOptions" v-on="change: onChange">
      </select>
    </div>
  </div>  
  <div class="form-group">
    <label class="col-sm-2 control-label">内容</label>
    <div class="col-sm-10">
      <input type="text" class="form-control" v-model="cfg.content" maxlength="32" v-on="change: onChange">
    </div>
  </div>
</form>
</template>

<script>
var log = require('../lib/log');
var utils = require('../lib/utils');

module.exports = {
  replace: true,
  props: ['cfg', 'show'],
  data: function() {
    return {
      colorOptions: require('../configs/colorOptions'),
    }
  },
  watch: {
    'show': function(newVal, oldVal) {
      if (newVal) {
        this.doDrawImage();
      }
    }
  },
  methods: {
    doDrawImage: function() {
      var canvas = this.$$.preview;
      var context = canvas.getContext("2d");

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = utils.getOppositeColor(this.cfg.fontColor);
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.font = parseInt(this.cfg.fontSize*canvas.width/1920) + 'px 宋体';
      //log.DEBUG_TRACE(context.font);
      context.textBaseline = "top";
      context.fillStyle = this.cfg.fontColor;
      var x = 0;
      if (this.cfg.posX < 0) {
        var posX = 0;
        var showLen = this.cfg.content.length * this.cfg.fontSize / 30;
        if (showLen < 192) {
          posX = (192 - showLen) / 2;
        }
        x = canvas.width*posX/192;
      } else {
        x = canvas.width*this.cfg.posX/192;
      }
      var y = canvas.height*this.cfg.posY/192;
      //log.DEBUG_TRACE(x + ':' + y);
      context.fillText(this.cfg.content, x, y);
    },
    onChange: function() {
      this.doDrawImage();
    }
  }
}
</script>

<style>
</style>