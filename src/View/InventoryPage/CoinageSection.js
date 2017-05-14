var _ = require('lodash');

var TitleBar = require('../../Components/TitleBar');
var Button = require('../../Components/Button');
var EventHandler = require('../../EventHandler');
var inventoryManager = require('../../Managers/inventoryManager');
var CoinageManager = require('../../Managers/CoinageManager');
var Utils = require('../../Utils');
var Constants = require('../../Constants');

var coinageLayout = '<table class="table bottomBorder">' +
    '<tbody>' +

    '<tr>' +
    '<td class="coinageLabel">' +
    'Platinum' +
    '</td>' +
    '<td>' +
    '<input class="form-control coinageInput" value="0" type="number" id="PLATINUM-input" min="0" max="999999999"></input>' +
    '</td>' +

    '<td class="coinageLabel">' +
    'Silver' +
    '</td>' +
    '<td>' +
    '<input class="form-control coinageInput" value="0" type="number" id="SILVER-input" min="0" max="999999"></input>' +
    '</td>' +

    '<td class="coinageLabel">' +
    'Total Value' +
    '</td>' +
    '<td>' +
    '<div  data-toggle="tooltip" class="input-group" style="width: 8em !important" id="total-coinage-container">' +
    '<input id="total-coinage-value" class="form-control forceWhiteBackground" value="0" type="text" aria-describedby="basic-addon2" readonly="true"></input>' +
    '<span class="input-group-addon forceWhiteBackground" id="basic-addon2">GP</span>' +
    '</div>' +
    '</td>' +
    '</tr>' +

    '<tr>' +
    '<td class="coinageLabel">' +
    'Gold' +
    '</td>' +
    '<td>' +
    '<input class="form-control coinageInput" value="0" type="number" id="GOLD-input" min="0" max="999999"></input>' +
    '</td>' +

    '<td class="coinageLabel">' +
    'Copper' +
    '</td>' +
    '<td>' +
    '<input class="form-control coinageInput" value="0" type="number" id="COPPER-input" min="0" max="999999"></input>' +
    '</td>' +

    '<td class="coinageLabel">' +
    'Total Coins' +
    '</td>' +
    '<td>' +
    '<input class="form-control coinageInput forceWhiteBackground" value="0" type="number" id="total-coinage-ammount" min="0" max="999999" readonly="true"></input>' +
    '</td>' +
    '</tr>' +

    '<tr>' +
    '<td class="coinageLabel">' +
    'Electrum' +
    '</td>' +
    '<td>' +
    '<input class="form-control coinageInput" value="0" type="number" id="ELECTRUM-input" min="0" max="999999"></input>' +
    '</td>' +

    '<td>' +
    '</td>' +
    '<td>' +
    '</td>' +

    '<td class="coinageLabel">' +
    'Weight' +
    '</td>' +
    '<td>' +
    '<div class="input-group" style="width: 8em !important">' +
    '<input id="coinage-weight" class="form-control forceWhiteBackground" value="0" type="text" aria-describedby="basic-addon2" readonly="true"></input>' +
    '<span class="input-group-addon forceWhiteBackground" id="basic-addon2">lbs</span>' +
    '</div>' +
    '</td>' +
    '</tr>' +
    '</tbody>' +
    '</table>';

var coinageSection = function () {
    _.bindAll(this, _.functionsIn(this));
};

coinageSection.prototype.showInside = function (contentDiv, eventListener) {
    this.parentEventListener = eventListener;
    this.createUI(contentDiv);
    this.setupCoinageFieldValuesAndListeners();
    CoinageManager.addListener(CoinageManager.EVENTS.COINAGE_UPDATED, this.onCoinageChange);
}

coinageSection.prototype.hide = function () {
    CoinageManager.removeListener(CoinageManager.EVENTS.COINAGE_UPDATED, this.onCoinageChange);
}

coinageSection.prototype.onTransactionTap = function () {
    this.parentEventListener.fireEvent(Constants.inventoryPageActions.TRANSACTION);
}

coinageSection.prototype.createUI = function (contentDiv) {
    var transactionButton = new Button({
        title: 'Transaction',
        icon: 'fa-exchange',
        listener: this.onTransactionTap
    })
    contentDiv.appendChild(new TitleBar({
        title: 'Coinage',
        type: TitleBar.TYPES.SUB_TITLE,
        rightButton: transactionButton
    }).getElement());
    contentDiv.insertAdjacentHTML('beforeEnd', coinageLayout);
    $(".coinageInput").keypress(function (e) {
        if (e.which < 48 || e.which > 57) {
            return (false);
        }
    });
}

coinageSection.prototype.onCoinageChange = function (coinageData) {
    var totalValue = document.getElementById('total-coinage-value');
    var totalCoins = document.getElementById('total-coinage-ammount');
    var coinWeight = document.getElementById('coinage-weight');
    var totalCoinageContainer = document.getElementById('total-coinage-container');
    totalCoins.value = coinageData.count;
    coinWeight.value = coinageData.weight;
    totalValue.value = coinageData.goldValue;
    Utils.addCoinagePopupToElement(coinageData.copperValue, 'Copper', totalCoinageContainer);
}

coinageSection.prototype.setupCoinageFieldValuesAndListeners = function (coinageData) {
    var coinageData = coinageData || CoinageManager.getCoinageData();
    this.setupCoinageField('PLATINUM-input', coinageData.platinum);
    this.setupCoinageField('GOLD-input', coinageData.gold);
    this.setupCoinageField('ELECTRUM-input', coinageData.electrum);
    this.setupCoinageField('SILVER-input', coinageData.silver);
    this.setupCoinageField('COPPER-input', coinageData.copper);
    this.onCoinageChange(coinageData);
}

coinageSection.prototype.setupCoinageField = function (fieldId, value) {
    var inputField = document.getElementById(fieldId);
    inputField.value = value;
    inputField.addEventListener('input', _.partial(this.validateCoinageInput, fieldId));
}

coinageSection.prototype.validateCoinageInput = function (id) {
    var inputField = document.getElementById(id);
    var value = Utils.sanitiseNumberInput(inputField.value);
    inputField.value = value;
    switch (id) {
        case 'PLATINUM-input':
            inputFunction = CoinageManager.setPlatinum(value);
            break;
        case 'GOLD-input':
            inputFunction = CoinageManager.setGold(value);
            break;
        case 'ELECTRUM-input':
            inputFunction = CoinageManager.setElectrum(value);
            break;
        case 'SILVER-input':
            inputFunction = CoinageManager.setSilver(value);
            break;
        case 'COPPER-input':
            inputFunction = CoinageManager.setCopper(value);
            break;
    }
}

module.exports = new coinageSection();