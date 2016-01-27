


function createXMLHTTPObject() {
    var XMLHttpFactories = [
        function() {
            return new XMLHttpRequest();
        }, function() {
            return new ActiveXObject('Msxml2.XMLHTTP');
        }, function() {
            return new ActiveXObject('Msxml3.XMLHTTP');
        }, function() {
            return new ActiveXObject('Microsoft.XMLHTTP');
        }
    ];
    for (var i=0; i<XMLHttpFactories.length; i++) {
        try {
            return XMLHttpFactories[i]();
        } catch (e) { }
    }
}


//http://127.0.0.1:8360/monitor/index/add
module.exports =  function (url, postData,callback) {
    var req = createXMLHTTPObject();
    if (!req) {
        return;
    }
    req.open("POST", url, true);
    if (postData) {
        req.setRequestHeader('Content-type', 'application/json');
    }
    req.onreadystatechange = function() {
        if (req.readyState != 4) {
            return;
        }
        if (req.status != 200 && req.status != 304) {
            return;
        }
        if(callback){
            callback(req);
        }

    };
    if (req.readyState == 4) {
        return;
    }

    /*var postDataPairs = [];
    for (var i in postData) {
        postDataPairs.push(i + "=" + encodeURIComponent(postData[i]));
    }
    var postDataPairsStr = postDataPairs.join("&");*/
    req.send(JSON.stringify(postData));
}

