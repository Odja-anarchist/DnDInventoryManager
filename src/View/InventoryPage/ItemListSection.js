var _ = require('lodash');

var TitleBar = require('../../Components/TitleBar');
var Button = require('../../Components/Button');
var EventHandler = require('../../EventHandler');
var Utils = require('../../Utils');
var InventoryManager = require('../../Managers/inventoryManager');
var Constants = require('../../Constants');
var PopupActionMenu = require('../../Components/PopupActionMenu');
var InventoryItem = require('../../Components/InventoryItem');

var itemListLayout = '<div class="itemList" id="itemList"></div>';

var ItemListSection = function () {
    _.bindAll(this, _.functionsIn(this));
};

ItemListSection.prototype.EVENTS = {
    ADD_EDIT: "ADD_EDIT"
}

ItemListSection.prototype.showInside = function (contentDiv, eventListener) {
    this.parentEventListener = eventListener;
    this.setupEventListener();
    this.inventory = InventoryManager.getInventory();
    this.createUI(contentDiv);
    this.generateTable();
    $(".inventoryCountInput").keypress(function (e) {
        if (e.which < 48 || e.which > 57) {
            return (false);
        }
    });
}

ItemListSection.prototype.setupEventListener = function () {
    this.EventHandler = new EventHandler(_.values(Constants.itemListAction));
    this.EventHandler.addListener(Constants.itemListAction.DELETE, this.onDeleteItemPressed);
    this.EventHandler.addListener(Constants.itemListAction.EDIT, this.onEditItemPressed);
}

ItemListSection.prototype.onDeleteItemPressed = function (itemId) {
    var parent = document.getElementById("itemList");
    var child = document.getElementById('itemContainer-' + itemId);
    parent.removeChild(child);
    delete this.inventory[itemId];
    InventoryManager.removeItem(itemId);
}

ItemListSection.prototype.onEditItemPressed = function (itemId) {
    var element = this.inventory[itemId];
    this.parentEventListener.fireEvent(Constants.inventoryPageActions.ADD_EDIT_ITEM, element);
}

ItemListSection.prototype.generateTable = function () {
    var itemListLayout = document.getElementById("itemList"),
        self = this;
    _.each(_.values(this.inventory), function (inventoryItem) {
        self.constructRow(inventoryItem, itemListLayout);
    });
}

ItemListSection.prototype.constructRow = function (element, itemListLayout) {
    var item = new InventoryItem(element, this.EventHandler);
    itemListLayout.appendChild(item.getElement());
}

ItemListSection.prototype.onInventoryUpdate = function () {
    var carriedWeight = document.getElementById('carried-weight');
    var carriedItems = document.getElementById('carried-items');

    carriedWeight.value = InventoryManager.getCarriedWeight();
    carriedItems.value = InventoryManager.getItemCount();
}

ItemListSection.prototype.hide = function () {
    InventoryManager.removeListener(this.onInventoryUpdate);
}

ItemListSection.prototype.setupInventoryListeners = function () {
    InventoryManager.addUpdateListener(this.onInventoryUpdate);
}

var topUI = '<div class="itemListHeader">' +
    '<span class="topBarLabel">Total Carried Weight: </span>' +
    '<div class="input-group" style="width: 8em !important">' +
    '<input id="carried-weight" class="form-control forceWhiteBackground" value="0" type="number" min="0" aria-describedby="basic-addon2" readonly="true"></input>' +
    '<span class="input-group-addon forceWhiteBackground">lbs</span>' +
    '</div>' +
    '<span class="topBarLabel">Total number of items: </span>' +
    '<input id="carried-items" class="form-control forceWhiteBackground" value="0" style="width: 6em" type="number" readonly="true"></input>' +
    '</div>';

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

    contentDiv.insertAdjacentHTML('beforeEnd', topUI);
    this.setupInventoryListeners();
    this.onInventoryUpdate();
    contentDiv.insertAdjacentHTML('beforeEnd', itemListLayout);
}

ItemListSection.prototype.onAddItemTap = function () {
    this.parentEventListener.fireEvent(Constants.inventoryPageActions.ADD_EDIT_ITEM);
}

module.exports = new ItemListSection();