<template>
<div class="widget-header">
  <i class="{{header.icon}}"></i>{{header.title}} 
  <div class="pull-right">
    <content></content>
  </div>
</div>
</template>

<script>
module.exports = {
  replace: true,
  props: ['header']
}
</script>

<style>
</style>