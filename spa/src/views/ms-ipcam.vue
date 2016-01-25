<template>
<div class="row">
  <vs-modal title="详细信息" show="{{@ showIpcDetail}}" effect="fade" width="800" callback="{{doSaveIpcam}}">
    <div class="modal-body">
      <my-ipcam-detail ipcam-cfg="{{@ tmpIpcamCfg}}" vendor-lists="{{vendors.lists}}">
      </my-ipcam-detail>
    </div>
  </vs-modal>
  <vs-modal title="详细信息" show="{{@ showIpcVendorDetail}}" effect="fade" width="800" callback="{{doSaveIpcamVendor}}">
    <div class="modal-body">
      <my-ipcam-vendor-detail ipcam-vendor-cfg="{{@ tmpIpcamVendorCfg}}">
      </my-ipcam-vendor-detail>
    </div>
  </vs-modal>
  <div class="col-md-12">
    <rd-widget>
      <rd-widget-header header="{{* ipcams.header}}">
        <button class="btn btn-sm btn-default" v-on="click:doShowIpcDetail(-1)">
          <span class="glyphicon glyphicon-plus"></span> 新增
        </button>
        <button class="btn btn-sm btn-default" v-on="click:doLoadIpcameras">
          <span class="glyphicon glyphicon-refresh"></span> 刷新
        </button>
      </rd-widget-header>
      <rd-widget-body class="no-padding" v-class="large:ipcams.lists.length > 5">
        <my-table cfg="{{* ipcams.cfg}}" lists={{ipcams.lists}} state="{{ipcams.state}}"></my-table>
      </rd-widget-body>
      <rd-widget-footer>
        <strong>总数：</strong>{{ipcams.lists.length}}
      </rd-widget-footer>
    <rd-widget>    
  </div>
  <div class="col-md-12">
    <rd-widget>
      <rd-widget-header header="{{* vendors.header}}">
        <button class="btn btn-sm btn-default" v-on="click:doShowIpcVendorDetail(-1)">
          <span class="glyphicon glyphicon-plus"></span> 新增
        </button>
        <button class="btn btn-sm btn-default" v-on="click:doLoadIpcamVendorCfgs">
          <span class="glyphicon glyphicon-refresh"></span> 刷新
        </button>
        <a href="javascript:;" v-el="ipcamVendors" class="btn btn-sm btn-default" v-on="click:doExportIpcamVendorCfgs">
          <span class="glyphicon glyphicon-file"></span> 导出
        </a>
      </rd-widget-header>
      <rd-widget-body class="no-padding" v-class="large:vendors.lists.length > 5">
        <my-table cfg="{{* vendors.cfg}}" lists={{vendors.lists}} state="{{vendors.state}}"></my-table>
      </rd-widget-body>
      <rd-widget-footer>
        <strong>总数：</strong>{{vendors.lists.length}}
      </rd-widget-footer>
    <rd-widget>    
  </div>
</div>
</template>

<script>
var serverApi = require('../lib/serverApi');
var log = require('../lib/log');
var checkValidIp = require('../lib/utils').checkValidIp;

