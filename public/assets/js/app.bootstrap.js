var in_node_webkit = (typeof require === 'function');

if (in_node_webkit) {
	var lodash = require('lodash');
	var gui = require('nw.gui');
	var fs = require('fs');
}

var DEBUG = true;

if (!DEBUG) {
	if(!window.console) window.console = {};
	var methods = ["log", "debug", "warn", "info"];
	for(var i = 0;i < methods.length; ++i) {
		console[methods[i]] = function() {};
	}
}