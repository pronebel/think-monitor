var utils = require('./utils');

var HOST_NAME_FOR_DEBUG = '192.168.20.197'
var HOST_PRODUCT_FOR_DEBUG = 'Codec'
//var HOST_NAME_FOR_DEBUG = '192.168.1.225'
//var HOST_PRODUCT_FOR_DEBUG = 'Media'

var debugCfg = {
  TEST_TRACE_ON: false,
  DEBUG_TRACE_ON: true,
  INFO_TRACE_ON: true,
  ERROR_TRACE_ON: true
};

var releaseCfg = {
  TEST_TRACE_ON: false,
  DEBUG_TRACE_ON: false,
  INFO_TRACE_ON: false,
  ERROR_TRACE_ON: true
};

function getHostName() {
  if (isInDebugMode) {
    var args = utils.getQueryStringArgs();
    if (args && args['hostname']) {
      console.log('hostname: ' + args['hostname']);
      return args['hostname'];
    } else {
      return HOST_NAME_FOR_DEBUG;
    }
  } else {
    return window.location.hostname;
  }
}

function getRealProduct() {
  var port = window.location.port;
  if (port === '8080' || port == '7080' || port == '9080') {
    return 'Codec';
  } else if (port == '6080') {
    return 'Media';
  } else {
    return null;
  }
}

function getProduct() {
  var product = getRealProduct();
  return null != product ? product : HOST_PRODUCT_FOR_DEBUG;
}

function checkInDebugMode() {
  var product = getRealProduct();
  return null != product ? false : true;
}

var isInDebugMode = checkInDebugMode();
var hostname = getHostName();

exports.isInDebugMode = isInDebugMode;

exports.globalCfg = isInDebugMode ? debugCfg : releaseCfg;

exports.hostname = hostname;

function getProductCfg() {
  var cfgs = [{
    product: 'Codec',
    dftModule: 'Platform',
    hostCfgs: [{
      moduleName: 'Platform',
      port: '8080',
      host: hostname + ':8080'
    }, {
      moduleName: 'Codec',
      port: '7080',
      host: hostname + ':7080'
    }, {
      moduleName: 'Server',
      port: '9080',
      host: hostname + ':9080'
    }]
  }, {
    product: 'Media',
    dftModule: 'MediaServer',
    hostCfgs: [{
      moduleName: 'MediaServer',
      port: '6080',
      host: hostname + ':6080'
    }]
  }];
  var product = getProduct();

  for (var i = 0; i < cfgs.length; i++) {
    if (cfgs[i].product === product) {
      return cfgs[i];
    }
  };

  return cfgs[0];
}
var productCfg = getProductCfg();
exports.productCfg = productCfg;