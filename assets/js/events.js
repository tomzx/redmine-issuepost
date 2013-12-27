var Events = function(){
	this.events = {};
}

Events.prototype.on = function(eventName, handler) {
	if (!(eventName in this.events)) {
		this.events[eventName] = [];
	}

	this.events[eventName].push(handler);
};

Events.prototype.trigger = function(eventName, args) {
	var event = this.events[eventName];
	if (!event) { return; }

	for (var i in event) {
		if (typeof event[i] === 'function') {
			event[i](args);
		}
	}
};