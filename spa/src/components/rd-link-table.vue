<template>
<div class="table-responsive">
  <table class="table table-bordered">
    <thead>
      <tr><th class="text-center">ID</th><th>Link</th></tr>
    </thead>
    <tbody>
      <tr v-repeat="lists">
        <td class="text-center my-td-id">{{$index + 1}}</td>
        <td><a href={{url}} target="_blank">{{title}}</a></td>
      </tr>
    </tbody>
  </table>        
</div>
</template>

<script>
module.exports = {
  replace: true,
  props: ['lists']
}
</script>

<style>
.my-td-id {
  width: 10%
}
</style>