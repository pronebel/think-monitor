<template>
<div class="row">
  <vs-modal title="详细信息" show="{{@ showRecRoomDetail}}" effect="fade" width="800" callback="{{doSaveRecRoom}}">
    <div class="modal-body">
      <form class="form-horizontal">
        <div class="form-group">
          <label class="col-sm-2 control-label">房间名</label>
          <div class="col-sm-10">
            <input type="text" class="form-control" maxlength="60" v-model="recRoom.roomName" v-attr="readonly:recRoom._id > 0">
          </div>
        </div>
        <div class="form-group" v-show="recRoom._id > 0">
          <label class="col-sm-2 control-label">场景</label>
          <div class="col-sm-10">
            <input type="text" class="form-control" maxlength="60" v-model="recRoom.scene">
          </div>
        </div> 
        <div class="form-group" v-show="recRoom._id > 0">
          <label class="col-sm-2 control-label">布局选择</label>
          <div class="col-sm-10">
            <select class="form-control" v-model="recRoom.vidLayout" options="vidLayouts | vidLayoutOptionsExtrace" v-on="change: onRecRoomVidLayoutChange">
            </select>
          </div>
        </div> 
        <div class="form-group" v-show="recRoom._id > 0">
          <label class="col-sm-2 control-label">布局示意图</label>
          <div class="col-sm-10">
            <canvas v-el="preview" width="576" height="324" style="width:576px;height:324px;margin:0;margin-left:auto;margin-right:auto"></canvas>
          </div>
        </div>                     
      </form>
    </div>
  </vs-modal>
  <div class="col-md-12">
    <rd-widget>
      <rd-widget-header header="{{* header}}">
        <form class="form-inline">
          <div class="form-group">
            <label class="control-label">录播服务器</label>
            <select class="form-control input-sm" v-model="currTopoMediaDev" options="topoMediaDevs | topoOptionsExtrace" v-on="change: doLoadRecRooms">
            </select>
          </div>
          <button class="btn btn-sm btn-default" v-on="click:doShowRecRoomDetail(-1)">
            <span class="glyphicon glyphicon-plus"></span> 新增
          </button>
          <button class="btn btn-sm btn-default" v-on="click:doLoadRecRooms">
            <span class="glyphicon glyphicon-refresh"></span> 刷新
          </button>
        </form>
      </rd-widget-header>
      <rd-widget-body class="no-padding" v-class="large:lists.length > 5">
        <my-table cfg="{{* cfg}}" lists={{lists}} state="{{state}}"></my-table>
      </rd-widget-body>
      <rd-widget-footer>
        <strong>总数：</strong>{{lists.length}}
      </rd-widget-footer>
    </rd-widget>
  </div>
</div>
</template>

<script>
var video = require('../lib/video');
var serverApi = require('../lib/serverApi');
var log = require('../lib/log');
var utils = require('../lib/utils');

