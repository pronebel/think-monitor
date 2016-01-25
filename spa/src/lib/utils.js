function checkValidIp(ip) {
  var re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
  if (re.test(ip)) {
    if (RegExp.$1 < 256 && RegExp.$2 < 256 && RegExp.$3 < 256 && RegExp.$4 < 256) {
      return true;
    }
  }

  return false;
}

function checkValidMultiIp(ip) {
  var re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
  if (re.test(ip)) {
    if (RegExp.$1 >= 225 && RegExp.$1 <= 238) {
      return true;
    }
  }

  return false;
}

function isValidIp(ip) {
  return ip == '' ? true : checkValidIp(ip);
}
exports.checkValidIp = checkValidIp;
exports.checkValidMultiIp = checkValidMultiIp;
exports.isValidIp = isValidIp;

function isValidPort(port) {
  return ((port > 0) && (port < 0xFFFF));
}
exports.isValidPort = isValidPort;

function printObj(obj) {
  for (var i in obj) {
    console.log("key:" + i + " " + "value:" + obj[i]);
  }
};
exports.printObj = printObj;

function readableSize(input) {
  var unitDesc = ["bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  var unitNum = 1024;
  var size = input;
  var left = Math.floor(size / unitNum);
  var index = 0;
  var base = 1.0;

  while (left > 0) {
    index++;
    left = Math.floor(left / unitNum);
    base *= unitNum;
  }

  if (0 == index) {
    return size + " " + unitDesc[0];
  } else {
    return Math.round(size / base) + " " + unitDesc[index];
  }
}
exports.readableSize = readableSize;

function getQueryStringArgs() {
  var args = {};
  var qs = location.search.length > 0 ? location.search.substring(1) : "";
  var items = qs.length ? qs.split("&") : [];
  for (var i = 0; i < items.length; i++) {
    var item = items[i].split("=");
    var name = decodeURIComponent(item[0]);
    var value = decodeURIComponent(item[1]);
    if (name.length) {
      args[name] = value;
    }
  }
  return args;
}
exports.getQueryStringArgs = getQueryStringArgs;

function getTimeStr(date) {
  var now = date;
  var YY = now.getFullYear();
  var MM = now.getMonth() + 1;
  if (MM < 10) MM = '0' + MM;
  var DD = now.getDate();
  if (DD < 10) DD = '0' + DD;
  var HH = now.getHours();
  if (HH < 10) HH = '0' + HH;
  var mm = now.getMinutes();
  if (mm < 10) mm = '0' + mm;
  var ss = now.getSeconds();
  if (ss < 10) ss = '0' + ss;

  return YY + '-' + MM + '-' + DD + 'T' + HH + ':' + mm + ':' + ss;
}
exports.getTimeStr = getTimeStr;

function getOppositeColor(color) {
  color = color.replace('#', '');
  var c16, c10, max16 = 15,
    b = [];
  for (var i = 0; i < color.length; i++) {
    c16 = parseInt(color.charAt(i), 16);
    c10 = parseInt(max16 - c16, 10);
    b.push(c10.toString(16));
  }
  return '#' + b.join('');
}
exports.getOppositeColor = getOppositeColor;