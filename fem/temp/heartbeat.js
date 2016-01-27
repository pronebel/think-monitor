; (function(window) { 'use strict';

    var heartbeat = {};
    var options = {};
    var internalConsoleError = 'HeartBeat';

    /**
     * Initiate monitoring
     * @param  {Object} opt Options
     */
    heartbeat.start = function(opt) {
        options.url = opt.url;
        options.methods = typeof opt.methods !== 'undefined' ? opt.methods : ['log', 'info', 'warn', 'error', 'assert', 'dir', 'clear', 'profile', 'profileEnd'];
        options.logConsole = typeof opt.logConsole !== 'undefined' ? opt.logConsole : true;
        options.logError = typeof opt.logError !== 'undefined' ? opt.logError : true;
        options.callback = typeof opt.callback !== 'undefined' ? opt.callback : function(){};

        if (options.logConsole){
            this.initConsole();
        }
        if (options.logError){
            this.initErrorlog();
        }

    };

    /**
     * Watches for console errors
     */
    heartbeat.initErrorlog = function(){

        window.onerror = (function(message, url, line, col, error) {
            if (message !== internalConsoleError){
                var data = {
                    message: message,
                    url: url,
                    line: line,
                    col: col
                };

                this.sendMessage(data, 'error');
            }

        }).bind(this);


    };

    /**
     * Forms the request with data
     * @param  {Object} data  Event information
     * @param  {String} event Event name
     */
    heartbeat.sendMessage = function(data, event) {
        options.callback(data, event);
        if (options.url) {
            var id = prepareId();

            var content = JSON.stringify({
                id: id,
                timestamp: (new Date()).getTime(),
                data: data,
                event: event,
                useragent: window.navigator.userAgent
            });

            xdr(options.url, 'POST', content);
        }
    };




    /**
     * Creates a hash. Based on Java.lang.String hash
     * @param  {String} input Input string
     * @return {Integer}      Hash
     */
    var makeHash = function(input) {
        var hash = 0;
        if (input.length === 0) {
            return hash;
        }

        for (var i = 0; i < input.length; i++) {
            hash = hash * 31 + input.charCodeAt(i);
            hash &= hash;
        }

        return hash;
    };

    /**
     * Gathers information about user
     * @return {Integer} Hash
     */
    var prepareId = function() {
        var idString = readProperties(window.navigator) + readProperties(window.screen) + readProperties(window.history);
        return makeHash(idString);
    };

    /**
     * This function extracts "valuable" information from an object
     * @param  {Object} obj    Input object
     * @param  {Integer} depth  Depth of iteration
     * @param  {String} result Prefix string
     * @return {String}        All properties and values
     */
    var readProperties = function(obj, depth, result, info) {
        depth = depth || 1;
        result = result || '';
        info = info || {};
        if (depth < 3) {
            for (var property in obj) {
                if (obj[property] !== undefined) {
                    result += property;
                    switch (typeof obj[property]) {
                        case 'object':
                            result += readProperties(obj[property], ++depth, '', info);
                            break;
                        case 'number':
                        case 'string':
                        case 'boolean':
                            result += obj[property].toString();
                            break;
                    }
                }
            }
        }
        return result;

    };



})(window);