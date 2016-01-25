<template>
<form class="form-horizontal">
  <div class="form-group" v-show="state.connect===0">
    <label class="col-sm-2 control-label">状态</label>
    <div class="col-sm-10">
      <p class="form-control-static">无信号</p>
    </div>
  </div>
  <template v-if="state.connect===1">
    <div class="form-group" v-if='state.inPortType === "dvi_i"'>
      <label class="col-sm-2 control-label">信号类别</label>
      <div class="col-sm-10">
        <p class="form-control-static">{{state.inSignalType}}</p>
      </div>
    </div>
    <div class="form-group">
      <label class="col-sm-2 control-label">分辨率</label>
      <div class="col-sm-10">
        <p class="form-control-static">{{state.resolution}}</p>
      </div>
    </div>
    <div class="form-group">
      <label class="col-sm-2 control-label">帧率</label>
      <div class="col-sm-10">
        <p class="form-control-static">{{state.framerate}}</p>
      </div>
    </div>
  </template>
</form>
</template>

<script>
module.exports = {
  replace: true,
  props: ['state']
}
</script>

<style>
</style>