<template>
<div class="table-responsive">
  <table class="table table-bordered">
    <tbody>
      <tr v-repeat="list in lists">
        <td style="width:40%">{{list.text}}</td>
        <td>{{list | showValue}}</td>
      </tr>
    </tbody>
  </table>        
</div>
</template>

<script>
module.exports = {
  replace: true,
  props: ['lists'],
  filters: {
    showValue: function(list) {
      if (list.show) {
        return list.show(list.value);
      } else {
        return list.value;
      }
    }
  }
}
</script>

<style>
</style>