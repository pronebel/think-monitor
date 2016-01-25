<template>
<form method="post" action="#" v-on="submit: onSubmit, reset: onReset">
  <div class="form-group" v-class="has-error: !validStorePolicy">
    <span>存储策略（磁盘满）</span>
    <select class="form-control" v-model="storageCfg.storePolicy" options="storePolicyOptions">
    </select>
  </div>
  <div class="form-group" v-class="has-error: !validSizePerFile">
    <span>单文件大小</span>
    <select class="form-control" v-model="storageCfg.sizePerFile" options="sizePerFileOptions">
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
      storageCfg: {
        storePolicy: '',
        sizePerFile: ''
      },
      storePolicyOptions: [{
        text: '覆盖旧文件',
        value: 'overwrite'
      }, {
        text: '停止录制',
        value: 'stopwrite'
      }],
      sizePerFileOptions: [{
        text: '256M',
        value: 256*1024*1024
      }, {
        text: '512M',
        value: 512*1024*1024
      }, {
        text: '1G',
        value: 1024*1024*1024
      }, {
        text: '2G',
        value: 2*1024*1024*1024
      }]
    }
  },
  computed: {
    validStorePolicy: function() {
      return this.storageCfg.storePolicy != '';
    },
    validSizePerFile: function() {
      return this.storageCfg.sizePerFile != '';
    }
  },
  methods: {
    initStorageCfg: function(params) {
      this.storageCfg.storePolicy = params.storePolicy;
      this.storageCfg.sizePerFile = params.sizePerFile; 
    },
    onSubmit: function(e) {
      e && e.preventDefault();
      if (this.validStorePolicy && this.validSizePerFile) {
        this.doSave(this.storageCfg);
      } else {
        log.ERROR_TRACE('Invalid Params');
      }
    },
    onReset: function(e) {
      e && e.preventDefault();
      this.initStorageCfg(this.params);
    }
  },
  watch: {
    'params': function(newVal, oldVal) {
      this.initStorageCfg(newVal);
    }
  },
  ready: function() {
    this.initStorageCfg(this.params);
  }
}
</script>

<style>
</style>