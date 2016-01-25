<template>
<ms-ipcam></ms-ipcam>
<ms-softenc></ms-softenc>
</template>

<script>
module.exports = {
  props: ['productCfg'],
  components: {
    msIpcam: require('./ms-ipcam.vue'),
    msSoftenc: require('./ms-softenc.vue'),
  }
}
</script>

<style>
</style>