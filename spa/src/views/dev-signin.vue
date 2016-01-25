<template>
<vs-modal show="{{@ showSignin}}" effect="fade" width="400">
  <div class="modal-header">
    <h4 class="modal-title">请登陆</h4>
  </div>  
  <div class="modal-body">
    <my-signin do-signin="{{doSignin}}"></my-signin>
  </div>
  <div class="modal-footer">
  </div>    
</vs-modal>
</template>

<script>
var log = require('../lib/log');
var MD5 = require('../lib/crypto').MD5;

module.exports = {
  components: {
    mySignin: require('../components/my-signin.vue')
  },
  data: function() {
    return {
      showSignin: false
    }
  },
  methods: {
    isValidAuthInfo: function(authInfo) {
      if (authInfo.username != 'admin') {
        return false;
      }
      var md5OfPassword =    'b307cd02bfc45735892e0c3d0b218c8b';// MD5(authInfo.password).toLowerCase();
      if (md5OfPassword != 'b307cd02bfc45735892e0c3d0b218c8b') {
        return false;
      }
      return true;
    },
    doSignin: function(authInfo) {
      if (!this.isValidAuthInfo(authInfo)) {
        log.showError('Auth Error');
      } else {
        this.showSignin = false;
        this.$route.authState.signin = true;
        var router = this.$route.router;
        router.go('/');
      }
    }
  },
  ready: function() {
    this.showSignin = true;
  }
}
</script>

<style>
</style>