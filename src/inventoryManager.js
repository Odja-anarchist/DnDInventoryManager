var shortid = require('shortid');

var inventoryManager = {};

inventoryManager.getInventory = function () {
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

inventoryManager.setStrength = function(strength){
	localStorage['STRENGTH'] = strength;
}

inventoryManager.getStrength = function() {
	if (localStorage['STRENGTH']) {
		return localStorage['STRENGTH'];
	} else {
		return 0;
	}
}

inventoryManager.getItem = function (id) {
	return localStorage['INVENTORY-' + id];
}

inventoryManager.removeItem = function (id) {
	localStorage.removeItem('INVENTORY-' + id);
}

inventoryManager.updateItem = function (item) {
	localStorage['INVENTORY-' + item.id] = JSON.stringify(item);
}

inventoryManager.addItem = function (item) {
	item.id = shortid.generate();
	localStorage['INVENTORY-' + item.id] = JSON.stringify(item);
}

module.exports = inventoryManager;