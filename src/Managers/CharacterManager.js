var _ = require('lodash');

var EventHandler = require('../EventHandler');

var characterManager = function () {
    this.abilities = {
        strength: 0,
        dexterity: 0,
        constitution: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0
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
        this.abilities = character.abilities;
    }
}

characterManager.prototype.getAbilities = function () {
    return this.abilities;
}

characterManager.prototype.saveValuesToStorage = function () {
    var character = {
        abilities: this.abilities
    };
    localStorage['CHARACTER'] = JSON.stringify(character);
}

characterManager.prototype.setStrength = function (strength) {
    this.abilities.strength = strength;
    this.fireEvent(this.KEYS.STRENGTH, strength);
}

characterManager.prototype.getStrength = function () {
    return this.abilities.strength;
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