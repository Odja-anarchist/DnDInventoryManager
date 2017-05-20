var _ = require('lodash');

var TitleBar = require('../../Components/TitleBar');
var Button = require('../../Components/Button');
var Utils = require('../../Utils');
var Constants = require('../../Constants');
var CoinageManager = require('../../Managers/CoinageManager');
var CenterFloat = require('../../Components/CenterFloat');

var ConvertCoinage = function () {
    _.bindAll(this, _.functionsIn(this));
}


ConvertCoinage.prototype.showInside = function (contentDiv, eventListener, titles) {
    this.types = titles;
    this.parentEventListener = eventListener;
    this.createHeaderBar(contentDiv);
    this.createValueSection(contentDiv);
}

ConvertCoinage.prototype.createHeaderBar = function (contentDiv) {
    var acceptButton = new Button({
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
        title: 'Convert Coinage',
        type: TitleBar.TYPES.SUB_TITLE,
        rightButton: acceptButton,
        leftButton: cancelButton
    }).getElement());
}

ConvertCoinage.prototype.getRange = function () {
    var value1 = CoinageManager.getValue(this.types[0]),
        value2 = CoinageManager.getValue(this.types[1]);
    var ratio = this.getRatio();

    var valueInLowest = (ratio * value1) + value2;
    return Math.floor(valueInLowest / ratio);
}

ConvertCoinage.prototype.getRatio = function () {
    var val1Multiplier = this.getMultiplier(this.types[0]),
        val2Multiplier = this.getMultiplier(this.types[1]);
    return val1Multiplier / val2Multiplier;
}

ConvertCoinage.prototype.getMultiplier = function (title) {
    var multiplier = 1;
    _.each(Constants.coinage, function (coinageValue) {
        if (coinageValue.NAME === title) {
            multiplier = coinageValue.COPPER_VALUE;
        }
    });
    return multiplier;
}

ConvertCoinage.prototype.createValueSection = function (contentDiv, ) {
    var value1 = CoinageManager.getValue(this.types[0]);
    var value2 = CoinageManager.getValue(this.types[1]);
    var topDiv = document.createElement('div');
    topDiv.setAttribute('class', 'convertCoinageValues');
    topDiv.innerHTML = '<span>' + this.types[0] + ':</span>' +
        '<input class="form-control coinageInput forceWhiteBackground" style="margin: 5px;" value="' + value1 + '" type="number" id="a-input" readonly="true"></input>' +
        '<span>' + this.types[1] + ':</span>' +
        '<input class="form-control coinageInput forceWhiteBackground" style="margin: 5px;" value="' + value2 + '" type="number" id="b-input" readonly="true"></input>';
    var valuesCenter = new CenterFloat(topDiv);
    contentDiv.appendChild(valuesCenter.getElement());

    var inputElement = document.createElement('input');
    inputElement.setAttribute('type', 'range');
    inputElement.setAttribute('id', 'rangeSelector');
    inputElement.setAttribute('min', '0');
    inputElement.setAttribute('max', this.getRange());
    inputElement.setAttribute('value', value1);
    inputElement.addEventListener('input', this.recalcValues)

    var convertDiv = document.createElement('div');
    convertDiv.setAttribute('class', 'convertCoinageInput');
    convertDiv.innerHTML = this.types[0] + '<i class="fa fa-arrow-left" aria-hidden="true"></i>';
    convertDiv.appendChild(inputElement);
    convertDiv.insertAdjacentHTML('beforeEnd', '<i class="fa fa-arrow-right" aria-hidden="true"></i>' + this.types[1]);
    contentDiv.appendChild(convertDiv);
}

ConvertCoinage.prototype.recalcValues = function () {
    var rangeSelector = document.getElementById('rangeSelector');
    var aInput = document.getElementById('a-input');
    var bInput = document.getElementById('b-input');
    var val = rangeSelector.value;

    var value1 = CoinageManager.getValue(this.types[0]),
        value2 = CoinageManager.getValue(this.types[1]);
    var ratio = this.getRatio();
    var valueInLowest = (ratio * value1) + value2;

    var leftOver = valueInLowest - (val * ratio);

    aInput.value = val;
    bInput.value = leftOver
}

ConvertCoinage.prototype.hide = function () {
}

ConvertCoinage.prototype.onAcceptTap = function () {
    var aInput = document.getElementById('a-input');
    var bInput = document.getElementById('b-input');

    CoinageManager.setValue(this.types[0], parseInt(aInput.value));
    CoinageManager.setValue(this.types[1], parseInt(bInput.value));
    this.goBack()
}

ConvertCoinage.prototype.onCancelTap = function () {
    this.goBack()
}

ConvertCoinage.prototype.goBack = function () {
    this.parentEventListener.fireEvent(Constants.inventoryPageActions.RESET);
}


module.exports = new ConvertCoinage();