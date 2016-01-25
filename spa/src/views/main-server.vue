<template>
<div class="row">
  <div class="col-md-12">
    <rd-widget>
      <rd-widget-header header="{{licenseInfo.header}}">
        <a class="btn btn-sm btn-default" href="{{licenseFileLink}}" download="license.json" v-attr="disabled:!validLicense">
          <span class="glyphicon glyphicon-file"></span> 导出
        </a>
      </rd-widget-header>
      <rd-widget-body>
        <my-license-info v-show="licenseInfo.showList" lists={{licenseInfo.lists}}></my-license-info>
      </rd-widget-body>
    <rd-widget>    
  </div>
  <div class="col-md-12">
    <rd-widget>
      <rd-widget-header header="{{* licenseUpload.header}}">
      </rd-widget-header>
      <rd-widget-body>
        <my-file-upload params="{{* licenseUpload.params}}"></my-file-upload>
      </rd-widget-body>
    <rd-widget>
  </div>
</div>
</template>

<script>
var api = require('../lib/api');
var serverApi = require('../lib/serverApi');
var platformApi = require('../lib/platformApi');

module.exports = {
  components: {
    myLicenseInfo: require('./my-license-info.vue'),
    myFileUpload: require('./my-file-upload.vue'),
  },
  data: function() {
    return {
      licenseInfo: {
        header: {
          icon: 'fa fa-list',
          title: 'License Info'
        },
        stateCode: -1,
        showList: false,
        lists: require('../configs/licenseCfg')
      },
      licenseUpload: {
        header: {
          icon: 'fa fa-file',
          title: 'License Upload'
        },
        params: {
          moduleName: 'Server',
          typeCfg: 'license',
          maxSize: 100*1024,
          success: this.uploadLicenseSuccess,
          error: this.uploadError
        }
      }
    }
  },
  computed: {
    validLicense: function() {
      return this.licenseInfo.stateCode === 0;
    },
    licenseFileLink: function() {
      return api.makeHttpUrl('Server', '/api/storage/file?type=config&path=license.json');
    }
  },
  methods: {
    uploadLicenseSuccess: function(res) {
      swal({
        title: 'Upload Success!',
        text: "The Server Need Reboot To Take Effect, restart NOW?",
        type: "success",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, restart now!",
        closeOnConfirm: false,
        showLoaderOnConfirm: true, 
      }, 
      function() {
        serverApi.system.sendCmd('restartServer');
        setTimeout(function() {
          swal.close();
          location.reload(true);
        }, 8*1000);         
      });    
    }, 
    uploadError: function(res) {
      swal({
        title: 'Opps!',
        text: res.msg ? res.msg: 'Connect Fail!',
        type: "error",
        showConfirmButton: true
      });
    },
    doLoadSysCfg: function() {
      serverApi.system.getCfg(function(res) {
        var licenseInfo = res.data._info.licenseInfo;
        this.licenseInfo.stateCode = licenseInfo.stateCode;
        if (this.licenseInfo.stateCode != 0) {
          this.licenseInfo.header.title = 'License Error(' + licenseInfo.stateStr + ')';
        }
        if (licenseInfo.license.data != undefined) {
          _.each(this.licenseInfo.lists, function(item, index, list) {
            if (licenseInfo.license.data[item.field]) {
              item.value = licenseInfo.license.data[item.field];
            }
          });
          this.licenseInfo.showList = true;
        }
      }.bind(this));    
    }
  },
  ready: function () {
    this.doLoadSysCfg();
  }
}
</script>

<style>
</style>