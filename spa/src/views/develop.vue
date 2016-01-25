<template>
<div v-repeat="moduleName in moduleNames">
  <my-swaggers module-name="{{moduleName}}"></my-swaggers>
</div>
</template>

<script>
var api = require('../lib/api')

module.exports = {
  replace: true,
  components: {
    mySwaggers: require('./my-swaggers.vue')
  },
  data: function() {
    return {
      moduleNames: api.getModuleNames()
    }
  }
}
</script>

<style>
</style>