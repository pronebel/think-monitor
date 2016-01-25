<template>
<form method="post" action="#" v-on="submit: onSubmit" class="form-horizontal">
  <div class="form-group">
    <label class="col-sm-2 control-label">预览</label>
    <div class="col-sm-10">
      <canvas v-el="canvas" width="{{maxWidth}}" height="{{maxHeight}}" style="width:auto;height:auto;max-width:80%;max-height:400px"></canvas>
    </div>
  </div>
  <div class="form-group">
    <label class="col-sm-2 control-label">背景色</label>
    <div class="col-sm-10">
      <select class="form-control" v-model="bgColor" options="colorOptions" v-on="change: onParamsChange">
      </select>
    </div>
  </div> 
  <div class="form-group">
    <label class="col-sm-2 control-label">标题文字</label>
    <div class="col-sm-10">
      <input type="text" class="form-control" v-model="title" v-on="change: onParamsChange">
    </div>
  </div>
  <div class="form-group">
    <label class="col-sm-2 control-label">字体</label>
    <div class="col-sm-10">
      <div class="input-group">
        <div class="input-group-btn">
          <select class="form-control" v-model="fontFamily" options="fontFamilyOptions" v-on="change: onParamsChange">
          </select>
        </div>
        <div class="input-group-btn">
          <select class="form-control" v-model="fontColor" options="colorOptions" v-on="change: onParamsChange">
          </select>
        </div>
      </div>
    </div>
  </div>
  <div class="form-group">
    <div class="col-sm-offset-2 col-sm-10">
      <a class="btn btn-default" href="javascript:;" v-class="active: isFontBold" v-on="click: isFontBold = !isFontBold">
        <i class="fa fa-bold"></i>
      </a>
      <a class="btn btn-default" href="javascript:;" v-class="active: isFontItalic" v-on="click: isFontItalic = !isFontItalic">
        <i class="fa fa-italic"></i>
      </a>
    </div>
  </div>
  <div class="form-group">
    <label class="col-sm-2 control-label">字号</label>
    <div class="col-sm-10">
      <input type="range" class="form-control" v-model="fontSize" min="50" max="{{maxFontSize}}" step="10" v-on="change: onParamsChange">
    </div>
  </div>
  <div class="form-group">
    <label class="col-sm-2 control-label">横向</label>
    <div class="col-sm-10">
      <input type="range" class="form-control" v-model="posX" min="0" max="{{maxPosX}}" step="100" v-on="change: onParamsChange">
    </div>
  </div>
  <div class="form-group">
    <label class="col-sm-2 control-label">纵向</label>
    <div class="col-sm-10">
      <input type="range" class="form-control" v-model="posY" min="0" max="{{maxPosY}}" step="100" v-on="change: onParamsChange">
    </div>
  </div> 
  <div class="form-group">
    <label class="col-sm-2 control-label">底图</label>
    <div class="col-sm-10">
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
  </div>
  <div class="form-group">
    <label class="col-sm-2 control-label">契合度</label>
    <div class="col-sm-10">
      <select class="form-control" v-model="bgImgFit" options="fitOptions" v-on="change: onParamsChange">
      </select>
    </div>
  </div>
  <div class="form-group">
    <div class="col-sm-offset-2 col-sm-10">
      <button type="submit" class="btn btn-default" v-attr="disabled: isUploadStart">上传</button>
    </div>
  </div>
</form>
</template>

<script>
var api = require('../lib/api');
var log = require('../lib/log');
var utils = require('../lib/utils');

