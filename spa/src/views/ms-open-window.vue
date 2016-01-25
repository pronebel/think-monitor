<template>
<div class="row">
  <vs-modal title="参数设置" show="{{@ showSettings}}" effect="fade" width="800">
    <div class="modal-body">
      <form class="form-horizontal">
        <div class="form-group">
          <label class="col-sm-2 control-label">过滤</label>
          <div class="col-sm-10">
            <select class="form-control input-sm" v-model="selectedSrcType" options="srcTypeOptions">
            </select>
          </div>
        </div> 
        <div class="form-group">
          <label class="col-sm-2 control-label">LCD</label>
          <div class="col-sm-10">
            <select class="form-control input-sm" v-model="currTopoLcdDev" options="topoLcdDevs | topoOptionsExtrace">
            </select>
          </div>
        </div> 
        <div class="form-group">
          <label class="col-sm-2 control-label">布局</label>
          <div class="col-sm-10">
            <select class="form-control input-sm" v-model="currVidLayout" options="vidLayouts | vidLayoutOptions">
            </select>
          </div>
        </div> 
        <div class="form-group">
          <label class="col-sm-2 control-label">开窗模式</label>
          <div class="col-sm-10">
            <div class="checkbox">
              <label>
                <input type="checkbox" v-model="isDupWhenSetVidLayout"> 复制
              </label>
            </div>
          </select>
          </div>
        </div>  
        <div class="form-group">
          <label class="col-sm-2 control-label">转发服务器</label>
          <div class="col-sm-10">
            <select class="form-control input-sm" v-model="currTopoMediaDev" options="topoMediaDevs | topoOptionsExtrace" v-on="change: onTopoMediaDevChange">
            </select>
          </div>
        </div>                          
      </form>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-default" v-on="click: showSettings = false">退出</button>
    </div> 
  </vs-modal>
  <div class="col-md-12">
    <rd-widget>
      <rd-widget-header header="{{* streamSrcInfo.header}}">
        <form class="form-inline">
          <button class="btn btn-sm btn-default" v-on="click: showSettings = true">
            <span class="glyphicon glyphicon-cog"></span> 参数
          </button>
          <button class="btn btn-sm btn-default" v-on="click:doSetLcdVidLayout">
            <span class="glyphicon glyphicon-retweet"></span> 一键开窗
          </button>
          <button class="btn btn-sm btn-default" v-on="click:doClearLcd">
            <span class="glyphicon glyphicon-retweet"></span> 清空
          </button>
          <button class="btn btn-sm btn-default" v-on="click:doSetTransferList">
            <span class="glyphicon glyphicon-retweet"></span> 启用IPCAM转发
          </button>
          <button class="btn btn-sm btn-default" v-on="click:doLoadStreamSrcs">
            <span class="glyphicon glyphicon-refresh"></span> 刷新
          </button>
        </form>
      </rd-widget-header>
      <rd-widget-body class="no-padding" v-class="large:streamSrc.lists.length > 5">
        <my-table cfg="{{* streamSrcInfo.cfg}}" lists='{{ streamSrc.lists | devFilter | orderBy "srcTypeText" }}' state="{{streamSrc.state}}"></my-table>
      </rd-widget-body>
      <rd-widget-footer>
        <strong>总数：</strong>{{streamSrc.lists.length}}
      </rd-widget-footer>
    </rd-widget>
  </div>
</div>
<div class="row">
  <div class="col-md-12">
    <rd-widget>
      <rd-widget-header header="{{* transferInfo.header}}">
      </rd-widget-header>
      <rd-widget-body class="no-padding" v-class="large:transferInfo.lists.length > 5">
        <my-table cfg="{{* transferInfo.cfg}}" lists={{transferInfo.lists}} state="{{transferInfo.state}}"></my-table>
      </rd-widget-body>
      <rd-widget-footer>
        <strong>总数：</strong>{{transferInfo.lists.length}}
      </rd-widget-footer>
    </rd-widget>
  </div>
</div>
</template>

<script>
var serverApi = require('../lib/serverApi');
var log = require('../lib/log');

