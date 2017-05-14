var _ = require('lodash');

var WEIGHT_PER_COIN = 0.02;

var EventHandler = require('../EventHandler');

var CoinageManager = function () {
    this.platinum = 0;
    this.gold = 0;
    this.electrum = 0;
    this.silver = 0;
    this.copper = 0;
    this.eventHandler = new EventHandler();
    _.bindAll(this, _.functionsIn(this));
    this.loadValuesFromStorage();
}

CoinageManager.prototype.EVENTS = {
    COINAGE_UPDATED: "COINAGE_UPDATED"
}

CoinageManager.prototype.setGold = function (newValue) {
    this.gold = newValue;
    this.onCoinChange();
}

CoinageManager.prototype.setPlatinum = function (newValue) {
    this.platinum = newValue;
    this.onCoinChange();
}

CoinageManager.prototype.setElectrum = function (newValue) {
    this.electrum = newValue;
    this.onCoinChange();
}

CoinageManager.prototype.setSilver = function (newValue) {
    this.silver = newValue;
    this.onCoinChange();
}

CoinageManager.prototype.setCopper = function (newValue) {
    this.copper = newValue;
    this.onCoinChange();
}

CoinageManager.prototype.onCoinChange = function () {
    this.saveValuesToStorage();
    this.fireEvent(this.EVENTS.COINAGE_UPDATED, this.getCoinageData());
}

CoinageManager.prototype.loadValuesFromStorage = function () {
    if (localStorage['COINAGE']) {
        var coinageVales = JSON.parse(localStorage['COINAGE']);
        this.platinum = coinageVales.platinum;
        this.gold = coinageVales.gold;
        this.electrum = coinageVales.electrum;
        this.silver = coinageVales.silver;
        this.copper = coinageVales.copper;
        this.fireEvent(this.EVENTS.COINAGE_UPDATED, this.getCoinageData());
    }
}

CoinageManager.prototype.saveValuesToStorage = function () {
    localStorage['COINAGE'] = JSON.stringify(this.getSimpleCoinageData());
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
        platinum: this.platinum,
        gold: this.gold,
        electrum: this.electrum,
        silver: this.silver,
        copper: this.copper
    }
}

CoinageManager.prototype.getCurrentCoinageWeight = function () {
    return this.getCurrentCoinCount() / 50;
}

CoinageManager.prototype.getCurrentCoinCount = function () {
    return (this.platinum + this.gold + this.electrum + this.silver + this.copper);
}

CoinageManager.prototype.getCurrentValueInGold = function () {
    return (this.getCurrentValueInCopper() / 100).toFixed(0);
}

CoinageManager.prototype.getCurrentValueInCopper = function () {
    return (this.platinum * 1000) + (this.gold * 100) + (this.electrum * 50) + (this.silver * 10) + this.copper;
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