module.exports = {
  replace: true,
  props: ['params', 'progress', 'submit'],
  data: function() {
    return {
      title: 'example示例',
      bgColor: '',
      fontFamily: '',
      fontSize: 100,
      fontColor: '',
      posX: 200,
      posY: 200,
      isFontBold: false, 
      isFontItalic: false,
      bgImgFit: 'stretch',
      validBgImg: false,
      uploadFile: '',
      uploadType: 'default',
      uploadAccept: '',
      uploadTypeTxt: '类型',
      isUploadStart: false,
      uploadTypeOptions: [{
        text: '背景图片',
        value: 'background',
        accept: '.jpg, .png, .bmp'
      }],
      colorOptions: require('../configs/colorOptions'),
      fontFamilyOptions: require('../configs/fontFamilyOptions'),
      fitOptions: [{
        value: 'stretch',
        text: '拉伸'
      }, {
        value: 'center',
        text: '居中'
      }, {
        value: 'adapt',
        text: '适应'
      }]
    }
  },
  methods: {
    onParamsChange: function() {
      this.doDrawImage(true);
    },
    getBgImgPos: function(image) {
      var pos = {};
      if (this.bgImgFit === 'center') {
        pos.x = (this.maxWidth - image.width) / 2;
        pos.y = (this.maxHeight - image.height) / 2;
        pos.width = image.width;
        pos.height = image.height;
      } else if (this.bgImgFit === 'adapt') {
        var widthScale = this.maxWidth / image.width;
        var heightScale = this.maxHeight / image.height;
        var scale = (widthScale <= heightScale) ? widthScale : heightScale;
        pos.width = image.width * scale;
        pos.height = image.height * scale;
        pos.x = (this.maxWidth - pos.width) / 2;
        pos.y = (this.maxHeight - pos.height) / 2;
      } else {
        pos.x = 0;
        pos.y = 0;
        pos.width = this.maxWidth;
        pos.height = this.maxHeight;
      }
      return pos;
    },
    doDrawImage: function(isDivShow) {
      var canvas = this.$$.canvas;
      var context = canvas.getContext("2d");
      var baseColor = utils.getOppositeColor(this.bgColor);

      //绘制背景
      context.fillStyle = this.bgColor;
      context.fillRect(0, 0, this.maxWidth, this.maxHeight);

      //绘制图片
      if (this.bgImg) {
        var pos = this.getBgImgPos(this.bgImg);
        context.drawImage(this.bgImg, pos.x, pos.y, pos.width, pos.height);
      }

      if (this.title != '') {
        var font = '';
        if (this.isFontItalic) {
          font += 'italic ';
        }
        if (this.isFontBold) {
          font += 'bold ';
        }
        font += this.fontSize + 'px ' + this.fontFamily;
        context.font = font;
        log.DEBUG_TRACE(context.font);
        context.fillStyle = this.fontColor;
        context.textBaseline = "top";
        context.fillText(this.title, this.posX, this.posY);
      }

      if (isDivShow) {
        //绘制拼接分割线
        context.beginPath();
        context.strokeStyle = baseColor;
        context.strokeRect(0, 0, this.maxWidth, this.maxHeight);
        context.lineWidth = 30;

        if (this.params.multiScreenX > 1) {
          for (var i = 1; i < this.params.multiScreenX; i++) {
            context.moveTo(1920 * i, 0);
            context.lineTo(1920 * i, this.maxHeight);
            context.stroke();
          };
        }

        if (this.params.multiScreenY > 1) {
          for (var i = 1; i < this.params.multiScreenY; i++) {
            context.moveTo(0, 1080 * i);
            context.lineTo(this.maxWidth, 1080 * i);
            context.stroke();
          };
        }
        context.closePath();
      }      
    },
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

      this.doDrawImage(false);
      this.isUploadStart = true;
      var canvas = this.$$.canvas;

      if (this.submit) {
        this.submit(canvas, this.resetState);
      } else {
        canvas.toBlob(function(blob) {
          var reader = new FileReader();
          reader.onload = function(e) {
            this.doUploadFile(e.target.result);
          }.bind(this);
          reader.onerror = function(e) {
            this.resetState();
          }.bind(this);        
          reader.readAsArrayBuffer(blob);
        }.bind(this), 'image/jpeg', 1.0);
      }
    },
    onSelect: function(option) {
      this.uploadType = option.value;
      this.uploadTypeTxt = option.text;
      this.uploadAccept = option.accept;
    },
    onChange: function() {
      this.bgImg = null;
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

      if (null === file.type.match(/image.*/)) {
        swal({
          title: 'Opps!',
          text: 'Not Support File Type:' + file.type,
          type: "error",
          showConfirmButton: true
        });        
        return;
      }

      this.uploadFile = file.name;
      log.DEBUG_TRACE('uploadFile: ' + this.uploadFile);

      var canvas = this.$$.canvas;
      var context = canvas.getContext("2d");
      var reader = new FileReader();
      reader.onload = function(e) {
        var image = new Image();
        image.src = e.target.result;
        image.onload = function(e) {
          log.DEBUG_TRACE(image.width + 'x' + image.height);
          if ((image.width != this.maxWidth)
            || (image.height != this.maxHeight)) {
            swal({
              title: 'Not Fit',
              text: 'The Image Will Scale From ' + image.width + 'x' + image.height + ' To ' + this.maxWidth + 'x' + this.maxHeight,
              type: "warning",
              showConfirmButton: true
            });            
          }
          this.bgImg = image;
          this.doDrawImage(true);
        }.bind(this);
      }.bind(this);
      reader.readAsDataURL(file);
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
    },
    maxWidth: function() {
      return this.params.multiScreenX * 1920;
    },
    maxHeight: function() {
      return this.params.multiScreenY * 1080;
    },
    maxPosX: function() {
      return this.maxWidth - (this.maxWidth % 100);
    },
    maxPosY: function() {
      return this.maxHeight - (this.maxHeight % 100);
    },
    maxFontSize: function() {
      return 200 * (this.params.multiScreenX + this.params.multiScreenY);
    }
  },
  watch: {
    'isFontBold': function(newVal, oldVal) {
      this.doDrawImage(true);
    },
    'isFontItalic': function(newVal, oldVal) {
      this.doDrawImage(true);
    },
    'params.multiScreenX': function(newVal, oldVal) {
      this.doDrawImage(true);
    },
    'params.multiScreenY': function(newVal, oldVal) {
      this.doDrawImage(true);
    },
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
    this.fontFamily = this.fontFamilyOptions[0];
    this.bgColor = this.colorOptions[0].value;
    this.fontSize = 100;
    this.fontColor = this.colorOptions[1].value;
    this.doDrawImage(true);
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