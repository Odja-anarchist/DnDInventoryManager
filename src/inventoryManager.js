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

inventoryManager.setStrength = function (strength) {
	localStorage['STRENGTH'] = strength;
}

inventoryManager.getStrength = function () {
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

// ------------------
// Coinage Functions
// ------------------

function getCoinageKey(key) {
	if (localStorage[key]) {
		return localStorage[key];
	} else {
		return 0;
	}
}

inventoryManager.getPlatinum = function () {
	return getCoinageKey('COINAGE-PLATINUM');
}

inventoryManager.getGold = function () {
	return getCoinageKey('COINAGE-GOLD');
}

inventoryManager.getElectrum = function () {
	return getCoinageKey('COINAGE-ELECTRUM');
}

inventoryManager.getSilver = function () {
	return getCoinageKey('COINAGE-SILVER');
}

inventoryManager.getCopper = function () {
	return getCoinageKey('COINAGE-COPPER');
}

inventoryManager.setCoinageValue = function (type, value) {
	localStorage['COINAGE-' + type] = value;
}
module.exports = inventoryManager;