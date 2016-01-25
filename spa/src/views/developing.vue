<template>
<div class="row">
  <div class="col-md-12">
    <rd-widget>
      <rd-widget-header header={{header}}>
        <a href="http://tobiasahlin.com/spinkit/" target="_blank">SpinKit</a>
      </rd-widget-header>
      <rd-widget-body>
        <h1>开发中...</h1>
      </rd-widget-body>
      <rd-widget-footer>
        <small>footer</small>
      </rd-widget-footer>
    </rd-widget>
  </div>
</div>
</template>

<script>
module.exports = {
  data: function() {
    return {
      header: {
        icon: 'fa fa-cog fa-spin',
        title: 'Loading Directive'
      }
    }
  }
}
</script>

<style>
</style>