module.exports = {
  replace: true,
  props: ['streamSrc'],
  filters: {
    topoOptionsExtrace: function(lists) {
      return lists.map(function(item, index) {
        return {
          text: item.devName,
          value: index
        }
      });
    },
    vidLayoutOptions: function(lists) {
      return lists.map(function(item, index) {
        return {
          text: item.text,
          value: index
        }
      });
    },
    devFilter: function(lists) {
      return lists.filter(function(item, index) {
        return (this.selectedSrcType === 'all' || this.selectedSrcType === item.srcType);
      }, this);
    }
  },
  data: function() {
    return {
      showSettings: false,
      topoKey: '',
      transferInfo: {
        header: {
          icon: 'fa fa-list',
          title: '转发列表'
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
            field: 'srcTopoId',
            text: '源TopoId',
            width: '5%'
          }, {
            field: 'srcPortName',
            text: '源窗口',
            width: '10%'
          }, {
            field: 'dstMainUrlPath',
            text: '主码流转发路径',
            width: '30%'
          }, {
            field: 'dstPreviewUrlPath',
            text: '预览流转发路径',
            width: '30%'
          }],
          operation: {
              text: '操作',
              width: 'auto',
              actions: [{
                icon: 'glyphicon glyphicon-trash',
                doClick: this.doDelTranProxyItem
              }]
            }
        },   
        state: {
          listsLoading: true
        },     
        lists: [],
      },
      streamSrcInfo: {
        header: {
          icon: 'fa fa-list',
          title: '流媒体源'
        },
        cfg: {
          isCheckable: true,
          isShowHead: true,
          isShowOperation: false,
          columns: [{
            field: 'topoId',
            text: 'TopoId',
            width: '5%'
          }, {
            field: 'name',
            text: '名字',
            width: '10%'
          }, {
            field: 'portName',
            text: '窗口',
            width: '10%'
          }, {
            field: 'srcTypeText',
            text: '类型',
            width: '5%'
          }, {
            field: 'mainUrl',
            text: '主码流地址',
            width: 'auto'
          }, {
            field: 'previewUrl',
            text: '预览流地址',
            width: 'auto'
          }]
        }
      },
      isDupWhenSetVidLayout: true,
      currTopoLcdDev: 0,
      topoLcdDevs: [], 
      currVidLayout: 0,
      vidLayouts: require('../configs/vidLayoutCfg.js'),
      currTopoMediaDev: 0,
      topoMediaDevs: [],
      selectedSrcType: 'all',
      srcTypeOptions: [{
        value: 'all',
        text: '全部'
      }, {
        value: 'encoder',
        text: '编码器'
      }, {
        value: 'ipcam',
        text: '网络摄像机'
      }, {
        value: 'softenc',
        text: '软编码器'
      }, {
        value: 'proxy',
        text: '转发流'
      }]
    }
  },
  methods: {
    doLoadStreamSrcs: function() {
      this.$dispatch('get-streamSrc');
    },
    getCurrLcdScreenCfg: function() {
      var topoLcdDev = this.topoLcdDevs[this.currTopoLcdDev];
      var cfg = {
        multiScreenX: 1,
        multiScreenY: 1,
        topoId: -1
      }
      if (!topoLcdDev) {
        return null;
      }
      cfg.topoId = topoLcdDev.topoId;
      if (topoLcdDev.devModel.indexOf('lcdwall') != -1) {
        var multis = topoLcdDev.devModel.split('.')[2];
        cfg.multiScreenX = parseInt(multis[0] + multis[1]);
        cfg.multiScreenY = parseInt(multis[2] + multis[3])
        log.DEBUG_TRACE('multiScreenX: ' + cfg.multiScreenX);
        log.DEBUG_TRACE('multiScreenY: ' + cfg.multiScreenY);
      }

      return cfg;
    },
    setLcdVidLayout: function(lcdScreenCfg, windowList) {
      var paramlist = {
        multiScreenX: lcdScreenCfg.multiScreenX,
        multiScreenY: lcdScreenCfg.multiScreenY,
        windowList: windowList
      };
      log.DEBUG_TRACE(JSON.stringify(paramlist));
      serverApi.mediaPhy.setDevId(lcdScreenCfg.topoId);
      serverApi.mediaPhy.sendCmd('setLayout', paramlist);
    },
    getCurrWindowList: function(lcdScreenCfg, opt) {
      var vidLayout = this.vidLayouts[this.currVidLayout];

      var streamSrcs = _.filter(this.streamSrc.lists, function(item) {
        return item._checked === 1;
      });

      if (streamSrcs.length === 0) {
        swal({
          title: 'Oops!',
          text: "请勾选源窗口",
          type: "error",
          showConfirmButton: true
        });    
        return null;
      }

      if (streamSrcs.length > vidLayout.windowList.length) {
        swal({
          title: 'Oops!',
          text: "请勾选少于" + vidLayout.windowList.length + '个源窗口',
          type: "error",
          showConfirmButton: true
        }); 
        return null;
      }

      var windowList = [];   
      if (opt && opt.dup) {
        _.each(vidLayout.windowList, function(item, index) {
          var streamSrcIndex = index % streamSrcs.length;
          var streamSrc = streamSrcs[streamSrcIndex];
          var coordinate = item.coordinate;
          windowList.splice(0, 0, {
            windowId: index + 1, 
            srcTopoId: streamSrc.topoId,
            srcPortName: streamSrc.portName,
            playAudio: 0,
            layer: index + 1, 
            coordinate: {
              topHoriz: coordinate.topHoriz * lcdScreenCfg.multiScreenX,
              topVerti: coordinate.topVerti * lcdScreenCfg.multiScreenY,
              bottomHoriz: coordinate.bottomHoriz * lcdScreenCfg.multiScreenX,
              bottomVerti: coordinate.bottomVerti * lcdScreenCfg.multiScreenY,
            }
          });          
        });
      } else {
        _.each(streamSrcs, function(item, index) {
          var coordinate = vidLayout.windowList[index].coordinate;
          //log.DEBUG_TRACE('window: ' + item.topoId + ':' + item.portName);
          windowList.splice(0, 0, {
            windowId: index + 1, 
            srcTopoId: item.topoId,
            srcPortName: item.portName,
            playAudio: 0,
            layer: index + 1, 
            coordinate: {
              topHoriz: coordinate.topHoriz * lcdScreenCfg.multiScreenX,
              topVerti: coordinate.topVerti * lcdScreenCfg.multiScreenY,
              bottomHoriz: coordinate.bottomHoriz * lcdScreenCfg.multiScreenX,
              bottomVerti: coordinate.bottomVerti * lcdScreenCfg.multiScreenY,
            }
          });
        });        
      }

      return windowList;
    },
    doClearLcd: function() {
      var lcdScreenCfg = this.getCurrLcdScreenCfg();

      if (lcdScreenCfg === null) {
        swal({
          title: 'Oops!',
          text: "无效的目标设备",
          type: "error",
          showConfirmButton: true
        }); 
        return;
      }

      this.setLcdVidLayout(lcdScreenCfg, []);
    },
    doSetLcdVidLayout: function() {
      var opt = {
        dup: this.isDupWhenSetVidLayout
      };
      this.doSetLcdVidLayoutOpt(opt);
    },
    doSetLcdVidLayoutOpt: function(opt) {
      var lcdScreenCfg = this.getCurrLcdScreenCfg();

      if (lcdScreenCfg === null) {
        swal({
          title: 'Oops!',
          text: "无效的目标设备",
          type: "error",
          showConfirmButton: true
        }); 
        return;
      }

      var windowList = this.getCurrWindowList(lcdScreenCfg, opt);
      if (null === windowList) {
        return;
      }

      this.setLcdVidLayout(lcdScreenCfg, windowList);
    },
    //transfer
    setTransferList: function(streamSrcs) {
      var topoDev = this.topoMediaDevs[this.currTopoMediaDev];
      if (topoDev && topoDev.topoId > 0) {
        var paramlist = {
          proxyList: []
        };
        var topoKey = this.topoKey;
        _.each(streamSrcs, function(item, index, list) {
          this.splice(this.length, 0, {
            srcTopoId: item.topoId, 
            srcPortName: item.portName,
            name: item.name, 
            mainUrl: item.mainUrl,
            dstMainUrlPath: topoKey + '/' + item.topoId + '/' + item.portName + '/main',
            previewUrl: item.previewUrl,
            dstPreviewUrlPath: topoKey + '/' + item.topoId + '/' + item.portName + '/preview'
          });
        }, paramlist.proxyList);
        log.showWait('Saving', 1);
        serverApi.transfer.setDevId(topoDev.topoId);
        serverApi.transfer.sendCmd('importItem', paramlist, function(res) {
          if (res === undefined || res.code != 0) {
            log.showErrorWithRes(res);
          } else {
            this.doLoadStreamSrcs();
            this.doLoadTranProxyList();
          }

        }.bind(this)); 
      } 
    },
    doSetTransferList: function() {
      if (this.topoKey === '') {
        swal({
          title: 'Oops!',
          text: "无效Topo",
          type: "error",
          showConfirmButton: true
        });   
      }

      var streamSrcs = _.filter(this.streamSrc.lists, function(item) {
        return item._checked === 1 && item.srcType === 'ipcam';
      });

      if (streamSrcs.length === 0) {
        streamSrcs = _.filter(this.streamSrc.lists, function(item) {
          return item.srcType === 'ipcam';
        });  

        if (streamSrcs.length === 0) {
          swal({
            title: 'Oops!',
            text: "未找到IPCAM",
            type: "error",
            showConfirmButton: true
          });
        } else {          
          swal({
            title: 'Oops!',
            text: "未勾选IPCAM，是否转发所有IPCAM?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes!",
            closeOnConfirm: true,
            showLoaderOnConfirm: false, 
          }, 
          function() {
            this.setTransferList(streamSrcs);
          }.bind(this));
        }

        return;       
      }

      this.setTransferList(streamSrcs);   
    },
    doLoadTranProxyListOfMediaDev: function(topoId) {
      this.transferInfo.lists.splice(0, this.transferInfo.lists.length);
      this.transferInfo.state.listsLoading = true;
      serverApi.transfer.setDevId(topoId);
      serverApi.transfer.getItems('proxyList', function(res) {
        if (res && res.code == 0) {
          _.each(res.data.proxyList, function(item, index, list) {
            this.transferInfo.lists.splice(this.transferInfo.lists.length, 0, item);
          }, this);
        }
        this.transferInfo.state.listsLoading = false;
      }.bind(this));
    },
    doLoadTranProxyList: function() {
      var topoDev = this.topoMediaDevs[this.currTopoMediaDev];
      if (topoDev && topoDev.topoId > 0) {
        this.doLoadTranProxyListOfMediaDev(topoDev.topoId);
      }
    },
    onTopoMediaDevChange: function() {
      //log.DEBUG_TRACE('currTopoMediaDev:' + this.currTopoMediaDev);
      this.doLoadTranProxyList();
    },
    doDelTranProxyItem: function(id) {
      var topoDev = this.topoMediaDevs[this.currTopoMediaDev];
      if (topoDev && topoDev.topoId > 0) {
        serverApi.transfer.setDevId(topoDev.topoId);
        serverApi.transfer.delItem('proxyList', id, function(res) {
          if (res && res.code == 0) {
            this.doLoadStreamSrcs();
            this.doLoadTranProxyList();
          }
        }.bind(this)); 
      }
    },
    getTranProxyItemById: function(id) {
      if (id <= 0) {
        return null;
      }

      var proxyList = this.transferInfo.lists;
      for (var i = 0; i < rooms.length; i++) {
        if (proxyList[i]._id == id) {
          return proxyList[i];
        }
      };

      return null;
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

      this.topoMediaDevs.splice(0, this.topoMediaDevs.length);
      _.each(list, function(item, index, list) {
        if (item.devModel.indexOf('server.media') != -1) {
          this.topoMediaDevs.splice(0, 0, item);
        }
      }, this);   

      this.doLoadTranProxyList();
    });
    this.$on('devmngState', function(data) {
      this.topoKey = data._info.topoKey;
    });
  },
  ready: function () {
    this.doLoadStreamSrcs();
  }
}
</script>

<style>
</style>