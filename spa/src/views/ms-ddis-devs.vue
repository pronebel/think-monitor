<template>
<div class="row">
  <div class="col-md-12">
    <rd-widget>
      <rd-widget-header header="{{* ddis.header}}">
        <form class="form-inline">
          <div class="form-group">
            <label class="control-label">IP过滤</label>
            <input type="text" class="form-control input-sm" v-model="inputedIpaddr" debounce="500">
          </div> 
          <div class="form-group">
            <label class="control-label">设备型号过滤</label>
            <select class="form-control input-sm" v-model="selectedDevType" options="devTypeOptions">
            </select>
          </div>        
          <button class="btn btn-sm btn-default" v-on="click:doLoadDdisDevs">
            <span class="glyphicon glyphicon-refresh"></span> 刷新
          </button>
          <button class="btn btn-sm btn-default" v-on="click:doSearchDdisDevs">
            <span class="glyphicon glyphicon-search"></span> 搜索
          </button>
        </form>
      </rd-widget-header>
      <rd-widget-body class="no-padding" v-class="large:ddis.lists.length > 5">
        <my-table cfg="{{* ddis.cfg}}" lists="{{ddis.lists | devFilter}}" state="{{ddis.state}}"></my-table>
      </rd-widget-body>
      <rd-widget-footer>
        <strong>总数：</strong>{{ddis.lists.length}}
      </rd-widget-footer>
    <rd-widget>    
  </div>
</div>
</template>

<script>
var serverApi = require('../lib/serverApi');
var log = require('../lib/log');

module.exports = {
  data: function() {
    return {
      ddis: {
        header: {
          icon: 'fa fa-list',
          title: '设备列表'
        },
        cfg: {
          isCheckable: false,
          isShowHead: true,
          isShowOperation: true,
          columns: [{
            field: 'devModel',
            text: '型号',
            width: '15%'
          }, {
            field: 'swVersion',
            text: '版本号',
            width: '15%'
          }, {
            field: 'devSN',
            text: '序列号',
            width: '20%'
          }, {
            field: 'ipaddr',
            text: 'IP地址',
            width: '15%'
          }, {
            field: 'link',
            text: '链接',
            width: '15%'
          }],
          operation: {
            text: '操作',
            width: 'auto',
            actions: [{
              icon: 'glyphicon glyphicon-search',
              doClick: this.doShowLocation
            }]
          }
        },   
        state: {
          listsLoading: true
        },     
        lists: []
      },
      inputedIpaddr: '',
      selectedDevType: 'all',
      devTypeOptions: []
    }
  },
  filters: {
    devFilter: function(lists) {
      return lists.filter(function(item, index) {
        return (this.selectedDevType === 'all' || this.selectedDevType === item.devType)
          && (this.inputedIpaddr === '' || item.ipaddr.indexOf(this.inputedIpaddr) != -1);
      }, this);
    }
  },
  methods: {
    getDdisDevById: function(id) {
      if (id <= 0) {
        return null;
      }

      var ddisDevs = this.ddis.lists;
      for (var i = 0; i < ddisDevs.length; i++) {
        if (ddisDevs[i]._id == id) {
          return ddisDevs[i];
        }
      };

      return null;
    },    
    doLoadDdisDevs: function() {
      this.ddis.state.listsLoading = true;
      this.$dispatch('get-ddisDevs');
    },
    doSearchDdisDevs: function() {
      log.showWait('Search', 3);
      serverApi.devmng.sendCmd('search', null, function(res) {
        if (res === undefined || res.code != 0) {
          log.showErrorWithRes(res);
        } else {
          setTimeout(this.doLoadDdisDevs, 3000);
        }           
      }.bind(this));
    },
    addDevLinkHome: function(ddisDev) {
      var port = 8080;
      if ((ddisDev.devType === 'encoder')
        || (ddisDev.devType === 'decoder')) {
        port = 8080;
      } else if (ddisDev.devType === 'server.media') {
        port = 6080;
      } else {
        return;
      }
      ddisDev.link = '<a href="http://' + ddisDev.ipaddr + ':' + port + '" target="_blank">Home</a>';
    },
    doShowLocation: function(id) {
      var ddisDev = this.getDdisDevById(id);
      if (ddisDev == null) {
        swal({
          title: 'Oops!',
          text: "无效设备",
          type: "error",
          showConfirmButton: true
        });          
        return;
      }
      if ((ddisDev.devType != 'encoder')
       && (ddisDev.devType != 'decoder')
       && (ddisDev.devType != 'control.stm32')) {
        swal({
          title: 'Oops!',
          text: "设备类型[" + ddisDev.devType + "]不支持",
          type: "error",
          showConfirmButton: true
        });          
        return;
      }
      var paramlist = {
        devSN: ddisDev.devSN
      };
      serverApi.devmng.sendCmd('showLocation', paramlist);
    }
  },  
  created: function() {
    this.$on('ddisDevs', function(list) {
      this.ddis.lists.splice(0, this.ddis.lists.length);
      _.each(list, function(item, index, list) {
        item._id = index;
        this.addDevLinkHome(item);
        this.ddis.lists.splice(this.ddis.lists.length, 0, item);
      }, this);
      this.ddis.state.listsLoading = false;

      var allDevTypes = _.map(list, function(item) {
        return item.devType;
      });
      allDevTypes.splice(0, 0, 'all');
      this.devTypeOptions = _.uniq(allDevTypes);  
    });
  }
}
</script>

<style>
.my-table-textarea {
  margin: 0;
}
</style>