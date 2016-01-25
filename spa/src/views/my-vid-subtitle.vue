<template>
<form class="form-horizontal" method="post" action="#">
  <vs-modal show="{{@ showDetail}}" effect="fade" width="800" callback="{{doSaveCfg}}">
    <div class="modal-header">
      <h4 class="modal-title" >{{tmpCfg._id}}</h4>
    </div>
    <div class="modal-body">
      <my-vid-subtitle-detail cfg="{{@ tmpCfg}}" show="{{showDetail}}">
      </my-vid-subtitle-detail>
    </div>
  </vs-modal>
  <div class="form-group">
    <my-table cfg="{{* tblCfg}}" lists="{{lists}}" state="{{state}}"></my-table>
  </div>
</form>
</template>

<script>
var log = require('../lib/log');
var devCodecApi = require('../lib/devCodecApi');

module.exports = {
  replace: true,
  props: ['listName'],
  components: {
    myVidSubtitleDetail: require('./my-vid-subtitle-detail.vue')
  },
  data: function() {
    return {
      showDetail: false,
      tmpCfg: {
        _id: '',
        enable: 0,
        fontSize: 32,
        fontColor: '#ffffff',
        posX: 0,
        posY: 0,
        type: '',
        content: ''
      },
      tblCfg: {
        isCheckable: false,
        isShowHead: true,
        isShowOperation: true,
        columns: [{
          field: '_id',
          text: 'ID',
          width: '5%'
        }, {
          field: 'enable',
          text: '启用',
          width: '5%'
        }, {
          field: 'fontSize',
          text: '字号',
          width: '10%'
        }, {
          field: 'fontColorShow',
          text: '颜色',
          width: '15%'
        }, {
          field: 'type',
          text: '类型',
          width: '20%'
        }, {
          field: 'content',
          text: '内容',
          width: '30%'
        }],
        operation: {
          text: '详细',
          width: 'auto',
          actions: [{
            icon: 'glyphicon glyphicon-edit',
            doClick: this.doShowDetail
          }]
        }
      }, 
      state: {
        listsLoading: true
      },
      lists: []
    }
  },
  methods: {
    getCfgById: function(id) {
      if (id <= 0) {
        return null;
      }

      var cfgs = this.lists;
      for (var i = 0; i < cfgs.length; i++) {
        if (cfgs[i]._id == id) {
          return cfgs[i];
        }
      };

      return null;
    },
    doShowDetail: function(id) {
      var cfg = this.getCfgById(id);
      if (cfg) {
        this.tmpCfg._id = cfg._id;
        this.tmpCfg.enable = cfg.enable;
        this.tmpCfg.fontSize = cfg.fontSize;
        this.tmpCfg.fontColor = cfg.fontColor;
        this.tmpCfg.posX = cfg.posX;
        this.tmpCfg.posY = cfg.posY;
        this.tmpCfg.type = cfg.type;
        this.tmpCfg.content = cfg.content;

        this.showDetail = true;
      }
    },
    doSaveCfg: function() {
      var req = this.tmpCfg;
      devCodecApi.multimedia.setItem(this.listName, req, function(res) {
        if (res === undefined || res.code != 0) {
          log.showErrorWithRes(res);
        } else {
          this.doLoadLists();
        }        
      }.bind(this));
      this.showDetail = false;
    },
    makeFontColorShow: function(lists) {
      lists.forEach(function(item, index, array) {
        item.fontColorShow = '<div style="border-style:solid;border-color:#000;border-width:1px;background-color:' + item.fontColor + ';width:40px;height:20px;margin:0;margin-left:auto;margin-right:auto"></div>';
        //log.DEBUG_TRACE(item.fontColorShow);
      });
    },
    doLoadLists: function() {
      this.state.listsLoading = true;
      devCodecApi.multimedia.getItems(this.listName, function(res) {
        if (res && res.code == 0) {
          this.lists = res.data[this.listName];
          this.makeFontColorShow(this.lists);
        }
        this.state.listsLoading = false;
      }.bind(this));
    }
  },
  ready: function() {
    this.doLoadLists();
  }
}
</script>

<style>
</style>