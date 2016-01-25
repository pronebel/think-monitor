<template>
<div class="col-md-6">
  <div v-el="cpu"></div>
</div>
<div class="col-md-6">
  <div v-el="ram"></div>
</div>
<div class="col-md-6">
  <div v-el="disk"></div>
</div>
</template>

<script>
var platformApi = require('../lib/platformApi');
var log = require('../lib/log');
var utils = require('../lib/utils');

module.exports = {
  data: function() {
    return {
      cpuInfo: {
        result: {}
      },
      ramInfo: {
        result: {}
      },
      diskInfo: {
        result: [],
        resultStr: ''
      }
    }
  },
  watch: {
    'cpuInfo.result': function(newVal, oldVal) {
      if (this.cpuInfo.chart) {
        var x = (new Date()).getTime();
        var y = newVal.cpu;
        if (this.cpuInfo.chart.series[0].data.length < 15) {
          for (var i = -15; i < 0; i++) {
            var tempX = x + (3000 * i);
            var tempY = y + (Math.random() - 0.5) * 2;
            this.cpuInfo.chart.series[0].addPoint([tempX, tempY], true, false);
          };
        }
        this.cpuInfo.chart.series[0].addPoint([x, y], true, true);
      }
    },
    'ramInfo.result': function(newVal, oldVal) {
      if (this.ramInfo.chart) {
        var x = (new Date()).getTime();
        var y = newVal.used;
        if (this.ramInfo.chart.series[0].data.length < 15) {
          for (var i = -15; i < 0; i++) {
            var tempX = x + (3000 * i);
            var tempY = y + (Math.random() - 0.5) * 10;
            this.ramInfo.chart.series[0].addPoint([tempX, tempY], true, false);
          };
        }
        this.ramInfo.chart.series[0].addPoint([x, y], true, true);
      }
    },
    'diskInfo.resultStr': function(newVal, oldVal) {
      log.DEBUG_TRACE(newVal);
    },
    'diskInfo.result': function(newVal, oldVal) {
      if (this.diskInfo.chart) {
        var data = [];
        _.each(newVal, function(item, index, list) {
          var showText = null;
          if (item.mounted === '/opt/config') {
            showText = '用户参数区';
          } else if (item.mounted === '/opt/user_data') {
            showText = '用户数据区';
          } else {
            return;
          }

          data.splice(0, 0, {
            name: showText + '(已用)',
            y: parseInt(item.used)
          });
          data.splice(0, 0, {
            name: showText + '(空闲)',
            y: parseInt(item.avail)
          });
        });
        //log.DEBUG_TRACE(data.length);
        this.diskInfo.chart.series[0].setData(data, true);
      }
    }
  },
  methods: {
    getCmdShellResult: function(obj, shName) {
      var paramlist = {
        shName: shName
      };
      platformApi.system.sendCmd('runShell', paramlist, function(res) {
        if (res && res.code == 0) {
          //log.DEBUG_TRACE(res.data.paramlist.result);
          obj.resultStr = res.data.paramlist.result;
          obj.result = JSON.parse(res.data.paramlist.result);
        }
      });        
    },
    getCpuInfo: function() {
      this.getCmdShellResult(this.cpuInfo, 'top.sh');
    },
    getRamInfo: function() {
      this.getCmdShellResult(this.ramInfo, 'ram.sh');
    },
    getDiskInfo: function() {
      this.getCmdShellResult(this.diskInfo, 'disk.sh');
    },
    getProcessInfo: function() {
      this.getCmdShellResult(this.processInfo, 'process.sh');
    },
    stopDrawCpuInfo: function() {
      var cpuInfo = this.cpuInfo;
      if (cpuInfo.timer) {
        clearInterval(cpuInfo.timer);
        cpuInfo.timer = undefined;
      }
      if (cpuInfo.chart) {
        cpuInfo.chart.destroy();
      }
    },
    startDrawCpuInfo: function(container) {
      var cpuInfo = this.cpuInfo;
      cpuInfo.chart = new Highcharts.Chart({
        chart: {
          type: 'spline',
          animation: Highcharts.svg, // don't animate in old IE
          marginRight: 10,
          renderTo: container
        },
        title: {
          text: 'CPU占用率'
        },
        credits: {
          enabled: false
        },
        xAxis: {
          type: 'datetime',
          tickPixelInterval: 100
        },
        yAxis: {
          title: {
            text: '单位：%'
          },
          plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
          }],
          min: 0,
          max: 100
        },
        tooltip: {
          formatter: function() {
            return Highcharts.dateFormat('%H:%M:%S', this.x) + '<br/>' +
              this.series.name + ': ' + Highcharts.numberFormat(this.y, 2) + '%';
          }
        },
        legend: {
          enabled: false
        },
        exporting: {
          enabled: false
        },
        series: [{
          name: '占用率',
          data: []
        }]
      });
      //this.getCpuInfo();
      cpuInfo.timer = setInterval(this.getCpuInfo, 3000);
    },    
    stopDrawRamInfo: function() {
      var ramInfo = this.ramInfo;
      if (ramInfo.timer) {
        clearInterval(ramInfo.timer);
        ramInfo.timer = undefined;
      }
      if (ramInfo.chart) {
        ramInfo.chart.destroy();
      }
    },
    startDrawRamInfo: function(container) {
      var ramInfo = this.ramInfo;
      ramInfo.chart = new Highcharts.Chart({
        chart: {
          type: 'spline',
          animation: Highcharts.svg, // don't animate in old IE
          marginRight: 10,
          renderTo: container
        },
        title: {
          text: '内存信息（总量：485M）'
        },
        credits: {
          enabled: false
        },
        xAxis: {
          type: 'datetime',
          tickPixelInterval: 100
        },
        yAxis: {
          title: {
            text: '单位：KB'
          },
          plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
          }]
        },
        tooltip: {
          formatter: function() {
            return Highcharts.dateFormat('%H:%M:%S', this.x) + '<br/>' +
              this.series.name + ': ' + Highcharts.numberFormat(this.y, 0) + 'KB' + '<br/>' +
              '占用率' + ': ' + Highcharts.numberFormat(this.y/4972.84, 2) + '%';
          }
        },
        legend: {
          enabled: false
        },
        exporting: {
          enabled: false
        },
        series: [{
          name: '已用',
          data: []
        }]
      });
      //this.getRamInfo();
      ramInfo.timer = setInterval(this.getRamInfo, 3000);
    },
    stopDrawDiskInfo: function() {
      var diskInfo = this.diskInfo;
      if (diskInfo.chart) {
        diskInfo.chart.destroy();
      }
    },
    startDrawDiskInfo: function(container) {
      var diskInfo = this.diskInfo;
      diskInfo.chart = new Highcharts.Chart({
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie',   
          renderTo: container
        },
        title: {
          text: '存储信息'
        },
        credits: {
          enabled: false
        },
        tooltip: {
          formatter: function() {
            return this.point.name + ':' + utils.readableSize(this.y * 1024);
          }
          //pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: false
            },
            showInLegend: true
          }
        },
        series: [{
          name: '存储信息',
          colorByPoint: true,
          data: []
        }]        
      });    
      this.getDiskInfo();
    },
    stopDrawProcessInfo: function() {

    },
    startDrawProcessInfo: function() {
      this.getProcessInfo();
    }
  },
  ready: function() {
    Highcharts.setOptions({
      global: {
        useUTC: false
      }
    });
    this.startDrawCpuInfo(this.$$.cpu);
    this.startDrawRamInfo(this.$$.ram);
    this.startDrawDiskInfo(this.$$.disk);
    //this.startDrawProcessInfo();
  },
  beforeDestroy: function() {
    this.stopDrawCpuInfo();
    this.stopDrawRamInfo();
    this.stopDrawDiskInfo();
  }
}
</script>

<style>
</style>