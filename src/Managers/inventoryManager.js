var _ = require('lodash');
var shortid = require('shortid');

var EventHandler = require('../EventHandler');

var inventoryManager = function () {
	this.eventHandler = new EventHandler();
	_.bindAll(this, _.functionsIn(this));
}

inventoryManager.prototype.getInventory = function () {
	var returnArray = {};
	for (var i = 0; i < localStorage.length; i++) {
		var key = localStorage.key(i);
		if (key.startsWith('INVENTORY-')) {
			var value = JSON.parse(localStorage.getItem(key));
			returnArray[value.id] = value;
		}
	}
	return returnArray;
};

inventoryManager.prototype.getItem = function (id) {
	return localStorage['INVENTORY-' + id];
}

inventoryManager.prototype.removeItem = function (id) {
	localStorage.removeItem('INVENTORY-' + id);
}

inventoryManager.prototype.updateItem = function (item) {
	localStorage['INVENTORY-' + item.id] = JSON.stringify(item);
}

inventoryManager.prototype.addItem = function (item) {
	item.id = shortid.generate();
	localStorage['INVENTORY-' + item.id] = JSON.stringify(item);
}

module.exports = new inventoryManager();