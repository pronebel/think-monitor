var http = require('./xhr');
var log = require('./log');
var utils = require('./utils');
var settings = require('./settings');
var _ = require('underscore');

var hostname = settings.hostname;
var productCfg = settings.productCfg;
var hostCfgs = productCfg.hostCfgs;

function menusFilter(menus, modules) {
  log.DEBUG_TRACE('modules of menusFilter:' + modules);
  var result = menus.filter(function(item, index, array) {
    if ((item.product === '*') || (item.product === productCfg.product)) {
      if ((item.filterBy === '*') || (_.contains(modules, item.filterBy))) {
        return true;
      } else if ((item.filterBy === 'Debug') && (settings.isInDebugMode)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  });
  return result;
}
exports.menusFilter = menusFilter;

function getModuleNames() {
  return _.map(hostCfgs, function(item, index, list) {
    return item.moduleName;
  })
}
exports.getModuleNames = getModuleNames;

//exports.http = http;

function getHostCfg(moduleName) {
  for (var i = 0; i < hostCfgs.length; i++) {
    if (hostCfgs[i].moduleName === moduleName) {
      return hostCfgs[i];
    }
  }
  return null;
}

function getHttpHost(moduleName) {
  var hostCfg = getHostCfg(moduleName);
  if (!hostCfg) {
    return null;
  }
  return 'http://' + hostCfg.host;
}
exports.getHttpHost = getHttpHost;

function getWsHost(moduleName) {
  var hostCfg = getHostCfg(moduleName);
  if (!hostCfg) {
    return null;
  }
  return 'ws://' + hostCfg.host;
}
exports.getWsHost = getWsHost;

//support Platform:192.168.1.245
function makeHttpUrl(moduleName, path) {
  var a = moduleName.split(':');
  var hostCfg = getHostCfg(a[0]);
  if (!hostCfg) {
    log.ERROR_TRACE('[ERR]' + 'Can\'t find ' + a[0]);
    return null;
  }

  var host = hostCfg.host;
  if (a.length >= 2) {
    host = a[1] + ':' + hostCfg.port;
  }

  if (typeof(path) === 'function') {
    return path('http://' + host);
  } else {
    return 'http://' + host + path;
  }
}
exports.makeHttpUrl = makeHttpUrl;

function getCfg(moduleName, path, cb) {
  http.get(makeHttpUrl(moduleName, path), function(res) {
    cb && cb(res);
  });
}
exports.getCfg = getCfg;

function setCfg(moduleName, path, req, cb) {
  http.put(makeHttpUrl(moduleName, path), req, function(res) {
    cb && cb(res);
  });
}
exports.setCfg = setCfg;

function getState(moduleName, path, cb) {
  http.get(makeHttpUrl(moduleName, path), function(res) {
    cb && cb(res);
  });
}
exports.getState = getState;

function sendCmd(moduleName, path, action, paramlist, cb) {
  var req = {
    action: action
  };
  if (paramlist) {
    req.paramlist = paramlist;
  }
  http.post(makeHttpUrl(moduleName, path), req, function(res) {
    cb && cb(res);
  });
}
exports.sendCmd = sendCmd;

function getItems(moduleName, path, listname, cb) {
  http.get(makeHttpUrl(moduleName, path + '?listName=' + listname), function(res) {
    cb && cb(res);
  });
}
exports.getItems = getItems;

function getItem(moduleName, path, listname, id, cb) {
  http.get(makeHttpUrl(moduleName, path + '?listName=' + listname + '&_id=' + id), function(res) {
    cb && cb(res);
  });
}
exports.getItem = getItem;

function delItem(moduleName, path, listname, id, cb) {
  http.del(makeHttpUrl(moduleName, path + '?listName=' + listname + '&_id=' + id), function(res) {
    cb && cb(res);
  });
}
exports.delItem = delItem;

function setItem(moduleName, path, listname, req, cb) {
  http.put(makeHttpUrl(moduleName, path + '?listName=' + listname), req, function(res) {
    cb && cb(res);
  });
}
exports.setItem = setItem;

function authLogin(moduleName, cb) {
  var hostCfg = getHostCfg(moduleName);
  if (hostCfg) {
    var urlLogin = 'http://' + hostCfg.host + '/api/auth/login';
    var authData = {
      username: 'api',
      password: 'api'
    };

    http.post(urlLogin, authData, cb);
  } else {
    log.ERROR_TRACE('Unknown ' + moduleName);
    cb && cb();
  }
}

var currModule = '*';

function switchModule(newModule, cb) {
  var doSwitchModule = function() {
    currModule = newModule;
    cb && cb();
  };
  if ((currModule != newModule) && (newModule != '*')) {
    timeout = setTimeout(doSwitchModule, 2000);
    authLogin(newModule, function(res) {
      if (res) {
        if (res.code == 0 || res.code == -4) {
          log.DEBUG_TRACE('authLogin with ' + newModule + ' success');
          clearTimeout(timeout);
          doSwitchModule();
        }
      }
    });
  } else {
    doSwitchModule();
  }
}
exports.switchModule = switchModule;

exports.auth = {
  login: authLogin
};

exports.storage = {
  getFile: function(moduleName, type, path, cb) {
    http.get(makeHttpUrl(moduleName, '/api/storage/file?type=' + type + '&path=' + path), function(res) {
      cb && cb(res);
    })
  },
  uploadFile: function(moduleName, type, path, data, success, error, onprogress) {
    var options = {
      headers: {
        'Content-Type': 'application/octet-stream'
      },
      keepData: true,
      onprogress: onprogress,
      onerror: error
    };
    http.put(makeHttpUrl(moduleName, '/api/storage/file?type=' + type + '&path=' + path), data, function(res) {
      if (res && res.code == 0) {
        success && success(res);
      } else {
        error && error(res);
      }
    }, options)
  }
};

exports.utils = {
  getSwaggers: function(moduleName, cb) {
    http.get(makeHttpUrl(moduleName, '/api/swagger'), function(res) {
      cb && cb(makeHttpUrl(moduleName, function(host) {
        return host + '/swagger/index.html?url=' + host + '/www/api/';
      }), res);
    });
  },
  getPlatformCfg: function(cb) {
    http.get(makeHttpUrl(productCfg.dftModule, '/api/platform/cfg'), function(res) {
      cb && cb(res);
    });
  }
};