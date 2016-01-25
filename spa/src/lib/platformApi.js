var api = require('./api');
var WebApi = require('./webApi');

exports.system = new WebApi('Platform', 'sys');

exports.storage = {
  getServiceCfg: function(cb) {
    api.storage.getFile('Platform', 'config', 'serviceCfg.json', cb);
  }
};