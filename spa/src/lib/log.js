
var globalCfg = require('./settings').globalCfg;

function trace(type, str) {
  console.log.call(console, "[" + type + "]" + str);
}

function testTrace(str) {
  trace("TEST", str);
}

function debugTrace(str) {
  trace("DEBUG", str);
}

function infoTrace(str) {
  trace("INFO", str);
}

function errorTrace(str) {
  trace("ERROR", str);
}

var TEST_TRACE = globalCfg.TEST_TRACE_ON ? testTrace : function() {};
var DEBUG_TRACE = globalCfg.DEBUG_TRACE_ON ? debugTrace : function() {};
var INFO_TRACE = globalCfg.INFO_TRACE_ON ? infoTrace : function() {};
var ERROR_TRACE = globalCfg.ERROR_TRACE_ON ? errorTrace : function() {};

exports.TEST_TRACE = TEST_TRACE;
exports.DEBUG_TRACE = DEBUG_TRACE;
exports.INFO_TRACE = INFO_TRACE;
exports.ERROR_TRACE = ERROR_TRACE;

function showSuccess(text) {
  swal({
    title: 'Success',
    text: text,
    type: "success",
    showConfirmButton: true
  });
}
exports.showSuccess = showSuccess;

function showError(text) {
  swal({
    title: 'Opps!',
    text: text,
    type: "error",
    showConfirmButton: true
  });  
}
exports.showError = showError;

function showErrorWithRes(res) {
  var text = '';
  if (res === undefined) {
    text = 'Unknown Error'
  } else {
    text = res.msg ? res.msg: 'Error Code:' + res.code;
  }
  showError(text);
}
exports.showErrorWithRes = showErrorWithRes;

function showWait(action, waitSec) {
  swal({
    title: action + ' ...',
    text: 'Please Wait',
    type: "info",
    timer: waitSec * 1000,
    showConfirmButton: false
  });
}
exports.showWait = showWait;