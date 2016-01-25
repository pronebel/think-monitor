<template>
<div class="row">
  <div class="col-md-12">
    <rd-widget>
      <rd-widget-header header="{{* testInfo.header}}">
      </rd-widget-header>
      <rd-widget-body>
        <div class="progress">
          <vs-progressbar now="{{testInfo.progress}}" type="primary" striped animated></vs-progressbar>
        </div>      
        <my-file-upload params="{{* testInfo.params}}" progress="{{@ testInfo.progress}}"></my-file-upload>
      </rd-widget-body>
    <rd-widget>
  </div>
</div>
</template>

<script>
var api = require('../lib/api')

module.exports = {
  components: {
    myFileUpload: require('./my-file-upload.vue')
  },
  data: function() {
    return {
      testInfo: {
        header: {
          icon: 'fa fa-file',
          title: '测试'
        },
        params: {
          moduleName: 'Server',
          typeCfg: '',
          maxSize: 200*1024*1024,
          success: this.uploadSuccess,
          error: this.uploadError,
          //fixedName: 'fixedTest'
        },
        progress: 0
      }
    }
  },
  methods: {
    uploadSuccess: function(res) {
      swal({
        title: 'Success!',
        text: res.msg,
        type: "success",
        showConfirmButton: true
      }); 
      this.testInfo.progress = 0;
    },
    uploadSuccessWait: function(res) {
      swal({
        title: 'Upload Success!',
        text: "Start Processing, You need to wait for 3 seconds.",
        type: "success",
        showConfirmButton: false
      });
      setTimeout(function() {
        location.reload(true);
      }, 3*1000);      
      this.testInfo.progress = 0;
    },
    uploadError: function(res) {
      swal({
        title: 'Opps!',
        text: res.msg ? res.msg: 'Connect Fail!',
        type: "error",
        showConfirmButton: true
      });  
      this.testInfo.progress = 0;
    }
  }
}
</script>

<style>
</style>