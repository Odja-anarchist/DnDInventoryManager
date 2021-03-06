var _ = require('lodash');

var TitleBar = require('../../Components/TitleBar');

var inventoryManager = require('../../Managers/inventoryManager');
var CoinageManager = require('../../Managers/CoinageManager');
var CharacterManager = require('../../Managers/CharacterManager');
var Utils = require('../../Utils');
var Constants = require('../../Constants');

var MAX_STRENGTH = 30;

var UI = '<div class="inventoryPageHeader">' +
    '<span class="topBarLabel">Strength:</span><input class="form-control integer inputWidth" step="1" value="0" type="number" id="strength-input" min="0" max="20"></input>' +
    '<span class="topBarLabel">Carrying Capacity: </span>' +
    '<div class="input-group" style="width: 8em !important; margin-right: 20px;">' +
    '<input id="carry-capacity" class="form-control forceWhiteBackground" value="0" type="number" min="0" aria-describedby="basic-addon2" readonly="true"></input>' +
    '<span class="input-group-addon forceWhiteBackground" id="basic-addon2">lbs</span>' +
    '</div>' +
    '<span class="topBarLabel">Total Current Weight: </span>' +
    '<div class="input-group" style="width: 10em !important">' +
    '<input id="current-weight" class="form-control forceWhiteBackground" value="0" type="number" min="0" aria-describedby="basic-addon2" readonly="true"></input>' +
    '<span class="input-group-addon forceWhiteBackground" id="current-weight-addon">lbs</span>' +
    '</div>' +
    '</div>';

var InventoryHeaderSection = function () {
    _.bindAll(this, _.functionsIn(this));
}

InventoryHeaderSection.prototype.showInside = function (contentDiv) {
    this.createUI(contentDiv);
    this.setupStrenghtInput();
    this.setupCurrentWeight();
    $(".integer").keypress(function (e) {
        if (e.which < 48 || e.which > 57) {
            return (false);
        }
    });
}

InventoryHeaderSection.prototype.hide = function (contentDiv) {
}

InventoryHeaderSection.prototype.createUI = function (contentDiv) {
    contentDiv.insertAdjacentHTML('beforeEnd', UI);
}

InventoryHeaderSection.prototype.hide = function (contentDiv) {
    CharacterManager.removeListener(CharacterManager.KEYS.ABILITIES, this.onCharacterAbilitiesChange);
    CoinageManager.removeListener(CoinageManager.EVENTS.COINAGE_UPDATED, this.setupCurrentWeight);
    inventoryManager.removeListener(this.setupCurrentWeight);
}

InventoryHeaderSection.prototype.validateStrengthInput = function () {
    var strengthInput = document.getElementById('strength-input');
    var value = Utils.sanitiseNumberInput(strengthInput.value);
    strengthInput.value = value;
    CharacterManager.setAbility(Constants.abilities.STR.NAME, value);
}

InventoryHeaderSection.prototype.onCharacterAbilitiesChange = function (abilities) {
    var strength = abilities[Constants.abilities.STR.NAME];
    var strengthInput = document.getElementById('strength-input');
    var carryCapacity = document.getElementById('carry-capacity');
    strengthInput.value = strength;
    carryCapacity.value = strength * 15;
}
InventoryHeaderSection.prototype.setupCurrentWeight = function () {
    var totalWeight = document.getElementById('current-weight');
    var currentCoinageWeight = CoinageManager.getCurrentCoinageWeight();
    var currentItemWeight = inventoryManager.getCarriedWeight();
    totalWeight.value = currentCoinageWeight + currentItemWeight;
};

InventoryHeaderSection.prototype.setupStrenghtInput = function () {
    var strengthInput = document.getElementById('strength-input');
    strengthInput.addEventListener('input', this.validateStrengthInput);
    CharacterManager.addListener(CharacterManager.KEYS.ABILITIES, this.onCharacterAbilitiesChange);

    var currentStrength = CharacterManager.getAbility(Constants.abilities.STR.NAME);
    var carryCapacity = document.getElementById('carry-capacity');
    carryCapacity.value = currentStrength * 15;
    strengthInput.value = currentStrength;

    CoinageManager.addListener(CoinageManager.EVENTS.COINAGE_UPDATED, this.setupCurrentWeight);
    inventoryManager.addUpdateListener(this.setupCurrentWeight);
}

module.exports = new InventoryHeaderSection();