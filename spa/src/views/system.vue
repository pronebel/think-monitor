<template>
<system-codec v-if="productCfg.product=='Codec'"></system-codec>
<system-media v-if="productCfg.product=='Media'"></system-media>
</template>

<script>
module.exports = {
  props: ['productCfg'],
  components: {
    systemCodec: require('./system-codec.vue'),
    systemMedia: require('./system-media.vue'),
  }
}
</script>

<style>
</style>