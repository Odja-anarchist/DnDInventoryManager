var _ = require('lodash');

var TitleBar = require('../../Components/TitleBar');
var Button = require('../../Components/Button');
var CheckBox = require('../../Components/CheckBox');
var CheckBoxGroup = require('../../Components/CheckBoxGroup');
var CenterFloat = require('../../Components/CenterFloat');
var EventHandler = require('../../EventHandler');
var Utils = require('../../Utils');
var Constants = require('../../Constants');
var CoinageManager = require('../../Managers/CoinageManager');

var transactionUI = '<table class="table table-hover bottomBorder transactionTable">' +
    '<thead>' +
    '<tr>' +
    '<th>Type</th>' +
    '<th>Value</th>' +
    '<th>Current</th>' +
    '<th>Final</th>' +
    '</tr>' +
    '</thead>' +
    '<tbody id="transactionTable">' +
    '<tr>' +
    '<td>' +
    '<span>Platinum</span>' +
    '</td>' +
    '<td>' +
    '<input class="form-control coinageInput forceWhiteBackground" value="0" type="number" id="transaction-PLATINUM" min="0" max="999999999"></input>' +
    '</td>' +
    '<td>' +
    '<input class="form-control coinageInput forceWhiteBackground" value="0" type="number" id="current-PLATINUM" min="0" max="999999999" readonly="true"></input>' +
    '</td>' +
    '<td>' +
    '<input class="form-control coinageInput forceWhiteBackground" value="0" type="number" id="final-PLATINUM" min="0" max="999999999" readonly="true"></input>' +
    '</td>' +
    '</tr>' +
    '<tr>' +
    '<td>' +
    '<span>Gold</span>' +
    '</td>' +
    '<td>' +
    '<input class="form-control coinageInput forceWhiteBackground" value="0" type="number" id="transaction-GOLD" min="0" max="999999999"></input>' +
    '</td>' +
    '<td>' +
    '<input class="form-control coinageInput forceWhiteBackground" value="0" type="number" id="current-GOLD" min="0" max="999999999" readonly="true"></input>' +
    '</td>' +
    '<td>' +
    '<input class="form-control coinageInput forceWhiteBackground" value="0" type="number" id="final-GOLD" min="0" max="999999999" readonly="true"></input>' +
    '</td>' +
    '</tr>' +
    '<tr>' +
    '<td>' +
    '<span>Electrum</span>' +
    '</td>' +
    '<td>' +
    '<input class="form-control coinageInput forceWhiteBackground" value="0" type="number" id="transaction-ELECTRUM" min="0" max="999999999"></input>' +
    '</td>' +
    '<td>' +
    '<input class="form-control coinageInput forceWhiteBackground" value="0" type="number" id="current-ELECTRUM" min="0" max="999999999" readonly="true"></input>' +
    '</td>' +
    '<td>' +
    '<input class="form-control coinageInput forceWhiteBackground" value="0" type="number" id="final-ELECTRUM" min="0" max="999999999" readonly="true"></input>' +
    '</td>' +
    '</tr>' +
    '<tr>' +
    '<td>' +
    '<span>Silver</span>' +
    '</td>' +
    '<td>' +
    '<input class="form-control coinageInput forceWhiteBackground" value="0" type="number" id="transaction-SILVER" min="0" max="999999999"></input>' +
    '</td>' +
    '<td>' +
    '<input class="form-control coinageInput forceWhiteBackground" value="0" type="number" id="current-SILVER" min="0" max="999999999" readonly="true"></input>' +
    '</td>' +
    '<td>' +
    '<input class="form-control coinageInput forceWhiteBackground" value="0" type="number" id="final-SILVER" min="0" max="999999999" readonly="true"></input>' +
    '</td>' +
    '</tr>' +
    '<tr>' +
    '<td>' +
    '<span>Copper</span>' +
    '</td>' +
    '<td>' +
    '<input class="form-control coinageInput forceWhiteBackground" value="0" type="number" id="transaction-COPPER" min="0" max="999999999"></input>' +
    '</td>' +
    '<td>' +
    '<input class="form-control coinageInput forceWhiteBackground" value="0" type="number" id="current-COPPER" min="0" max="999999999" readonly="true"></input>' +
    '</td>' +
    '<td>' +
    '<input class="form-control coinageInput forceWhiteBackground" value="0" type="number" id="final-COPPER" min="0" max="999999999" readonly="true"></input>' +
    '</td>' +
    '</tr>' +
    '</tbody>' +
    '</table>';

var transaction = function () {
    _.bindAll(this, _.functionsIn(this));
}

