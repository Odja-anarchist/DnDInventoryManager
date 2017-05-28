var _ = require('lodash');

var PopupActionMenu = require('./PopupActionMenu');
var Utils = require('../Utils');
var Constants = require('../Constants');
var InventoryManager = require('../Managers/inventoryManager');

var InventoryItem = function (element, parentEventHandler) {
    this.item = element;
    this.id = element.id;
    this.eventHandler = parentEventHandler;
    _.bindAll(this, _.functionsIn(this));
}

InventoryItem.prototype.recalculateProperties = function () {
    if (!this.element) {
        return;
    }
    var weightField = this.element.getElementsByClassName('weightDescription')[0];
    var valueField = this.element.getElementsByClassName('valueContainer')[0];

    var totalWeight = this.item.baseWeight * this.item.count;
    var totalValue = this.item.baseValue * this.item.count;

    weightField.innerHTML = totalWeight + ' lbs (' + this.item.baseWeight + ' lbs)';
    valueField.innerHTML = totalValue + ' ' + Utils.convertValueLongToShortCode(this.item.baseValueType) +
        ' (' + this.item.baseValue + ' ' + Utils.convertValueLongToShortCode(this.item.baseValueType) + ')';
}

InventoryItem.prototype.onCountChange = function () {
    var inputField = document.getElementById('countInput-' + this.id);
    var value = Utils.sanitiseNumberInput(inputField.value, 999, 0);
    inputField.value = value;
    this.item.count = value;
    this.recalculateProperties();
    InventoryManager.updateItem(this.item);
}

InventoryItem.prototype.onDeletePressed = function () {
    this.eventHandler.fireEvent(Constants.itemListAction.DELETE, this.id);
}

InventoryItem.prototype.onEditPressed = function () {
    this.eventHandler.fireEvent(Constants.itemListAction.EDIT, this.id);
}

InventoryItem.prototype.getElement = function () {
    var itemDiv = document.createElement('div');
    itemDiv.setAttribute('class', 'itemContainer');
    itemDiv.setAttribute('id', 'itemContainer-' + this.id);

    var countDiv = document.createElement('div');
    countDiv.setAttribute('class', 'itemCount');

    var countDivInput = document.createElement('input');
    countDivInput.setAttribute('class', 'form-control inventoryCountInput');
    countDivInput.setAttribute('type', 'number');
    countDivInput.setAttribute('min', '0');
    countDivInput.setAttribute('max', '999');
    countDivInput.setAttribute('id', 'countInput-' + this.id);
    countDivInput.value = this.item.count;
    countDivInput.addEventListener('input', this.onCountChange);

    countDiv.appendChild(countDivInput);
    itemDiv.appendChild(countDiv);

    var nameContainer = document.createElement('div');
    nameContainer.setAttribute('class', 'nameContainer');

    var nameDiv = document.createElement('div');
    nameDiv.setAttribute('class', 'itemName');
    nameDiv.innerHTML = this.item.name;

    var descriptionDiv = document.createElement('div');
    descriptionDiv.setAttribute('class', 'itemDescription');
    descriptionDiv.innerHTML = this.item.description;

    nameContainer.appendChild(nameDiv);
    nameContainer.appendChild(descriptionDiv);
    itemDiv.appendChild(nameContainer);

    var weightDiv = document.createElement('div');
    weightDiv.setAttribute('class', 'weightDescription');
    weightDiv.setAttribute('id', 'weight-' + this.id);

    var valueDiv = document.createElement('div');
    valueDiv.setAttribute('class', 'valueContainer');
    valueDiv.setAttribute('id', 'value-' + this.id);

    var propertiesContainer = document.createElement('div');
    propertiesContainer.setAttribute('class', 'propertiesContainer');
    propertiesContainer.appendChild(weightDiv);
    propertiesContainer.appendChild(valueDiv);

    itemDiv.appendChild(propertiesContainer);

    var popupMenu = new PopupActionMenu({
        title: "Actions",
        buttons: [
            //{ title: 'Move', icon: 'fa-arrows' },
            { title: 'Edit', icon: 'fa-pencil', listener: this.onEditPressed },
            //{ title: 'Sell', icon: 'fa-arrow-up' },
            //{ title: 'Buy', icon: 'fa-arrow-down' },
            { title: 'Delete', icon: 'fa-trash-o', listener: this.onDeletePressed }
        ]
    });
    itemDiv.appendChild(popupMenu.getElement());
    this.element = itemDiv;
    this.recalculateProperties();
    return itemDiv;
}

module.exports = InventoryItem;