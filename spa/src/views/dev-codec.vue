<template>
<dev-codec-common></dev-codec-common>
<dev-encoder v-if="productCfg.encoderEn"></dev-encoder>
<dev-decoder v-if="productCfg.decoderEn"></dev-decoder>
</template>

<script>
module.exports = {
  props: ['productCfg'],
  components: {
    devCodecCommon: require('./dev-codec-common.vue'),
    devEncoder: require('./dev-encoder.vue'),
    devDecoder: require('./dev-decoder.vue'),
  }
}
</script>

<style>
</style>