module.exports = {
  components: {
    myIpcamDetail: require('./my-ipcam-detail.vue'),
    myIpcamVendorDetail: require('./my-ipcam-vendor-detail.vue'),
  },
  data: function() {
    return {
      showIpcDetail: false,
      showIpcVendorDetail: false,
      tmpIpcamCfg: {
        _id: -1,
        port: 554,
        subStatus: 1,
        manufacture: '',
        productModel: '',
        username: '',
        password: '',
        channel: 0,
        ipaddr: '',
        name: '',
        tag: '',
        useCustomUrl: 0,
        mainUrl: '',
        previewUrl: '',
        valid: false
      },
      tmpIpcamVendorCfg: {
        manufacture: '',
        productModels: '',
        productModelsEdit: '',
        mainPathFmt: '',
        subPathFmt: '',
        valid: false
      },
      ipcams: {
        header: {
          icon: 'fa fa-list',
          title: '网络摄像机'
        },
        cfg: {
          isCheckable: false,
          isShowHead: true,
          isShowOperation: true,
          columns: [{
            field: '_id',
            text: 'ID',
            width: '5%'
          }, {
            field: 'name',
            text: '名字',
            width: '12%'
          }, {
            field: 'manufacture',
            text: '厂商',
            width: '12%'
          }, {
            field: 'productModel',
            text: '产品型号',
            width: '12%'
          }, {
            field: 'ipaddr',
            text: 'IP地址',
            width: '12%'
          }, {
            field: 'tag',
            text: '标签',
            width: 'auto'
          }],
          operation: {
            text: '操作',
            width: '12%',
            actions: [{
              icon: 'glyphicon glyphicon-trash',
              doClick: this.doDelIpcam
            }, {
              icon: 'glyphicon glyphicon-edit',
              doClick: this.doShowIpcDetail
            }]
          }
        },   
        state: {
          listsLoading: true
        },     
        lists: []
      },
      vendors: {
        header: {
          icon: 'fa fa-list',
          title: 'IPCAM厂商'
        },
        cfg: {
          isCheckable: false,
          isShowHead: true,
          isShowOperation: true,
          columns: [{
            field: '_id',
            text: '序号',
            width: '5%'
          }, {
            field: 'manufacture',
            text: '厂商',
            width: '12%'
          }, {
            field: 'productModelStr',
            text: '产品型号',
            width: '12%'
          }, {
            field: 'mainPathFmt',
            text: '主码流路径',
            width: 'auto'
          }, {
            field: 'subPathFmt',
            text: '次码流路径',
            width: 'auto'
          }],
          operation: {
            text: '操作',
            width: '12%',
            actions: [{
              icon: 'glyphicon glyphicon-trash',
              doClick: this.doDelIpcamVendor
            }, {
              icon: 'glyphicon glyphicon-edit',
              doClick: this.doShowIpcVendorDetail
            }]
          }
        },        
        state: {
          listsLoading: true
        },
        lists: []
      }
    }
  },
  methods: {
    resetTmpIpcamCfgByDft: function() {
      this.tmpIpcamCfg = {
        _id: -1,
        port: 554,
        subStatus: 1,
        manufacture: 'Hikvision',
        productModel: '*',
        username: 'admin',
        password: '12345',
        channel: 1,
        ipaddr: '192.168.1.100',
        name: 'example',
        tag: '',
        useCustomUrl: 0,
        mainUrl: '',
        previewUrl: '',
        valid: true  
      };
    },
    resetTmpIpcamCfgById: function(id) {
      var ipcamCfg = this.getIpcamCfgById(id);
      if (ipcamCfg) {
        this.tmpIpcamCfg = {
          _id: ipcamCfg._id,
          port: ipcamCfg.port,
          subStatus: ipcamCfg.subStatus,
          manufacture: ipcamCfg.manufacture,
          productModel: ipcamCfg.productModel,
          username: ipcamCfg.username,
          password: ipcamCfg.password,
          channel: ipcamCfg.channel,
          ipaddr: ipcamCfg.ipaddr,
          name: ipcamCfg.name,
          tag: ipcamCfg.tag,
          useCustomUrl: ipcamCfg.useCustomUrl,
          mainUrl: ipcamCfg.mainUrl,
          previewUrl: ipcamCfg.previewUrl,
          valid: true
        }
      } else {
        log.ERROR_TRACE('getIpcamCfgById ' + id + ' fail');
      }
    },
    resetTmpIpcamVendorCfgByDft: function() {
      this.tmpIpcamVendorCfg = {
        manufacture: '',
        productModels: '[\"*\"]',
        productModelsEdit: '*',
        mainPathFmt: '',
        subPathFmt: '',
        valid: false
      };
    },
    resetTmpIpcamVendorCfgById: function(id) {
      var ipcamVendorCfg = this.getIpcamVendorCfgById(id);
      if (ipcamVendorCfg) {
        this.tmpIpcamVendorCfg = {
          manufacture: ipcamVendorCfg.manufacture,
          productModels: ipcamVendorCfg.productModels,
          productModelsEdit: ipcamVendorCfg.productModelsEdit,
          mainPathFmt: ipcamVendorCfg.mainPathFmt,
          subPathFmt: ipcamVendorCfg.subPathFmt,
          valid: true
        }
      } else {
        log.ERROR_TRACE('getIpcamVendorCfgById ' + id + ' fail');
      }
    },
    makeProductModelStr: function(lists) {
      lists.forEach(function(item, index, array) {
        item.productModelStr = '';
        item.productModelsEdit = '';
        var productModels = JSON.parse(item.productModels);
        if (Array.isArray(productModels)) {
          for (var i = 0; i < productModels.length; i++) {
            item.productModelStr += ("<p class='my-table-textarea'>" + productModels[i] + "</p>");
            item.productModelsEdit += productModels[i];
            if (i > 0) {
              item.productModelsEdit += '|';
            }
          };
        }
        log.DEBUG_TRACE(item.productModelStr);
      });
    },
    doExportIpcamVendorCfgs: function() {
      log.DEBUG_TRACE('doExportIpcamVendorCfgs');
      var url = this.$$.ipcamVendors;
      var text = JSON.stringify(this.vendors.lists, ['manufacture', 'productModels', 'mainPathFmt', 'subPathFmt'], 2);
      var type = 'application/json';
      var file = new Blob([text], {type: type});
      url.href = URL.createObjectURL(file);;
      url.download = 'IpcamVendors.json';
    },
    doLoadIpcamVendorCfgs: function() {
      this.vendors.state.listsLoading = true;
      serverApi.streamsrc.getItems('ipcamVendorCfgs', function(res) {
        if (res && res.code == 0) {
          this.vendors.lists = res.data.ipcamVendorCfgs;
          this.makeProductModelStr(this.vendors.lists);
        }
        this.vendors.state.listsLoading = false;
      }.bind(this));    
    },
    doLoadIpcameras: function() {
      this.ipcams.state.listsLoading = true;
      serverApi.streamsrc.getItems('ipcameras', function(res) {
        if (res && res.code == 0) {
          this.ipcams.lists = res.data.ipcameras;
        }
        this.ipcams.state.listsLoading = false;
      }.bind(this));  
    },
    doDelIpcam: function(id) {
      log.DEBUG_TRACE('To Del Ipcam ' + id);
      swal({
        title: "Are you sure?",
        text: "You will not be able to recover it!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false        
      }, 
      function() {
        serverApi.streamsrc.delItem('ipcameras', id, function(res) {
          if (res && res.code == 0) {
            this.doLoadIpcameras();
            swal("Deleted!", "Ipcam " + id + " has been deleted.", "success");
          } else {
            swal("Oops!", "Something wrong:" + res.code, "error");
          }
        }.bind(this));
      }.bind(this)); 
    },
    doSaveIpcam: function() {
      var ipcamCfg = this.tmpIpcamCfg;
      if (!ipcamCfg.valid) {
        return;
      }
      var toSaveIpcamCfg = {
        _id: ipcamCfg._id,
        port: ipcamCfg.port,
        subStatus: ipcamCfg.subStatus,
        manufacture: ipcamCfg.manufacture,
        productModel: ipcamCfg.productModel,
        username: ipcamCfg.username,
        password: ipcamCfg.password,
        channel: ipcamCfg.channel,
        ipaddr: ipcamCfg.ipaddr,
        name: ipcamCfg.name,
        tag: ipcamCfg.tag,
        useCustomUrl: ipcamCfg.useCustomUrl,
        mainUrl: ipcamCfg.mainUrl,
        previewUrl: ipcamCfg.previewUrl
      };   
      serverApi.streamsrc.setItem('ipcameras', toSaveIpcamCfg, function(res) {
        if (res && res.code == 0) {
          this.doLoadIpcameras();
        } else {
          if (ipcamCfg._id > 0) {
            swal({
              title: 'Oops!',
              text: "Modify Ipcam " + ipcamCfg._id + " Fail:" + res.code,
              type: "error",
              showConfirmButton: true
            });
          } else {
            swal({
              title: 'Oops!',
              text: "Add Ipcam Fail:" + res.code,
              type: "error",
              showConfirmButton: true
            });
          }
        }
      }.bind(this));
      this.showIpcDetail = false;
    },
    doShowIpcDetail: function(id) {
      log.DEBUG_TRACE('Show Ipcam ' + id);
      if (id > 0) {
        this.resetTmpIpcamCfgById(id);
      } else {
        this.resetTmpIpcamCfgByDft();
      }
      this.showIpcDetail = true;
    },
    doDelIpcamVendor: function(id) {
      log.DEBUG_TRACE('To Del Ipcam Vendor ' + id);
      swal({
        title: "Are you sure?",
        text: "You will not be able to recover it!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false        
      }, 
      function() {
        serverApi.streamsrc.delItem('ipcamVendorCfgs', id, function(res) {
          if (res && res.code == 0) {
            this.doLoadIpcamVendorCfgs();
            swal("Deleted!", "Ipcam Vendor " + id + " has been deleted.", "success");
          } else {
            swal("Oops!", "Something wrong:" + res.code, "error");
          }
        }.bind(this));
      }.bind(this)); 
    },
    makeProductModels: function(productModelsEdit) {
      var items = productModelsEdit.split("|");
      return JSON.stringify(items);
    },
    doSaveIpcamVendor: function() {
      var ipcamVendorCfg = this.tmpIpcamVendorCfg;
      if (!ipcamVendorCfg.valid) {
        return;
      }
      var toSaveIpcamVendorCfg = {
        manufacture: ipcamVendorCfg.manufacture,
        productModels: this.makeProductModels(ipcamVendorCfg.productModelsEdit),
        mainPathFmt: ipcamVendorCfg.mainPathFmt,
        subPathFmt: ipcamVendorCfg.subPathFmt
      };   
      serverApi.streamsrc.setItem('ipcamVendorCfgs', toSaveIpcamVendorCfg, function(res) {
        if (res && res.code == 0) {
          this.doLoadIpcamVendorCfgs();
        } else {
          if (toSaveIpcamVendorCfg._id > 0) {
            swal({
              title: 'Oops!',
              text: "Modify Ipcam Vendor " + toSaveIpcamVendorCfg._id + " Fail:" + res.code,
              type: "error",
              showConfirmButton: true
            });
          } else {
            swal({
              title: 'Oops!',
              text: "Add Ipcam Vendor Fail:" + res.code,
              type: "error",
              showConfirmButton: true
            });
          }
        }
      }.bind(this));
      this.showIpcVendorDetail = false;
    },
    doShowIpcVendorDetail: function(id) {
      log.DEBUG_TRACE('Show Ipcam Vendor ' + id);
      if (id > 0) {
        this.resetTmpIpcamVendorCfgById(id);
      } else {
        this.resetTmpIpcamVendorCfgByDft();
      }
      this.showIpcVendorDetail = true;
    },
    getIpcamCfgById: function(id) {
      if (id <= 0) {
        return null;
      }

      var ipcams = this.ipcams.lists;
      for (var i = 0; i < ipcams.length; i++) {
        if (ipcams[i]._id == id) {
          return ipcams[i];
        }
      };

      return null;
    },
    getIpcamVendorCfgById: function(id) {
      if (id <= 0) {
        return null;
      }

      var vendors = this.vendors.lists;
      for (var i = 0; i < vendors.length; i++) {
        if (vendors[i]._id == id) {
          return vendors[i];
        }
      };

      return null;
    }
  },  
  ready: function () {
    this.doLoadIpcamVendorCfgs();
    this.doLoadIpcameras();
  }
}
</script>

<style>
.my-table-textarea {
  margin: 0;
}
</style>