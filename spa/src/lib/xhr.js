
var log = require('./log');
var _ = require('underscore');

var defaults = {};

function request(url, options) {
  var req = new XMLHttpRequest();
  req.error = function(cb) {
    options.error = cb;
  };

  var method = options.method || 'GET';
  var data = options.data;
  if (method === 'GET' && data) {
    url += '?' + Object.keys(data).filter(function(k){
      return k && data[k];
    }).map(function(k) {
      return k + '=' + data[k];
    }).join('&');
    data = null;
  }
  req.url = url;

  //added by hw
  if ('withCredentials' in req) {
    req.withCredentials = true;
    req.open(method, url, true);
  } else if (typeof XDomainRequest != 'undefined') {
    vxhr = new XDomainRequest();
    req.open(method, url);
  } else {
    req.open(method, url);
  }

  //log.DEBUG_TRACE(method + ':' + url);

  if (options.onload) {
    req.onload = options.onload.bind(this);
  }
  if (options.onerror) {
    req.onerror = options.onerror.bind(this);
  }
  if (options.onprogress) {
    req.upload.onprogress = options.onprogress.bind(this);
  }

  var startTime = new Date().getTime();

  if (data && options.keepData != true) {
    data = JSON.stringify(data);
  }

  if (options.headers) {
    _.each(options.headers, function(value, key) {
      req.setRequestHeader(key, value);
    });
  } else if (data instanceof FormData) {

  } else {
    req.setRequestHeader("Content-Type", "application/json");
  }

  req.onreadystatechange = function(){
    if (4 === req.readyState) {
      var duration = new Date().getTime() - startTime;
      req.data = parseResponse(req.responseText);
      if (options.afterRequest) {
        options.afterRequest(req, duration);
      }
      var type = req.status / 100 | 0;
      if (2 === type) {
        options.success && options.success(req.data, req);
      } else {
        options.error && options.error(req.data, req);
      }
    }
  };

  if (options.beforeRequest) {
    options.beforeRequest(req);
  }

  if (data) {
    req.send(data);
  } else {
    req.send();
  }

  return req;
}

function parseResponse(text) {
  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }
}

function extend(a, b) {
  Object.keys(b).forEach(function(k) {
    if (!a[k]) {
      a[k] = b[k];
    }
  });
  return a;
}

function parseParams(method, data, success, options) {
  if (typeof data === 'function') {
    options = success;
    success = data;
    data = null;
  }
  options = extend({method: method, data: data, success: success}, options || {});
  return extend(options, defaults);
}

exports.defaults = defaults;

exports.http = request;

exports.get = function(url, data, success, options) {
  return request(url, parseParams('GET', data, success, options));
};

exports.post = function(url, data, success, options) {
  return request(url, parseParams('POST', data, success, options));
};

exports.del = function(url, data, success, options) {
  return request(url, parseParams('DELETE', data, success, options));
};

exports.put = function(url, data, success, options) {
  return request(url, parseParams('PUT', data, success, options));
};