transaction.prototype.showInside = function (contentDiv, eventListener) {
    this.parentEventListener = eventListener;
    this.isInSellMode = true;
    var addItemButton = new Button({
        title: 'Accept',
        icon: 'fa-check',
        listener: this.onAcceptTap
    });
    var cancelButton = new Button({
        title: 'Cancel',
        icon: 'fa-times',
        listener: this.onCancelTap
    })

    contentDiv.appendChild(new TitleBar({
        title: 'Transaction',
        type: TitleBar.TYPES.SUB_TITLE,
        rightButton: addItemButton,
        leftButton: cancelButton
    }).getElement());

    var buyButton = new CheckBox({
        icon: 'fa-arrow-up',
        iconStyle: 'color: #c9302c;',
        title: 'Give Coin'
    });
    var sellButton = new CheckBox({
        icon: 'fa-arrow-down',
        iconStyle: 'color: #5cb85c;',
        title: 'Get Coin'
    });
    var allowCurrencySwitch = new CheckBox({
        title: 'Allow transmuting currency on outgoings',
        checked: true
    });
    this.checkBoxGroup = new CheckBoxGroup({
        buttons: [sellButton, buyButton]
    });
    content.appendChild(this.checkBoxGroup.getElement());
    contentDiv.insertAdjacentHTML('beforeEnd', transactionUI);
    this.setupInputFields();
    this.onMethodChange(0);
    this.checkBoxGroup.addChangeListener(this.onMethodChange);
    $(".coinageInput").keypress(function (e) {
        if (e.which < 48 || e.which > 57) {
            return (false);
        }
    });
}

transaction.prototype.onMethodChange = function (int) {
    this.isInSellMode = int === 0;
    var types = ["PLATINUM", "GOLD", "ELECTRUM", "SILVER", "COPPER"],
        self = this;
    _.each(types, function (type) {
        self.recalcFinalField(type);
    });
}

transaction.prototype.setupInputFields = function () {
    var coinageData = CoinageManager.getCoinageData();
    this.setupCoinageField("PLATINUM", coinageData.Platinum);
    this.setupCoinageField('GOLD', coinageData.Gold);
    this.setupCoinageField('ELECTRUM', coinageData.Electrum);
    this.setupCoinageField('SILVER', coinageData.Silver);
    this.setupCoinageField('COPPER', coinageData.Copper);
}

transaction.prototype.setupCoinageField = function (type, value) {
    var inputField = document.getElementById('transaction-' + type);
    var currentField = document.getElementById('current-' + type);
    currentField.value = value;
    inputField.addEventListener('input', _.partial(this.validateCoinageInput, type));
}

transaction.prototype.recalcFinalField = function (type) {
    var inputField = document.getElementById('transaction-' + type);
    var currentField = document.getElementById('current-' + type);
    var finalField = document.getElementById('final-' + type);

    var inputValue = parseInt(inputField.value);
    var currentValue = parseInt(currentField.value);

    var outputValue = this.isInSellMode ? currentValue + inputValue : currentValue - inputValue;
    finalField.value = outputValue;
}

transaction.prototype.validateCoinageInput = function (id) {
    var inputField = document.getElementById('transaction-' + id);
    var value = Utils.sanitiseNumberInput(inputField.value);
    inputField.value = value;
    this.recalcFinalField(id);
}

transaction.prototype.hide = function () {
    this.checkBoxGroup.removeChangeListener(this.onMethodChange);
}

transaction.prototype.areThereAnyNegativeFinalValues = function () {
    var types = ["PLATINUM", "GOLD", "ELECTRUM", "SILVER", "COPPER"],
        self = this,
        anyNegativeValues = false;
    _.each(types, function (type) {
        var finalField = document.getElementById('final-' + type);
        var value = parseInt(finalField.value);
        if (value < 0) {
            anyNegativeValues = true;
        }
    });
    return anyNegativeValues;
}

transaction.prototype.saveNewFinalValues = function () {
    this.saveNewFinalValue('PLATINUM', CoinageManager.setPlatinum);
    this.saveNewFinalValue('GOLD', CoinageManager.setGold);
    this.saveNewFinalValue('ELECTRUM', CoinageManager.setElectrum);
    this.saveNewFinalValue('SILVER', CoinageManager.setSilver);
    this.saveNewFinalValue('COPPER', CoinageManager.setCopper);
};

transaction.prototype.saveNewFinalValue = function (type, saveFunction) {
    var finalElement = document.getElementById('final-' + type);
    saveFunction(parseInt(finalElement.value));
}

transaction.prototype.onAcceptTap = function () {
    if (!this.isInSellMode) {
        if (this.areThereAnyNegativeFinalValues()) {
            alert('Unable to complete transaction with negative final values');
            return;
        }
    }
    this.saveNewFinalValues();
    this.goBack()
}

transaction.prototype.onCancelTap = function () {
    this.goBack()
}

transaction.prototype.goBack = function () {
    this.parentEventListener.fireEvent(Constants.inventoryPageActions.RESET);
}

module.exports = new transaction();