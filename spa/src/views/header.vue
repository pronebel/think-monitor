<template>
<div class="row header">
  <div class="col-xs-12">
    <div class="user pull-right">
      <div class="item dropdown" v-if="productCfg.product=='Codec'">
        <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown">
          <img v-attr="src:header.userImgSrc">
        </a>
        <ul class="dropdown-menu dropdown-menu-right">
          <li class="dropdown-header">Admin</li>
          <li class="divider"></li>
          <li class="link">
            <a href="javascript:;" v-on="click: onReboot">Reboot</a>
          </li>
          <li class="divider"></li>
          <li class="link">
            <a href="javascript:;" v-on='click: onReset("server")'>Reset Server Settings</a>
          </li>
          <li class="link">
            <a href="javascript:;" v-on='click: onReset("factory")'>Reset All Settings</a>
          </li>
        </ul>
      </div>
      <div class="item dropdown" v-if="false">
       <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown">
          <i class="fa fa-bell-o"></i>
        </a>
        <ul class="dropdown-menu dropdown-menu-right">
          <li class="dropdown-header">Notifications</li>
          <li class="divider"></li>
          <li>
            <a href="javascript:;">TODO</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>
</template>

<script>
var log = require('../lib/log');
var api = require('../lib/api');
var platformApi = require('../lib/platformApi');

module.exports = {
  replace: true,
  props: ['header', 'productCfg'],
  methods: {
    onReboot: function(e) {
      e && e.preventDefault();
      swal({
        title: "Are you sure?",
        text: "You need to wait for 1 minute.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, restart it!",
        closeOnConfirm: false,
        showLoaderOnConfirm: true,      
      }, 
      function() {
        api.auth.login('Platform', function(res) {
          platformApi.system.sendCmd('restart');
          if (res.code === 0) {
            platformApi.system.sendCmd('restart');
            setTimeout(function() {
              swal.close();
              //router.go('/');
              location.reload(true);
            }, 1*60*1000);
          } else {
            swal({
              title: 'Opps!',
              text: res.msg ? res.msg: 'Code:' + res.code,
              type: "error",
              showConfirmButton: true
            });            
          }          
        });
      });
    },
    getShellNameByRstType: function(type) {
      if (type === 'factory') {
        return 'factoryReset.sh';
      } else if (type === 'server') {
        return 'serverReset.sh';
      } else {
        return null;
      }
    },
    onReset: function(type) {
      var shellName = this.getShellNameByRstType(type);
      if (shellName === null) {
        log.showError('Unknown type:' + type);
        return;
      }
      swal({
        title: "Are you sure?",
        text: "The Operation Can NOT Be Restored!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, reset it!",
        closeOnConfirm: false,
        showLoaderOnConfirm: true,      
      }, 
      function() {
        api.auth.login('Platform', function(res) {
          var paramlist = {
            shName: shellName
          };
          platformApi.system.sendCmd('runShell', paramlist, function(res) {
            if ((res === undefined)
              || (res.code != 0)
              || (res.data.paramlist.result.indexOf('success') === -1)) {
              log.DEBUG_TRACE(res.data.paramlist.result);
              log.showError(res.msg ? res.msg: 'Code:' + res.code);
              return;
            }

            platformApi.system.sendCmd('restart');
            setTimeout(function() {
              swal.close();
              //router.go('/');
              location.reload(true);
            }, 1*60*1000);
          });         
        });
      });
    }
  }
}
</script>

<style>
</style>