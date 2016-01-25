<template>
<div id="sidebar-wrapper">
  <ul class="sidebar">
    <li class="sidebar-main">
      <a class="my-sidebar-toggle" v-on="click: toggle = !toggle">
        {{sidebar.header.title}}
        <span class="menu-icon glyphicon glyphicon-transfer"></span>
      </a>
    </li>
    <li class="sidebar-title"><span>{{sidebar.header.name}}</span></li>
    <li v-repeat="sidebar.menus | menusFilter modules" class="sidebar-list">
      <a v-link="{ path: url }">
        {{name}}<span class="{{icon}}"></span>
      </a>
    </li>
  </ul>
  <div class="sidebar-footer">
    <div v-repeat="sidebar.footers" class="col-xs-4">
      <a href="{{url}}" target="_blank">{{name}}</a>
    </div>
  </div>  
</div>
</template>

<script>
var api = require('../lib/api')

module.exports = {
  replace: true,
  props: ['sidebar', 'toggle', 'modules'],
  filters: {
    menusFilter: api.menusFilter
  }
}
</script>

<style>
.my-sidebar-toggle {
  cursor: pointer;
}
</style>