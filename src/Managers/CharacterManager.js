var _ = require('lodash');

var EventHandler = require('../EventHandler');

var characterManager = function () {
    this.attributes = {
        strength: 0
    }
    this.loadValuesFromStorage();
    this.eventHandler = new EventHandler();
    _.bindAll(this, _.functionsIn(this));
}

characterManager.prototype.KEYS = {
    STRENGTH: "STRENGTH",
}

characterManager.prototype.loadValuesFromStorage = function () {
    if (localStorage['CHARACTER']) {
        var character = JSON.parse(localStorage['CHARACTER']);
        this.attributes = character.attributes;
    }
}

characterManager.prototype.saveValuesToStorage = function () {
    var character = {
        attributes: this.attributes
    };
    localStorage['CHARACTER'] = JSON.stringify(character);
}

characterManager.prototype.setStrength = function (strength) {
    this.attributes.strength = strength;
    this.fireEvent(this.KEYS.STRENGTH, strength);
}

characterManager.prototype.getStrength = function () {
    return this.attributes.strength;
}

characterManager.prototype.addListener = function (type, listener) {
    this.eventHandler.addListener(type, listener);
}

characterManager.prototype.removeListener = function (type, listener) {
    this.eventHandler.removeListener(type, listener);
}

characterManager.prototype.fireEvent = function (type, data) {
    this.saveValuesToStorage();
    this.eventHandler.fireEvent(type, data);
}

module.exports = new characterManager();