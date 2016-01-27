var UAParser = require("./ua");
var Report = require("./report");
var js_monitor = require('./monitor/js');


var cfg = require("./config")



var ua = new UAParser();

function postUA(){
    if(!localStorage.getItem("UA_Track1")){
        Report.post(cfg.url+"/monitor/index/ua",ua.getResult());
        localStorage.setItem("UA_Track1",true);
    }
}


postUA();


window.onerror = function () {
    var msgObj = js_monitor(Array.prototype.slice.call(arguments)) || {};


    msgObj.browser = ua.getBrowser();
    msgObj.cpu = ua.getCPU();
    msgObj.device = ua.getDevice();
    msgObj.engine = ua.getEngine();
    msgObj.os = ua.getOS();

    Report.post(cfg.url+"/monitor/index/add",msgObj);
}

