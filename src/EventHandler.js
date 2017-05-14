var _ = require('lodash');

var EventHandler = function (possibleEvents) {
    this.listeners = {};
    if (possibleEvents) {
        this.possibleEvents = possibleEvents;
    }
    _.bindAll(this, _.functionsIn(this));
}

EventHandler.prototype.getPossibleEvents = function () {
    return this.possibleEvents;
}

EventHandler.prototype.addListener = function (type, listener) {
    if (this.possibleEvents) {
        if (_.indexOf(this.possibleEvents, type) == -1) {
            throw new Error('Tried adding a listener to an event handler with no support for that type: ' + type);
        }
    }
    if (!this.listeners[type]) {
        this.listeners[type] = [];
    }
    this.listeners[type].push(listener);
}

EventHandler.prototype.removeListener = function (type, targetListener) {
    if (this.listeners[type]) {
        var targetIndex = -1,
            count = 0;
        _.each(this.listeners[type], function (listener) {
            if (targetListener == listener) {
                targetIndex = count;
            }
            count++;
        });
        if (targetIndex != -1) {
            this.listeners[type].splice(targetIndex, 1);
        }
    }
}

EventHandler.prototype.fireEvent = function (type, data) {
    if (this.possibleEvents) {
        if (_.indexOf(this.possibleEvents, type) == -1) {
            throw new Error('Tried firing an event with no support for that type: ' + type);
        }
    }
    if (this.listeners[type]) {
        _.each(this.listeners[type], function (listener) {
            listener(data, type);
        });
    }
}


module.exports = EventHandler;