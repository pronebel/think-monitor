<template>
<form class="form-signin" action="#" v-on="submit: onSubmit">
  <input type="text" class="form-control" placeholder="用户名" v-model="authInfo.username" required autofocus>
  <input type="password" class="form-control" placeholder="密码" v-model="authInfo.password" required>
  <div class="checkbox" v-show="false">
    <label>
      <input type="checkbox" value="remember-me"> 记住我
    </label>
  </div>  
  <button class="btn btn-lg btn-primary btn-block" type="submit">登陆</button>
</form>
</template>

<script>
var log = require('../lib/log');

module.exports = {
  replace: true,
  props: ['doSignin'],
  data: function() {
    return {
      authInfo: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    onSubmit: function(e) {
      e && e.preventDefault();
      if (this.authInfo.username != '' 
        && this.authInfo.password != '') {
        this.doSignin(this.authInfo);
      } else {
        log.ERROR_TRACE('Invalid authInfo');
      }
    }
  }
}
</script>

<style>
.form-signin {
  max-width: 330px;
  padding: 15px;
  margin: 0 auto;
}
.form-signin .form-signin-heading,
.form-signin .checkbox {
  margin-bottom: 10px;
}
.form-signin .checkbox {
  font-weight: normal;
}
.form-signin .form-control {
  position: relative;
  height: auto;
  -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
          box-sizing: border-box;
  padding: 10px;
  font-size: 16px;
}
.form-signin .form-control:focus {
  z-index: 2;
}
.form-signin input[type="text"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>