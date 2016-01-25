<template>
<my-vp-in-state state="{{ state}}"></my-vp-in-state>
<hr />
<my-vp-color params="{{@ params.colorParam}}" do-save="{{doSaveColorParam}}"></my-vp-color>
</template>

<script>
var log = require('../lib/log');

module.exports = {
  replace: true,
  props: ['index', 'params', 'state', 'doSaveReq'],
  components: {
    myVpColor: require('./my-vp-color.vue'),
    myVpInState: require('./my-vp-in-state.vue'),
  },
  methods: {
    doSaveColorParam: function() {
      var req = {
        vpIn: {}
      };
      req.vpIn[this.index] = this.params;
      this.doSaveReq(req);
    }
  }
}
</script>

<style>
</style>