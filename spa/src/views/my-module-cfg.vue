<template>
<form method="post" action="#" v-on="submit: onSubmit, reset: onReset">
  <div class="form-group">
    <select class="form-control" v-model="modules" multiple options="moduleOptions">
    </select>
  </div>  
  <button type="submit" class="btn btn-default">保存</button>
  <button type="reset" class="btn btn-default">重置</button>
</form>
</template>

<script>
var log = require('../lib/log');

module.exports = {
  replace: true,
  props: ['params', 'doSave'],
  data: function() {
    return {
      modules: [],
      moduleOptions: [{
        text: '编解码器',
        value: 'codec'
      }, {
        text: '主服务器',
        value: 'mainServer'
      }]
    }
  },
  methods: {
    initModules: function(params) {
      this.modules = params.slice(0); 
    },
    onSubmit: function(e) {
      e && e.preventDefault();
      this.doSave(this.modules);
    },
    onReset: function(e) {
      e && e.preventDefault();
      this.initModules(this.params);
    }
  },
  ready: function() {
    this.initModules(this.params);
    this.$watch('params', function(newVal, oldVal) {
      log.DEBUG_TRACE(newVal);
      this.initModules(newVal);
    });
  }
}
</script>

<style>
</style>