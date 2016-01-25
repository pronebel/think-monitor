<template>
<ms-ddis-devs></ms-ddis-devs>
</template>

<script>
var serverApi = require('../lib/serverApi');
var log = require('../lib/log');

module.exports = {
  props: ['productCfg'],
  components: {
    msDdisDevs: require('./ms-ddis-devs.vue'),
  },
  methods: {
    doLoadTopoDevs: function() {
      serverApi.devmng.getItems('topoDevsSummary', function(res) {
        if (res && res.code == 0) {
          this.$broadcast('topoDevsSummary', res.data.topoDevsSummary);
        }
      }.bind(this));
    },
    doLoadDdisDevs: function() {
      serverApi.devmng.getItems('ddisDevs', function(res) {
        if (res && res.code == 0) {
          this.$broadcast('ddisDevs', res.data.ddisDevs);
        }
      }.bind(this));
    }
  },
  created: function() {
    this.$on('get-topoDevsSummary', function() {
      this.doLoadTopoDevs();
    });
    this.$on('get-ddisDevs', function() {
      this.doLoadDdisDevs();
    });
  },
  ready: function() {
    this.doLoadTopoDevs();
    this.doLoadDdisDevs();
  }
}
</script>

<style>
</style>