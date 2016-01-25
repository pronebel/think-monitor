<template>
<div class="table-responsive">
  <table class="table table-hover my-table">
    <thead v-if="cfg.isShowHead">
      <tr>
        <th v-if="cfg.isCheckable" class="my-table-cb-td">
          <input type="checkbox" v-model="allChecked" true-exp=1 false-exp=0 />
        </th>
        <th v-repeat="column in cfg.columns" v-style="width:column.width" class="my-table-th">{{column.text}}</th>
        <th v-if="cfg.isShowOperation" v-style="width:cfg.operation.width" class="my-table-th">{{cfg.operation.text}}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-show="isShowLoading">
        <td colspan="{{cfg.columns.length + cfg.isShowOperation}}" class="my-table-empty">
          <i class="fa fa-spinner fa-pulse fa-3x"></i>
        </td>
      </tr>
      <tr v-show="listLength" v-repeat="item in lists">
        <td v-if="cfg.isCheckable" class="my-table-cb-td">
          <input type="checkbox" v-model="item._checked" true-exp=1 false-exp=0 />
        </td>
        <td v-repeat="column in cfg.columns" class="my-table-td">
          {{{item[column.field]}}}
        </td>
        <td v-if="cfg.isShowOperation" class="my-table-td">
          <div class="btn-group btn-group-sm" role="group">
            <a class="btn btn-default" href="javascript:;" v-repeat="action in cfg.operation.actions" v-on="click:action.doClick(item._id)">
              <i class="{{action.icon}}"></i>
            </a>
          </div>
        </td>
      </tr>
    </tbody>
  </table>        
</div>
</template>

<script>
var _ = require('underscore');

module.exports = {
  replace: true,
  props: ['cfg', 'lists', 'state'],
  data: function() {
    return {
      allChecked: 0
    }
  },
  computed: {
    isShowLoading: function() {
      return this.state && this.state.listsLoading && !this.lists.length;
    },
    listLength: function() {
      return _.size(this.lists);
    }
  },
  watch: {
    'allChecked': function(newVal, oldVal) {
      _.each(this.lists, function(item, index, list) {
        item._checked = newVal;
      }, this);
    }
  }
}
</script>

<style>
.my-table {
}
.my-table-th {
  position: relative;
  text-align: center;
}
.my-table-td {
  text-align: center;
}
.my-table-empty {
  text-align: center;
}
.my-table-cb-td {
  width: 50px;
  text-align: center;
}
</style>