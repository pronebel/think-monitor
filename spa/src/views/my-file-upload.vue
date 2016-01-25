<template>
<form method="post" action="#" v-on="submit: onSubmit">
  <div class="form-group">
    <div class="input-group"> 
      <div class="input-group-btn" v-if="isShowType">
        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          {{uploadTypeTxt}} <span class="caret"></span>
        </button>
        <ul class="dropdown-menu">
          <li><a v-repeat="option in uploadTypeOptions" v-on="click: onSelect(option)">{{option.text}}</a></li>
        </ul> 
      </div>
      <input type="text" class="form-control" v-model="uploadFile" readonly>
      <span class="input-group-btn">
        <span class="btn btn-primary btn-file">
            Browse&hellip; <input type="file" v-el="container" v-on="change: onChange" accept="{{uploadAccept}}">
        </span>
      </span>
    </div>
  </div>
  <button type="submit" class="btn btn-default" v-attr="disabled: isUploadStart">上传</button>
</form>
</template>

<script>
var api = require('../lib/api');
var log = require('../lib/log');
var utils = require('../lib/utils');

module.exports = {
  replace: true,
  props: ['params', 'progress'],
  data: function() {
    return {
      validFile: false,
      uploadFile: '',
      uploadType: 'default',
      uploadAccept: '',
      uploadTypeTxt: '类型',
      isUploadStart: false,
      uploadTypeOptions: [{
        text: '默认',
        value: 'default',
        accept: ''
      }, {
        text: 'Topo工程',
        value: 'topo',
        accept: '.tar'
      }, {
        text: '配置文件',
        value: 'config',
        accept: '.json'
      }, {
        text: 'License',
        value: 'license',
        accept: '.json'
      }, {
        text: '固件',
        value: 'upgrade',
        accept: '.tar'
      }, {
        text: '背景图片',
        value: 'background',
        accept: '.jpg'
      }]
    }
  },
  methods: {
    doUploadFile: function(content) {
      api.storage.uploadFile(this.params.moduleName ? this.params.moduleName : 'Platform', 
        this.uploadType, 
        this.params.fixedName ? this.params.fixedName : this.uploadFile, 
        content, 
        function(res) {
          var success = this.params.success;
          success && success(res);
          this.resetState();
        }.bind(this),
        function(res) {
          var error = this.params.error;
          error && error(res);
          this.resetState();
        }.bind(this),
        function(e) {
          if (this.progress != undefined) {
            this.progress = 100 * e.loaded/e.total;
          }
          //log.DEBUG_TRACE(e.loaded/e.total + '|' + this.progress);
        }.bind(this));
    },
    onSubmit: function(e) {
      e && e.preventDefault();

      if (!this.validFile) {
        swal({
          title: 'Opps!',
          text: 'File Maybe Not Accept',
          type: "error",
          showConfirmButton: true
        });
        return;          
      }    

      log.DEBUG_TRACE('uploadFile: ' + this.uploadFile);
      log.DEBUG_TRACE('uploadType: ' + this.uploadType); 

      this.isUploadStart = true;

      var reader = new FileReader();
      reader.onload = function(e) {
        this.doUploadFile(e.target.result);
      }.bind(this);
      reader.onerror = function(e) {
        this.resetState();
      }.bind(this);
      reader.readAsArrayBuffer(this.file);
    },
    onSelect: function(option) {
      this.uploadType = option.value;
      this.uploadTypeTxt = option.text;
      this.uploadAccept = option.accept;
    },
    onChange: function() {
      this.validFile = false;
      var file = this.$$.container.files[0];
      //utils.printObj(file);

      //check maxSize
      if (file.size > this.params.maxSize) {
        swal({
          title: 'Opps!',
          text: 'Too Large: ' + utils.readableSize(file.size) + ' exceed limit of ' + utils.readableSize(this.params.maxSize),
          type: "error",
          showConfirmButton: true
        });
        return;
      }

      this.uploadFile = file.name;
      log.DEBUG_TRACE('uploadFile: ' + this.uploadFile);
      this.file = file;
      this.validFile = true;
    },
    resetState: function() {
      if (this.progress) {
        this.progress = 0;
      }    
      this.isUploadStart = false;  
    }
  },
  computed: {
    isShowType: function() {
      return this.params.typeCfg === '' || this.params.typeCfg === undefined;
    }
  },
  ready: function() {
    if (this.params.typeCfg && this.params.typeCfg != '') {
      this.uploadType = this.params.typeCfg;
      for (var i = 0; i < this.uploadTypeOptions.length; i++) {
        var option = this.uploadTypeOptions[i];
        if (option.value === this.uploadType) {
          this.uploadAccept = option.accept;
          break;
        }
      };
    }
  }
}
</script>

<style>
.btn-file {
  position: relative;
  overflow: hidden;
}
.btn-file input[type=file] {
  position: absolute;
  top: 0;
  right: 0;
  min-width: 100%;
  min-height: 100%;
  font-size: 100px;
  text-align: right;
  filter: alpha(opacity=0);
  opacity: 0;
  background: red;
  cursor: inherit;
  display: block;
}
input[readonly] {
  background-color: white !important;
  cursor: text !important;
}
</style>