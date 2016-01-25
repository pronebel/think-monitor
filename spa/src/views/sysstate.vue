<template>
<div class="row">
  <sys-state-codec v-if="productCfg.product=='Codec'"></sys-state-codec>
</div>
</template>

<script>
module.exports = {
  props: ['productCfg'],
  components: {
    sysStateCodec: require('./sys-state-codec.vue')
  }
}
</script>

<style>
</style>