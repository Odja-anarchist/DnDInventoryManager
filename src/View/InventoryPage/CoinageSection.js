var _ = require('lodash');

var TitleBar = require('../../Components/TitleBar');
var Button = require('../../Components/Button');
var PopupActionMenu = require('../../Components/PopupActionMenu');
var EventHandler = require('../../EventHandler');
var inventoryManager = require('../../Managers/inventoryManager');
var CoinageManager = require('../../Managers/CoinageManager');
var Utils = require('../../Utils');
var Constants = require('../../Constants');

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

coinageSection.prototype.onConvertTap = function (currentSection, targetSection) {
    var orderedTargets = this.getOrderedTargets(currentSection, targetSection);
    this.parentEventListener.fireEvent(Constants.inventoryPageActions.CONVERT_COINAGE, orderedTargets);
}

coinageSection.prototype.getOrderedTargets = function (title1, title2) {
    var orderedTitles = this.getOrderedCoinageNames();
    var title1Index = _.indexOf(orderedTitles, title1);
    var title2Index = _.indexOf(orderedTitles, title2);
    if (title1Index < title2Index) {
        return [title1, title2];
    } else {
        return [title2, title1];
    }
}

coinageSection.prototype.getOrderedCoinageNames = function () {
    return _.map(_.values(Constants.coinage), function (coinageType) {
        return coinageType.NAME;
    });
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

    this.createCoinageTable(contentDiv);

    $(".coinageInput").keypress(function (e) {
        if (e.which < 48 || e.which > 57) {
            return (false);
        }
    });
}

coinageSection.prototype.createCoinageTable = function (contentDiv) {
    var tableElement = document.createElement('table');
    tableElement.setAttribute('class', 'table');
    contentDiv.appendChild(tableElement);

    var tbodyElement = document.createElement('tbody');
    tableElement.appendChild(tbodyElement);

    var firstRow = document.createElement('tr');
    var secondRow = document.createElement('tr');
    var thirdRow = document.createElement('tr');
    tbodyElement.appendChild(firstRow);
    tbodyElement.appendChild(secondRow);
    tbodyElement.appendChild(thirdRow);
    this.createCoinageSection(Constants.coinage.PLATINUM.NAME, false, firstRow);
    this.createCoinageSection(Constants.coinage.SILVER.NAME, false, firstRow);
    this.createUnitSection('Total Value', 'GP', 'total-coinage-value', firstRow, 'total-coinage-container');
    this.createCoinageSection(Constants.coinage.GOLD.NAME, false, secondRow);
    this.createCoinageSection(Constants.coinage.COPPER.NAME, false, secondRow);
    this.createCoinageSection('Total Coins', true, secondRow);
    this.createCoinageSection(Constants.coinage.ELECTRUM.NAME, false, thirdRow);
    this.createEmptySection(thirdRow);
    this.createUnitSection('Weight', 'lbs', 'coinage-weight', thirdRow);
}

coinageSection.prototype.createCoinageSection = function (title, readonly, tableRow, ) {
    var inputCell = document.createElement('td');
    inputCell.setAttribute('style', 'display: flex;');

    var readonlyValue = readonly ? 'readonly="true"' : '';
    inputCell.innerHTML = '<input class="form-control coinageInput forceWhiteBackground" style="margin-right: 5px;" value="0" type="number" id="' + title + '-input" min="0" max="999999999" ' + readonlyValue + '></input>';
    if (!readonly) {
        var popupMenu = new PopupActionMenu({
            title: "Actions",
            buttons: this.generateButtonTitles(title)
        });
        inputCell.appendChild(popupMenu.getElement());
    }

    tableRow.appendChild(this.generateLabelSection(title));
    tableRow.appendChild(inputCell);
}

coinageSection.prototype.generateButtonTitles = function (title) {
    var titles = _.without(this.getOrderedCoinageNames(), title),
        self = this;
    return _.map(titles, function (sectionTitle) {
        return {
            title: 'Convert to / from ' + sectionTitle,
            listener: _.partial(self.onConvertTap, title, sectionTitle)
        };
    });
}

coinageSection.prototype.createUnitSection = function (title, unit, id, tableRow, sectionId) {
    tableRow.appendChild(this.generateLabelSection(title));
    var valueCell = document.createElement('td');

    var inputDiv = document.createElement('div');
    inputDiv.setAttribute('class', 'input-group');
    inputDiv.setAttribute('style', 'width: 9em !important');
    if (sectionId) {
        inputDiv.setAttribute('id', sectionId);
    }

    inputDiv.innerHTML = '<input id="' + id + '" class="form-control forceWhiteBackground" value="0" type="text" aria-describedby="basic-addon2" readonly="true"></input>' +
        '<span class="input-group-addon forceWhiteBackground" id="basic-addon2">' + unit + '</span>';
    valueCell.appendChild(inputDiv);
    tableRow.appendChild(valueCell);
}

coinageSection.prototype.createEmptySection = function (tableRow) {
    tableRow.appendChild(document.createElement('td'));
    tableRow.appendChild(document.createElement('td'));
}

coinageSection.prototype.generateLabelSection = function (title) {
    var labelCell = document.createElement('td');
    labelCell.innerHTML = title;
    labelCell.setAttribute('class', 'coinageLabel');
    return labelCell;
}

coinageSection.prototype.onCoinageChange = function (coinageData) {
    var totalValue = document.getElementById('total-coinage-value');
    var totalCoins = document.getElementById('Total Coins-input');
    var coinWeight = document.getElementById('coinage-weight');
    var totalCoinageContainer = document.getElementById('total-coinage-container');
    totalCoins.value = coinageData.count;
    coinWeight.value = coinageData.weight;
    totalValue.value = coinageData.goldValue;
    Utils.addCoinagePopupToElement(coinageData.copperValue, 'Copper', totalCoinageContainer);
}

coinageSection.prototype.setupCoinageFieldValuesAndListeners = function () {
    var coinageData = CoinageManager.getCoinageData(),
        self = this;
    _.each(Constants.coinage, function (coinageType) {
        self.setupCoinageField(coinageType.NAME, coinageData[coinageType.NAME]);
    });
    self.onCoinageChange(coinageData);
}

coinageSection.prototype.setupCoinageField = function (fieldId, value) {
    var inputField = document.getElementById(fieldId + '-input');
    inputField.value = value;
    inputField.addEventListener('input', _.partial(this.validateCoinageInput, fieldId));
}

coinageSection.prototype.validateCoinageInput = function (id) {
    var inputField = document.getElementById(id + '-input');
    var value = Utils.sanitiseNumberInput(inputField.value);
    inputField.value = value;
    CoinageManager.setValue(id, value);
}

module.exports = new coinageSection();