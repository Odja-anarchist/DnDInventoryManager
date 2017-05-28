var _ = require('lodash');
var shortid = require('shortid');

var EventHandler = require('../EventHandler');

var inventoryManager = function () {
	this.eventHandler = new EventHandler();
	_.bindAll(this, _.functionsIn(this));
	this.inventory = {};
	this.loadInventory();
}

inventoryManager.prototype.EVENTS = {
	INVENTORY_UPDATED: "INVENTORY_UPDATED"
}

inventoryManager.prototype.addUpdateListener = function (listener) {
	this.eventHandler.addListener(this.EVENTS.INVENTORY_UPDATED, listener);
}

inventoryManager.prototype.removeListener = function (listener) {
	this.eventHandler.removeListener(this.EVENTS.INVENTORY_UPDATED, listener);
}

inventoryManager.prototype.loadInventory = function () {
	var returnArray = {};
	for (var i = 0; i < localStorage.length; i++) {
		var key = localStorage.key(i);
		if (key.startsWith('INVENTORY-')) {
			var value = JSON.parse(localStorage.getItem(key));
			returnArray[value.id] = value;
		}
	}
	this.inventory = returnArray;
};

inventoryManager.prototype.getCarriedWeight = function () {
	var weight = 0;
	_.each(_.values(this.inventory), function (item) {
		weight += (item.count * item.baseWeight);
	});
	return weight;
}

inventoryManager.prototype.getItemCount = function () {
	var itemCount = 0;
	_.each(_.values(this.inventory), function (item) {
		itemCount += item.count;
	});
	return itemCount;
}

inventoryManager.prototype.getInventory = function () {
	return this.inventory;
}

inventoryManager.prototype.getItem = function (id) {
	return this.inventory[id];
}

inventoryManager.prototype.removeItem = function (id) {
	delete this.inventory[id];
	localStorage.removeItem('INVENTORY-' + id);
	this.eventHandler.fireEvent(this.EVENTS.INVENTORY_UPDATED);
}

inventoryManager.prototype.updateItem = function (item) {
	this.inventory[item.id] = item;
	localStorage['INVENTORY-' + item.id] = JSON.stringify(item);
	this.eventHandler.fireEvent(this.EVENTS.INVENTORY_UPDATED);
}

inventoryManager.prototype.addItem = function (item) {
	item.id = shortid.generate();
	this.inventory[item.id] = item;
	localStorage['INVENTORY-' + item.id] = JSON.stringify(item);
	this.eventHandler.fireEvent(this.EVENTS.INVENTORY_UPDATED);
}

module.exports = new inventoryManager();