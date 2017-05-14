var _ = require('lodash');

var TitleBar = require('../../Components/TitleBar');
var Button = require('../../Components/Button');
var EventHandler = require('../../EventHandler');
var Utils = require('../../Utils');
var InventoryManager = require('../../Managers/inventoryManager');
var Constants = require('../../Constants');

var itemListLayout = '<table class="table table-hover">' +
    '<thead>' +
    '<tr>' +
    '<th width="10%">Count</th>' +
    '<th width="50%">Name</th>' +
    '<th width="10%">Location</th>' +
    '<th width="10%">Weight</th>' +
    '<th width="10%">Value</th>' +
    '<th width="10%">Actions</th>' +
    '</tr>' +
    '</thead>' +
    '<tbody id="inventoryTable">' +
    '</tbody>' +
    '</table>';

var ItemListSection = function () {
    _.bindAll(this, _.functionsIn(this));
};

ItemListSection.prototype.EVENTS = {
    ADD_EDIT: "ADD_EDIT"
}

ItemListSection.prototype.showInside = function (contentDiv, eventListener) {
    this.parentEventListener = eventListener;
    this.createUI(contentDiv);
    this.inventory = InventoryManager.getInventory();
    this.generateTable();
    // this.createBindings();
}

ItemListSection.prototype.generateTable = function () {
    var tbodyElement = document.getElementById("inventoryTable"),
        self = this;
    _.each(_.values(this.inventory), function (inventoryItem) {
        self.constructRow(inventoryItem, tbodyElement);
    });
}

ItemListSection.prototype.constructRow = function (element, tbodyElement) {
    var row = tbodyElement.insertRow(tbodyElement.rows.length);
    row.setAttribute('name', 'item' + element.id);

    var countCell = row.insertCell();
    countCell.innerHTML = '<input class="form-control" type="number" itemTarget="' + element.id + '" name="count-item' + element.id + '" id="example-number-input" min="0"></input>';
    countCell.setAttribute('class', 'count');
    document.getElementsByName("count-item" + element.id)[0].addEventListener('change', this.onCountChange);

    var nameCell = row.insertCell();
    nameCell.setAttribute('class', 'expand center');
    nameCell.setAttribute('name', 'name-item' + element.id);
    nameCell.innerHTML = '<a style="font-weight: bold;" data-toggle="tooltip" title="" id="name-element-' + element.id + '"></a>';

    var locationCell = row.insertCell();
    locationCell.setAttribute('class', 'location');
    locationCell.innerHTML = '<input list="browsers" itemTarget="' + element.id + '" name="location-item' + element.id + '" class="form-control"></input>';
    document.getElementsByName("location-item" + element.id)[0].addEventListener('change', this.onLocationChange);

    var weightCell = row.insertCell();
    weightCell.setAttribute('class', 'shrink center');
    weightCell.setAttribute('name', 'weight-item' + element.id);

    var valueCell = row.insertCell();
    valueCell.setAttribute('class', 'shrink center');
    valueCell.setAttribute('name', 'value-item' + element.id);
    valueCell.innerHTML = '<a style="font-weight: bold;" data-toggle="tooltip" title="" id="value-total-' + element.id + '">0  GP</a>' +
        ' (<a style="font-weight: bold;" data-toggle="tooltip" title="" id="value-single-' + element.id + '">0  GP</a>)';

    var actionCell = row.insertCell();
    actionCell.setAttribute('class', 'shrink end');
    actionCell.innerHTML = '<div>' +
        '<button type="button" class="btn btn-default glyphicon glyphicon-remove icon alert-danger remove-button" data-toggle="confirmation" itemTarget="' + element.id + '" name="delete-item' + element.id + '"></button>' +
        '<button type="button" class="btn btn-default glyphicon glyphicon-pencil icon alert-info" itemTarget="' + element.id + '" name="edit-item' + element.id + '"></button>' +
        '</div>';
    //document.getElementsByName("edit-item" + element.id)[0].addEventListener('click', this.editPressed);
    // var appliedFunction = _.partial(this.deletePressed, element.id);
    // $('[data-toggle=confirmation]').confirmation({
    //     rootSelector: '[data-toggle=confirmation]',
    //     onConfirm: appliedFunction
    // });
    this.populateRow(element.id);
}

ItemListSection.prototype.getItem = function (id) {
    return this.inventory[id];
}

ItemListSection.prototype.populateRow = function (elementId) {
    var countInput = document.getElementsByName("count-item" + elementId)[0];
    var name = document.getElementById("name-element-" + elementId);
    var location = document.getElementsByName("location-item" + elementId)[0];
    var weight = document.getElementsByName("weight-item" + elementId)[0];
    var totalValue = document.getElementById("value-total-" + elementId);
    var singleValue = document.getElementById("value-single-" + elementId);

    var inventoryItem = this.getItem(elementId);
    var valueType = Utils.convertValueLongToShortCode(inventoryItem.baseValueType);

    countInput.value = inventoryItem.count;
    name.innerHTML = inventoryItem.name;
    weight.innerHTML = (inventoryItem.baseWeight * inventoryItem.count).toFixed(2) + ' lbs (' + inventoryItem.baseWeight + 'lbs)';
    location.value = inventoryItem.location;
    totalValue.innerHTML = (inventoryItem.baseValue * inventoryItem.count) + " " + valueType;
    singleValue.innerHTML = inventoryItem.baseValue + ' ' + valueType;
    // totalValue.setAttribute('data-original-title', this.convertToVariousCoinageValues((inventoryItem.baseValue * inventoryItem.count), valueType));
    // totalValue.setAttribute('title', this.convertToVariousCoinageValues((inventoryItem.baseValue * inventoryItem.count), valueType));

    // singleValue.setAttribute('data-original-title', this.convertToVariousCoinageValues(inventoryItem.baseValue, valueType));
    // singleValue.setAttribute('title', this.convertToVariousCoinageValues(inventoryItem.baseValue, valueType));

    // name.setAttribute('data-original-title', inventoryItem.description);
    // name.setAttribute('title', inventoryItem.description);
}

ItemListSection.prototype.hide = function () {
}

ItemListSection.prototype.createUI = function (contentDiv) {
    var addItemButton = new Button({
        title: 'Add Item',
        icon: 'fa-plus-circle',
        listener: this.onAddItemTap
    });
    contentDiv.appendChild(new TitleBar({
        title: 'Items',
        type: TitleBar.TYPES.SUB_TITLE,
        rightButton: addItemButton
    }).getElement());
    contentDiv.insertAdjacentHTML('beforeEnd', itemListLayout);
}

ItemListSection.prototype.onAddItemTap = function () {
    this.parentEventListener.fireEvent(Constants.inventoryPageActions.ADD_EDIT_ITEM);
}

module.exports = new ItemListSection();