module.exports = {
  replace: true,
  props: ['ops'],
  filters: {
    topoOptionsExtrace: function(lists) {
      return lists.map(function(item, index) {
        return {
          text: item.devName,
          value: index
        }
      });
    },
    vidLayoutOptionsExtrace: function(lists) {
      return lists.map(function(item, index) {
        return {
          text: item._id + '_' + item.name,
          value: index
        }
      });
    }
  },
  data: function() {
    return {
      showRecRoomDetail: false,
      recRoom: {
        _id: -1,
        roomName: 'default',
        scene: '',
        vidLayout: -1,
        windowList: [],
        status: ''
      },
      header: {
        icon: 'fa fa-list',
        title: '录播房间'
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
          field: 'roomName',
          text: '房间名',
          width: '10%'
        }, {
          field: 'scene',
          text: '场景',
          width: '15%'
        }, {
          field: 'status',
          text: '状态',
          width: '15%'
        }],
        operation: {
            text: '操作',
            width: 'auto',
            actions: [{
              icon: 'glyphicon glyphicon-trash',
              doClick: this.doDelRecRoom
            }, {
              icon: 'glyphicon glyphicon-edit',
              doClick: this.doShowRecRoomDetail
            }, {
              icon: 'glyphicon glyphicon-facetime-video',
              doClick: this.doRecordOp
            }]
          }
      },   
      state: {
        listsLoading: true
      },     
      lists: [],
      currTopoMediaDev: 0,
      topoMediaDevs: [],
      vidLayouts: []
    }
  },
  methods: {
    doLoadRecRoomsOfMediaDev: function(topoId) {
      this.lists.splice(0, this.lists.length);
      this.state.listsLoading = true;
      serverApi.record.setDevId(topoId);
      serverApi.record.getItems('rooms', function(res) {
        if (res && res.code == 0) {
          _.each(res.data.rooms, function(item, index, list) {
            this.lists.splice(this.lists.length, 0, item);
          }, this);
        }
        this.state.listsLoading = false;
      }.bind(this));
    },
    doLoadRecRooms: function() {
      var topoDev = this.topoMediaDevs[this.currTopoMediaDev];
      if (topoDev && topoDev.topoId > 0) {
        this.doLoadRecRoomsOfMediaDev(topoDev.topoId);
      }
    },
    doSaveRecRoom: function() {
      var topoDev = this.topoMediaDevs[this.currTopoMediaDev];
      if (topoDev && topoDev.topoId > 0) {
        var action = null;
        var paramlist = null;
        if (this.recRoom._id > 0) {
          action = "setRoom";
          paramlist = {
            _id: this.recRoom._id,
            scene: this.recRoom.scene,
            windowList: JSON.stringify(this.recRoom.windowList)
          };
        } else {
          action = "addRoom";
          paramlist = {
            roomName: this.recRoom.roomName
          };
        }

        serverApi.record.setDevId(topoDev.topoId);
        serverApi.record.sendCmd(action, paramlist, function(res) {
          if (res && res.code == 0) {
            this.doLoadRecRooms();
          }
        }.bind(this));        
      } else {
        swal({
          title: 'Oops!',
          text: "无效的目标设备",
          type: "error",
          showConfirmButton: true
        }); 
      }
      this.showRecRoomDetail = false;
    },
    onRecRoomVidLayoutChange: function() {
      this.recRoom.windowList.splice(0, this.recRoom.windowList.length);
      var vidLayout = this.vidLayouts[this.recRoom.vidLayout];
      var windowList = JSON.parse(vidLayout.windowList);
      _.each(windowList, function(item, index, list) {
        this.splice(this.length, 0, item);
      }, this.recRoom.windowList);

      video.drawVidLayout(this.$$.preview, 
        this.recRoom.windowList, 
        12, 
        12, 
        this.ops.getStreamSrcName);      
    },
    getRecordOp: function(recRoom) {
      if ((recRoom.status === 'toStop')
        || (recRoom.status === 'stoped')) {
        return 'startRecord';
      } else if ((recRoom.status === 'toStart')
        || (recRoom.status === 'recording')) {
        return 'stopRecord';
      } else {
        return null;
      }
    },
    doRecordOp: function(id) {
      var recRoom = this.getRecRoomById(id);
      var opCmd = this.getRecordOp(recRoom);
      if (opCmd === null) {
        swal({
          title: 'Oops!',
          text: "不支持操作",
          type: "error",
          showConfirmButton: true
        }); 
      }
      var topoDev = this.topoMediaDevs[this.currTopoMediaDev];
      if (topoDev && topoDev.topoId > 0) {
        var paramlist = {
          _id: id
        };
        serverApi.record.setDevId(topoDev.topoId);
        serverApi.record.sendCmd(opCmd, paramlist, function(res) {
          if (res === undefined || res.code != 0) {
            log.showErrorWithRes(res);
          } else {
            this.doLoadRecRooms();
          }
        }.bind(this));   
      }
    },
    doDelRecRoom: function(id) {
      var topoDev = this.topoMediaDevs[this.currTopoMediaDev];
      if (topoDev && topoDev.topoId > 0) {
        var paramlist = {
          _id: id
        };
        serverApi.record.setDevId(topoDev.topoId);
        serverApi.record.sendCmd('removeRoom', paramlist, function(res) {
          if (res && res.code == 0) {
            this.doLoadRecRooms();
          }
        }.bind(this));   
      }
    },
    getRecRoomById: function(id) {
      if (id <= 0) {
        return null;
      }

      var rooms = this.lists;
      for (var i = 0; i < rooms.length; i++) {
        if (rooms[i]._id == id) {
          return rooms[i];
        }
      };

      return null;
    },
    doShowRecRoomDetail: function(id) {
      if (id > 0) {
        var now = new Date();
        var recRoom = this.getRecRoomById(id);
        this.recRoom._id = recRoom._id;
        this.recRoom.roomName = recRoom.roomName;
        //this.recRoom.scene = now.toString().split(' ').join('_');
        this.recRoom.scene = 'default';
        this.recRoom.vidLayout = -1;
        this.recRoom.status = recRoom.status;
        this.recRoom.windowList = JSON.parse(recRoom.windowList);

        video.drawVidLayout(this.$$.preview, 
          this.recRoom.windowList, 
          12, 
          12, 
          this.ops.getStreamSrcName); 
      } else {
        this.recRoom._id = -1;
        this.recRoom.roomName = 'default';
      }
      this.showRecRoomDetail = true;
    }
  },  
  created: function() {
    this.$on('topoDevsSummary', function(list) {
      this.topoMediaDevs.splice(0, this.topoMediaDevs.length);
      _.each(list, function(item, index, list) {
        if (item.devModel.indexOf('server.media') != -1) {
          this.topoMediaDevs.splice(0, 0, item);
          this.doLoadRecRoomsOfMediaDev(item.topoId);
        }
      }, this);
    });
    this.$on('vidLayouts', function(list) {
      this.vidLayouts.splice(0, this.vidLayouts.length);
      _.each(list, function(item, index, list) {
        if (item.multiScreenX === 1 && item.multiScreenY === 1) {
          this.splice(this.length, 0, item);
        }
      }, this.vidLayouts);
    });
  }
}
</script>

<style>
</style>