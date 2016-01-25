<template>
<div class="row">  
  <div class="col-md-12">
    <rd-widget>
      <rd-widget-header header="{{* vpOutSubtitleInfo.header}}">
      </rd-widget-header>
      <rd-widget-body>    
        <my-vid-subtitle list-name="subtitleListOfVpOut"></my-vid-subtitle>
      </rd-widget-body>
    <rd-widget>
  </div>  
</div>
</template>

<script>
var utils = require('../lib/utils');
var log = require('../lib/log');
var devCodecApi = require('../lib/devCodecApi');

module.exports = {
  components: {
    myVidSubtitle: require('./my-vid-subtitle.vue')
  },
  data: function() {
    return {
      vpOutSubtitleInfo: {
        header: {
          icon: 'fa fa-list',
          title: '输出字幕'
        },
      }
    }
  }
}
</script>

<style>
</style>