var WebApi = require('./webApi');

exports.system = new WebApi('Server', 'sys', 0);
exports.streamsrc = new WebApi('Server', 'streamsrc', 0);
exports.multimedia = new WebApi('Server', 'multimedia', 0);
exports.devmng = new WebApi('Server', 'devmng', 0);
exports.mediaPhy = new WebApi('Server', 'mediaPhy', -1);
exports.record = new WebApi('Server', 'record', -1);
exports.transfer = new WebApi('Server', 'transfer', -1);