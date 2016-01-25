<template>
<div class="row">
  <my-stream ws-url={{srcWsUrl}}></my-stream>
</div>
</template>

<script>
var api = require('../lib/api')

module.exports = {
  components: {
    myStream: require('./my-stream.vue')
  },
  computed: {
    srcWsUrl: function() {
      return api.getWsHost("Codec") + "/wsstream/preview";
      //return api.getWsHost("Server") + "/wsstream/file"
    }
  }
}
</script>

<style>
</style>