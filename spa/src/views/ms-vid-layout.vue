<template>
<div class="row">
  <vs-modal title="布局信息" show="{{@ showVidLayoutDetail}}" effect="fade" width="800" callback="{{doSaveVidLayout}}">
    <div class="modal-body">
      <my-vid-layout-detail show="{{showVidLayoutDetail}}" vid-layout-cfg="{{@ tmpVidLayoutCfg}}" get-stream-src-name="{{ops.getStreamSrcName}}"></my-vid-layout-detail>
    </div>
  </vs-modal>
  <div class="col-md-12">
    <rd-widget>
      <rd-widget-header header="{{* layouts.header}}">
        <form class="form-inline">
          <div class="form-group">
            <label class="control-label">过滤</label>
            <select class="form-control input-sm" v-model="selectedMultiScreen" options="multiScreenOptions">
            </select>
          </div>  
          <div class="form-group">
            <label class="control-label">LCD</label>
            <select class="form-control input-sm" v-model="currTopoLcdDev" options="topoLcdDevs | topoOptionsExtrace">
            </select>
          </div>
          <div class="form-group">
            <label class="control-label">时间间隔</label>
            <select class="form-control input-sm" v-model="interval" options="intervalOptions">
            </select>
          </div>
          <button class="btn btn-sm btn-default" v-on="click:doAutoSetLcdVidLayout">
            <span class="glyphicon glyphicon-retweet"></span> 定时切换
          </button>
          <button class="btn btn-sm btn-default" v-on="click:doShowVidLayoutDetail(-1)">
            <span class="glyphicon glyphicon-plus"></span> 保存当前布局
          </button>
          <button class="btn btn-sm btn-default" v-on="click:doLoadVidLayouts">
            <span class="glyphicon glyphicon-refresh"></span> 刷新
          </button>
        </form>
      </rd-widget-header>
      <rd-widget-body class="no-padding" v-class="large:layouts.lists.length > 5">
        <my-table cfg="{{* layouts.cfg}}" lists="{{layouts.lists | showFilter}}" state="{{layouts.state}}"></my-table>
      </rd-widget-body>
      <rd-widget-footer>
        <strong>总数：</strong>{{layouts.lists.length}}
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
  replace: true,
  props: ['ops'],
  components: {
    myVidLayoutDetail: require('./my-vid-layout-detail.vue'),
  },
  filters: {
    topoOptionsExtrace: function(lists) {
      return lists.map(function(item, index) {
        return {
          text: item.devName,
          value: index
        }
      });
    },
    showFilter: function(lists) {
      return lists.filter(function(item, index) {
        return (this.selectedMultiScreen === 'all' || this.selectedMultiScreen === item.multiScreen);
      }, this);
    }
  },
  data: function() {
    return {
      showVidLayoutDetail: false,
      tmpVidLayoutCfg: {
        _id: 0,
        name: '',
        multiScreenX: 1,
        multiScreenY: 1,
        windowList: []
      },
      layouts: {
        header: {
          icon: 'fa fa-list',
          title: '视频布局'
        },
        cfg: {
          isCheckable: true,
          isShowHead: true,
          isShowOperation: true,
          columns: [{
            field: '_id',
            text: 'ID',
            width: '5%'
          }, {
            field: 'name',
            text: '名字',
            width: '10%'
          }, {
            field: 'multiScreen',
            text: '适用宽高',
            width: '15%'
          }],
          operation: {
            text: '操作',
            width: 'auto',
            actions: [{
              icon: 'glyphicon glyphicon-trash',
              doClick: this.doDelVidLayout
            }, {
              icon: 'glyphicon glyphicon-edit',
              doClick: this.doShowVidLayoutDetail
            }, {
              icon: 'glyphicon glyphicon-play',
              doClick: this.doSetLcdVidLayout
            }]
          }
        },   
        state: {
          listsLoading: true
        },     
        lists: []
      },
      currTopoLcdDev: 0,
      topoLcdDevs: [],
      currentIndex: 0,
      interval: 3,
      intervalOptions: [1, 3, 5, 10, 15, 20, 30],
      selectedMultiScreen: 'all',
      multiScreenOptions: []
    }
  },
  methods: {
    getVidLayoutById: function(id) {
      if (id <= 0) {
        return null;
      }

      var vidLayouts = this.layouts.lists;
      for (var i = 0; i < vidLayouts.length; i++) {
        if (vidLayouts[i]._id == id) {
          return vidLayouts[i];
        }
      };

      return null;
    },
    doLoadVidLayouts: function() {
      this.layouts.state.listsLoading = true;
      this.$dispatch('get-vidLayouts');
    },
    setLcdVidLayout: function(vidLayout) {
      var paramlist = {
        multiScreenX: vidLayout.multiScreenX,
        multiScreenY: vidLayout.multiScreenY,
        windowList: JSON.parse(vidLayout.windowList)
      };
      var topoLcdDev = this.topoLcdDevs[this.currTopoLcdDev];
      serverApi.mediaPhy.setDevId(topoLcdDev.topoId);
      serverApi.mediaPhy.sendCmd('setLayout', paramlist);
    },
    doSetLcdVidLayout: function(id) {
      var vidLayout  = this.getVidLayoutById(id);
      this.setLcdVidLayout(vidLayout);
    },
    autoSetLcdVidLayout: function() {
      var vidLayout = {};

      while (!vidLayout._checked) {
        if (this.currentIndex >= this.layouts.lists.length) {
          this.currentIndex = 0;
        }
        vidLayout = this.layouts.lists[this.currentIndex];
        this.currentIndex++;
      }
      log.DEBUG_TRACE('auto set:' + vidLayout.name);
      this.setLcdVidLayout(vidLayout);
    },
    doAutoSetLcdVidLayout: function() {
      var num = _.countBy(this.layouts.lists, function(item) {
        return (item._checked === 1) ? 'checked' : 'unchecked';
      });
      if (!num.checked) {
        swal({
          title: 'Oops!',
          text: "请勾选视频布局条目",
          type: "error",
          showConfirmButton: true
        });        
        return;
      }
      var timer = setInterval(this.autoSetLcdVidLayout, this.interval * 1000);
      swal({
        title: '自动切换中...',
        text: "MIDIS: All IN ONE",
        type: "info",
        showCancelButton: false,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "停止",
        closeOnConfirm: true
      }, 
      function() {
        log.DEBUG_TRACE('Stoped');
        clearInterval(timer);
      });
    },
    doDelVidLayout: function(id) {
      log.DEBUG_TRACE('To Del VidLayout ' + id);
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
        serverApi.multimedia.delItem('vidLayouts', id, function(res) {
          if (res && res.code == 0) {
            this.doLoadVidLayouts();
            swal("Deleted!", "VidLayout " + id + " has been deleted.", "success");
          } else {
            swal("Oops!", "Something wrong:" + res.code, "error");
          }
        }.bind(this));
      }.bind(this)); 
    },
    doSaveVidLayout: function() {
      var req = {
        _id: this.tmpVidLayoutCfg._id,
        name: this.tmpVidLayoutCfg.name,
        multiScreenX: this.tmpVidLayoutCfg.multiScreenX,
        multiScreenY: this.tmpVidLayoutCfg.multiScreenY,
        windowList: JSON.stringify(this.tmpVidLayoutCfg.windowList)
      };
      serverApi.multimedia.setItem('vidLayouts', req, function(res) {
        this.showVidLayoutDetail = false;
        this.doLoadVidLayouts();
      }.bind(this));
    },
    doShowCurrLcdVidLayoutDetail: function() {
      var multiScreenX = 1;
      var multiScreenY = 1;
      var topoLcdDev = this.topoLcdDevs[this.currTopoLcdDev];

      if (topoLcdDev.devModel.indexOf('lcdwall') != -1) {
        var multis = topoLcdDev.devModel.split('.')[2];
        multiScreenX = parseInt(multis[0] + multis[1]);
        multiScreenY = parseInt(multis[2] + multis[3])
        log.DEBUG_TRACE('multiScreenX: ' + multiScreenX);
        log.DEBUG_TRACE('multiScreenY: ' + multiScreenY);
      }

      serverApi.mediaPhy.setDevId(topoLcdDev.topoId);
      serverApi.mediaPhy.getItems('windowList', function(res) {
        if (res && res.code == 0) {
          this.tmpVidLayoutCfg._id = 0;
          this.tmpVidLayoutCfg.name = 'default';
          this.tmpVidLayoutCfg.multiScreenX = multiScreenX;
          this.tmpVidLayoutCfg.multiScreenY = multiScreenY;
          this.tmpVidLayoutCfg.windowList = res.data.windowList;
          this.showVidLayoutDetail = true;
        }
      }.bind(this));
    },
    doShowVidLayoutDetail: function(id) {
      if (id <= 0) {
        this.doShowCurrLcdVidLayoutDetail();
      } else {
        var vidLayout = this.getVidLayoutById(id);
        if (!vidLayout) {
          return;
        }

        this.tmpVidLayoutCfg._id = id;
        this.tmpVidLayoutCfg.name = vidLayout.name;
        this.tmpVidLayoutCfg.multiScreenX = vidLayout.multiScreenX;
        this.tmpVidLayoutCfg.multiScreenY = vidLayout.multiScreenY;
        var windowList = JSON.parse(vidLayout.windowList);
        this.tmpVidLayoutCfg.windowList.splice(0, this.tmpVidLayoutCfg.windowList.length);
        _.each(windowList, function(item, index, list) {
          this.splice(this.length, 0, item);
        }, this.tmpVidLayoutCfg.windowList);
        this.showVidLayoutDetail = true;
      }
    }
  },  
  created: function() {
    this.$on('topoDevsSummary', function(list) {
      this.topoLcdDevs.splice(0, this.topoLcdDevs.length);
      _.each(list, function(item, index, list) {
        if (item.devModel.indexOf('lcd') != -1) {
          this.topoLcdDevs.splice(0, 0, item);
        }
      }, this);
    });
    this.$on('vidLayouts', function(list) {
      _.each(list, function(item, index, list) {
        item._checked = 0;
        item.multiScreen = item.multiScreenX + 'x' + item.multiScreenY;
      });
      this.layouts.lists = list;  
      this.layouts.state.listsLoading = false;

      var allMultiScreens = _.map(list, function(item) {
        return item.multiScreen;
      });
      allMultiScreens.splice(0, 0, 'all');
      this.multiScreenOptions = _.uniq(allMultiScreens);      
    });
  }
}
</script>

<style>
.my-table-textarea {
  margin: 0;
}
</style>