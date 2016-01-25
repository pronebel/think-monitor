<template>
<div class="row">
  <div class="col-md-12">
    <rd-widget>
      <rd-widget-header header={{header}}>
      </rd-widget-header>
      <rd-widget-body>
        <rd-link-table lists={{lists}}></rd-link-table>
      </rd-widget-body>
    <rd-widget>
  </div>
</div>
</template>

<script>
var api = require('../lib/api')

module.exports = {
  props: ['moduleName'],
  data: function() {
    return {
      header: {
        icon: 'fa fa-list',
        title: this.moduleName + ' Api'
      }, 
      lists: []
    }
  },
  ready: function () {
    api.utils.getSwaggers(this.moduleName, function(urlSwaggerHeader, swaggers) {
      for (var i = 0; i < swaggers.length; i++) {
        this.lists.splice(0, 0, {
          url: urlSwaggerHeader + swaggers[i].path,
          title: swaggers[i].title
        });        
      }    
    }.bind(this));
  }
}
</script>

<style>
</style>