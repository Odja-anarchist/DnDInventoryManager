var _ = require('lodash');

var WEIGHT_PER_COIN = 0.02;

var EventHandler = require('../EventHandler');
var Constants = require('../Constants');

var CoinageManager = function () {
    this.Platinum = 0;
    this.Gold = 0;
    this.Electrum = 0;
    this.Silver = 0;
    this.Copper = 0;
    this.eventHandler = new EventHandler();
    _.bindAll(this, _.functionsIn(this));
    this.loadValuesFromStorage();
}

CoinageManager.prototype.EVENTS = {
    COINAGE_UPDATED: "COINAGE_UPDATED"
}

CoinageManager.prototype.setGold = function (newValue) {
    this.Gold = newValue;
    this.onCoinChange();
}

CoinageManager.prototype.setPlatinum = function (newValue) {
    this.Platinum = newValue;
    this.onCoinChange();
}

CoinageManager.prototype.setElectrum = function (newValue) {
    this.Electrum = newValue;
    this.onCoinChange();
}

CoinageManager.prototype.setSilver = function (newValue) {
    this.Silver = newValue;
    this.onCoinChange();
}

CoinageManager.prototype.setCopper = function (newValue) {
    this.Copper = newValue;
    this.onCoinChange();
}

CoinageManager.prototype.onCoinChange = function () {
    this.saveValuesToStorage();
    this.fireEvent(this.EVENTS.COINAGE_UPDATED, this.getCoinageData());
}

CoinageManager.prototype.loadValuesFromStorage = function () {
    if (localStorage['COINAGE']) {
        var coinageVales = JSON.parse(localStorage['COINAGE']);
        this.Platinum = coinageVales.Platinum;
        this.Gold = coinageVales.Gold;
        this.Electrum = coinageVales.Electrum;
        this.Silver = coinageVales.Silver;
        this.Copper = coinageVales.Copper;
        this.fireEvent(this.EVENTS.COINAGE_UPDATED, this.getCoinageData());
    }
}

CoinageManager.prototype.saveValuesToStorage = function () {
    localStorage['COINAGE'] = JSON.stringify(this.getSimpleCoinageData());
}

CoinageManager.prototype.getValue = function (type) {
    var allowedValues = Constants.coinage,
        self = this,
        returnValue;
    _.each(allowedValues, function (value) {
        if (value.NAME === type) {
            returnValue = self[value.NAME];
        }
    })
    if (returnValue) {
        return returnValue;
    }
}

CoinageManager.prototype.setValue = function (type, value) {
    var allowedValues = Constants.coinage,
        self = this;
    _.each(allowedValues, function (fullValue) {
        if (fullValue.NAME === type) {
            self['set' + fullValue.NAME](value);
        }
    })
}

CoinageManager.prototype.getCoinageData = function () {
    var coinageData = this.getSimpleCoinageData();
    coinageData.weight = this.getCurrentCoinageWeight();
    coinageData.count = this.getCurrentCoinCount();
    coinageData.goldValue = this.getCurrentValueInGold();
    coinageData.copperValue = this.getCurrentValueInCopper();
    return coinageData;
}

CoinageManager.prototype.getSimpleCoinageData = function () {
    return {
        Platinum: this.Platinum,
        Gold: this.Gold,
        Electrum: this.Electrum,
        Silver: this.Silver,
        Copper: this.Copper
    }
}

CoinageManager.prototype.getCurrentCoinageWeight = function () {
    return this.getCurrentCoinCount() / 50;
}

CoinageManager.prototype.getCurrentCoinCount = function () {
    return (this.Platinum + this.Gold + this.Electrum + this.Silver + this.Copper);
}

CoinageManager.prototype.getCurrentValueInGold = function () {
    return (this.getCurrentValueInCopper() / 100).toFixed(0);
}

CoinageManager.prototype.getCurrentValueInCopper = function () {
    return (this.Platinum * 1000) + (this.Gold * 100) + (this.Electrum * 50) + (this.Silver * 10) + this.Copper;
}

CoinageManager.prototype.addListener = function (type, listener) {
    this.eventHandler.addListener(type, listener);
}

CoinageManager.prototype.removeListener = function (type, listener) {
    this.eventHandler.removeListener(type, listener);
}

CoinageManager.prototype.fireEvent = function (type, data) {
    this.eventHandler.fireEvent(type, data);
}

module.exports = new CoinageManager();