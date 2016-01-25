module.exports = [{
  text: '授权人',
  field: 'licensor',
  value: ''
}, {
  text: '授权时间',
  field: 'authTime',
  value: ''
}, {
  text: '项目编号',
  field: 'projectNo',
  value: ''
}, {
  text: '项目描述',
  field: 'projectDesc',
  value: ''
}, {
  text: '最大UI连接数',
  field: 'maxUIConnections',
  value: 0,
  show: function(value) {
    return value < 0 ? '无效' : value;
  }
}, {
  text: '最大拼接屏数',
  field: 'maxDecOfLcdWall',
  value: 0,
  show: function(value) {
    return value < 0 ? '无效' : value;
  }
}, {
  text: '最大IPC路数',
  field: 'maxListCntOfIpc',
  value: 1,
  show: function(value) {
    return value < 0 ? '无效' : value;
  }
}, {
  text: '最大录播通道数',
  field: 'maxRecordChannel',
  value: 1,
  show: function(value) {
    return value < 0 ? '无效' : value;
  }
}, {
  text: '最大点播通道数',
  field: 'maxPlayChannel',
  value: 1,
  show: function(value) {
    return value < 0 ? '无效' : value;
  }
}, {
  text: '最大软编路数',
  field: 'maxListCntOfSoftEnc',
  value: 1,
  show: function(value) {
    return value < 0 ? '无效' : value;
  }
}, {
  text: '最大转发路数',
  field: 'maxListCntOfProxy',
  value: 1,
  show: function(value) {
    return value < 0 ? '无效' : value;
  }
}, {
  text: '试用开始时间',
  field: 'trialBeginTime',
  value: '',
  show: function(value) {
    return value === '' ? '无限制' : value;
  }
}, {
  text: '试用结束时间',
  field: 'trialEndTime',
  value: '',
  show: function(value) {
    return value === '' ? '无限制' : value;
  }
}]