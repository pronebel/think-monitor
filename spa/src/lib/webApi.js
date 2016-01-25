var api = require('./api');
var log = require('./log');

function WebApi(moduleName, processName, devId) {
  this.moduleName = moduleName;
  this.processName = processName;
  this.devId = devId;
  this.paths = {};

  this.initPaths = function() {
    var pathPrefix = (this.moduleName === 'Server') 
      ? '/devs/' + this.devId + '/' + this.processName 
      : '/dev/' + this.processName;

    this.paths.cfg = pathPrefix + '/cfg';
    this.paths.state = pathPrefix + '/state';
    this.paths.cmd = pathPrefix + '/cmd';
    this.paths.items = pathPrefix + '/items';
  };
  this.initPaths();

  this.setDevId = function(devId) {
    this.devId = devId;
    this.initPaths();
  };

  this.getCfg = function(cb) {
    api.getCfg(this.moduleName, this.paths.cfg, cb);
  };

  this.setCfg = function(req, cb) {
    api.setCfg(this.moduleName, this.paths.cfg, req, cb);
  };

  this.getState = function(cb) {
    api.getState(this.moduleName, this.paths.state, cb);
  };

  this.sendCmd = function(action, paramlist, cb) {
    //log.DEBUG_TRACE(JSON.stringify(paramlist));
    api.sendCmd(this.moduleName, this.paths.cmd, action, paramlist, cb);
  };

  this.getItems = function(listname, cb) {
    api.getItems(this.moduleName, this.paths.items, listname, cb);
  };

  this.getItem = function(listname, id, cb) {
    api.getItem(this.moduleName, this.paths.items, listname, id, cb);
  };

  this.delItem = function(listname, id, cb) {
    api.delItem(this.moduleName, this.paths.items, listname, id, cb);
  };

  this.setItem = function(listname, req, cb) {
    api.setItem(this.moduleName, this.paths.items, listname, req, cb);
  };
}

module.exports = WebApi;