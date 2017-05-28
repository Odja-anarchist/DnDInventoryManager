var _ = require('lodash');

var EventHandler = require('../EventHandler');
var Constants = require('../Constants');

var characterManager = function () {
    this.loadValuesFromStorage();
    this.eventHandler = new EventHandler();
    _.bindAll(this, _.functionsIn(this));
}

characterManager.prototype.KEYS = {
    ABILITES: "ABILITES",
    NAME: "NAME"
}

characterManager.prototype.loadValuesFromStorage = function () {
    if (localStorage['CHARACTER']) {
        var character = JSON.parse(localStorage['CHARACTER']);
        this.abilities = character.abilities;
    } else {
        this.abilities = {},
            self = this;
        _.each(Constants.abilities, function (ability) {
            self.abilities[ability.NAME] = 10;
        });

        this.skills = {};
    }
}

characterManager.prototype.getModifierForSkill = function (skillName, abilityMod) {

}

characterManager.prototype.getAbilities = function () {
    return _.clone(this.abilities);
}

characterManager.prototype.saveValuesToStorage = function () {
    var character = {
        abilities: this.abilities
    };
    localStorage['CHARACTER'] = JSON.stringify(character);
}

characterManager.prototype.setAbility = function (type, value) {
    if (!_.isNil(this.abilities[type])) {
        this.abilities[type] = value;
        this.fireEvent(this.KEYS.ABILITES, this.abilities);
    }
}

characterManager.prototype.getAbility = function (type) {
    if (!_.isNil(this.abilities[type])) {
        return this.abilities[type];
    }
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