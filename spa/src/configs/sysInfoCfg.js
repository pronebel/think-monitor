var productCfg = require('../lib/settings').productCfg;

var codecInfoCfg = [{
  text: '物理地址',
  field: 'macaddr',
  value: ''
}, {
  text: '序列号',
  field: 'devSN',
  value: ''
}, {
  text: '设备型号',
  field: 'devModel',
  value: ''
}, {
  text: '软件版本号',
  field: 'softwareVersion',
  value: ''
}, {
  text: '硬件版本号',
  field: 'hardwareVersion',
  value: ''
}, {
  text: '根分区版本',
  field: 'ti816xVersion',
  value: ''
}, {
  text: '配置区版本',
  field: 'configVersion',
  value: ''
}, {
  text: '用户区版本',
  field: 'userdataVersion',
  value: ''
}];

var mediaInfo = [{
  text: '序列号',
  field: 'devSN',
  value: ''
}, {
  text: '设备型号',
  field: 'devModel',
  value: ''
}, {
  text: '软件版本号',
  field: 'softwareVersion',
  value: ''
}, {
  text: '编译时间',
  field: 'buildDate',
  value: ''
}];

function getInfoCfg() {
  if (productCfg.product === 'Media') {
    return mediaInfo;
  } else if (productCfg.product === 'Codec') {
    return codecInfoCfg;
  } else {
    return [];
  }
}

module.exports = getInfoCfg();