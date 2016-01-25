<template>
<div class="row">
  <vs-modal title="详细信息" show="{{@ showSoftEncDetail}}" effect="fade" width="800" callback="{{doSaveSoftEnc}}">
    <div class="modal-body">
      <my-soft-enc-detail soft-enc-cfg="{{@ tmpSoftEncCfg}}">
      </my-soft-enc-detail>
    </div>
  </vs-modal>
  <div class="col-md-12">
    <rd-widget>
      <rd-widget-header header="{{* softencs.header}}">
        <button class="btn btn-sm btn-default" v-on="click:doShowSoftEncDetail(-1)">
          <span class="glyphicon glyphicon-plus"></span> 新增
        </button>
        <button class="btn btn-sm btn-default" v-on="click:doLoadSoftEncs">
          <span class="glyphicon glyphicon-refresh"></span> 刷新
        </button>
      </rd-widget-header>
      <rd-widget-body class="no-padding" v-class="large:softencs.lists.length > 5">
        <my-table cfg="{{* softencs.cfg}}" lists={{softencs.lists}} state="{{softencs.state}}"></my-table>
      </rd-widget-body>
      <rd-widget-footer>
        <strong>总数：</strong>{{softencs.lists.length}}
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
    mySoftEncDetail: require('./my-soft-enc-detail.vue'),
  },
  data: function() {
    return {
      showSoftEncDetail: false,
      tmpSoftEncCfg: {
        _id: -1,
        port: 554,
        ipaddr: '',
        name: '',
        tag: '',
        mainUrl: '',
        previewUrl: '',
        valid: false
      },
      softencs: {
        header: {
          icon: 'fa fa-list',
          title: '软编码器'
        },
        cfg: {
          isCheckable: false,
          isShowHead: true,
          isShowOperation: true,
          columns: [{
            field: '_id',
            text: 'ID',
            width: '15%'
          }, {
            field: 'name',
            text: '名字',
            width: '20%'
          }, {
            field: 'ipaddr',
            text: 'IP地址',
            width: '20%'
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
              doClick: this.doDelSoftEnc
            }, {
              icon: 'glyphicon glyphicon-edit',
              doClick: this.doShowSoftEncDetail
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
    resetTmpSoftEncCfgByDft: function() {
      this.tmpSoftEncCfg = {
        _id: -1,
        port: 554,
        ipaddr: '192.168.1.100',
        name: 'example',
        tag: '',
        mainUrl: '',
        previewUrl: '',
        valid: true  
      }
    },
    resetTmpSoftEncCfgById: function(id) {
      var softEncCfg = this.getSoftEncCfgById(id);
      if (softEncCfg) {
        this.tmpSoftEncCfg = {
          _id: softEncCfg._id,
          port: softEncCfg.port,
          ipaddr: softEncCfg.ipaddr,
          name: softEncCfg.name,
          tag: softEncCfg.tag,
          mainUrl: softEncCfg.mainUrl,
          previewUrl: softEncCfg.previewUrl,
          valid: true
        }
      } else {
        log.ERROR_TRACE('getSoftEncCfgById ' + id + ' fail');
      }
    },
    doLoadSoftEncs: function() {
      this.softencs.state.listsLoading = true;
      serverApi.streamsrc.getItems('softencs', function(res) {
        if (res && res.code == 0) {
          this.softencs.lists = res.data.softencs;
        }
        this.softencs.state.listsLoading = false;
      }.bind(this));  
    },
    doDelSoftEnc: function(id) {
      log.DEBUG_TRACE('To Del SoftEnc ' + id);
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
        serverApi.streamsrc.delItem('softencs', id, function(res) {
          if (res && res.code == 0) {
            this.doLoadSoftEncs();
            swal("Deleted!", "SoftEnc " + id + " has been deleted.", "success");
          } else {
            swal("Oops!", "Something wrong:" + res.code, "error");
          }
        }.bind(this));
      }.bind(this)); 
    },
    doSaveSoftEnc: function() {
      var softEncCfg = this.tmpSoftEncCfg;
      if (!softEncCfg.valid) {
        return;
      }
      var toSaveSoftEncCfg = {
        _id: softEncCfg._id,
        port: softEncCfg.port,
        ipaddr: softEncCfg.ipaddr,
        name: softEncCfg.name,
        tag: softEncCfg.tag
      };   
      serverApi.streamsrc.setItem('softencs', toSaveSoftEncCfg, function(res) {
        if (res && res.code == 0) {
          this.doLoadSoftEncs();
        } else {
          if (softEncCfg._id > 0) {
            swal({
              title: 'Oops!',
              text: "Modify SoftEnc " + softEncCfg._id + " Fail:" + res.code,
              type: "error",
              showConfirmButton: true
            });
          } else {
            swal({
              title: 'Oops!',
              text: "Add SoftEnc Fail:" + res.code,
              type: "error",
              showConfirmButton: true
            });
          }
        }
      }.bind(this));
      this.showSoftEncDetail = false;
    },
    doShowSoftEncDetail: function(id) {
      log.DEBUG_TRACE('Show SoftEnc ' + id);
      if (id > 0) {
        this.resetTmpSoftEncCfgById(id);
      } else {
        this.resetTmpSoftEncCfgByDft();
      }
      this.showSoftEncDetail = true;
    },
    getSoftEncCfgById: function(id) {
      if (id <= 0) {
        return null;
      }

      var softencs = this.softencs.lists;
      for (var i = 0; i < softencs.length; i++) {
        if (softencs[i]._id == id) {
          return softencs[i];
        }
      };

      return null;
    }
  },  
  ready: function () {
    this.doLoadSoftEncs();
  }
}
</script>

<style>
.my-table-textarea {
  margin: 0;
}
</style>