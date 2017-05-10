(function () {
	var _ = require('lodash');
	var pack = require('../package.json');

	var Utils = require('./Utils');
	var addItemPage = require('./addItemPage');
	var InventoryManager = require('./inventoryManager');

	var headerLayout = '<h1 style="display: inline-block;">Inventory Manager</h1> v' + pack.version +
		'<div style="display: flex; align-items: center">' +
		'<span class="topBarLabel">Strength:</span><input class="form-control inputWidth" value="0" type="number" id="strength-input" min="0" max="20"></input>' +
		'<span class="topBarLabel">Carrying Capacity: </span>' +
		'<div class="input-group" style="width: 8em !important; margin-right: 20px;">' +
		'<input id="carry-capacity" class="form-control forceWhiteBackground" value="0" type="number" min="0" aria-describedby="basic-addon2" readonly="true"></input>' +
		'<span class="input-group-addon forceWhiteBackground" id="basic-addon2">lbs</span>' +
		'</div>' +
		'<span class="topBarLabel">Current: </span>' +
		'<div class="input-group" style="width: 10em !important">' +
		'<input id="current-weight" class="form-control" value="0" type="number" min="0" aria-describedby="basic-addon2" readonly="true"></input>' +
		'<span class="input-group-addon" id="current-weight-addon">lbs</span>' +
		'</div>' +
		'</div>' +
		'<hr/>';

	var coinageLayout = '<h3 style="padding: 5px;padding-right: 10px;">Coinage</h3>' +
		'<table class="table">' +
		'<tbody>' +

		'<tr>' +
		'<td class="coinageLabel">' +
		'Platinum' +
		'</td>' +
		'<td>' +
		'<input class="form-control coinageInput" value="0" type="number" id="PLATINUM-input" min="0" max="999999999"></input>' +
		'</td>' +

		'<td class="coinageLabel">' +
		'Silver' +
		'</td>' +
		'<td>' +
		'<input class="form-control coinageInput" value="0" type="number" id="SILVER-input" min="0" max="999999"></input>' +
		'</td>' +

		'<td class="coinageLabel">' +
		'Total Value' +
		'</td>' +
		'<td>' +
		'<div class="input-group" style="width: 8em !important">' +
		'<input id="total-coinage-value" class="form-control forceWhiteBackground" value="0" type="text" aria-describedby="basic-addon2" readonly="true"></input>' +
		'<span class="input-group-addon forceWhiteBackground" id="basic-addon2">GP</span>' +
		'</div>' +
		'</td>' +
		'</tr>' +

		'<tr>' +
		'<td class="coinageLabel">' +
		'Gold' +
		'</td>' +
		'<td>' +
		'<input class="form-control coinageInput" value="0" type="number" id="GOLD-input" min="0" max="999999"></input>' +
		'</td>' +

		'<td class="coinageLabel">' +
		'Copper' +
		'</td>' +
		'<td>' +
		'<input class="form-control coinageInput" value="0" type="number" id="COPPER-input" min="0" max="999999"></input>' +
		'</td>' +

		'<td class="coinageLabel">' +
		'Total Coins' +
		'</td>' +
		'<td>' +
		'<input class="form-control coinageInput forceWhiteBackground" value="0" type="number" id="total-coinage-ammount" min="0" max="999999" readonly="true"></input>' +
		'</td>' +
		'</tr>' +

		'<tr>' +
		'<td class="coinageLabel">' +
		'Electrum' +
		'</td>' +
		'<td>' +
		'<input class="form-control coinageInput" value="0" type="number" id="ELECTRUM-input" min="0" max="999999"></input>' +
		'</td>' +

		'<td>' +
		'</td>' +
		'<td>' +
		'</td>' +

		'<td class="coinageLabel">' +
		'Weight' +
		'</td>' +
		'<td>' +
		'<div class="input-group" style="width: 8em !important">' +
		'<input id="coinage-weight" class="form-control forceWhiteBackground" value="0" type="text" aria-describedby="basic-addon2" readonly="true"></input>' +
		'<span class="input-group-addon forceWhiteBackground" id="basic-addon2">lbs</span>' +
		'</div>' +
		'</td>' +
		'</tr>' +

		'</tbody>' +
		'</table>' +
		'<hr/>';

	var inventoryLayout = '<h3 style="display:-webkit-inline-box;padding: 5px;padding-right: 10px;">Inventory</h3>' +
		'<button type="button" class="btn btn-default alert-success topButton" id="add-item-button">Add Item +</button>' +
		'<table class="table table-hover">' +
		'<thead>' +
		' <tr>' +
		'<th class="shrink">Count</th>' +
		'<th class="expand center">Name</th>' +
		'<th class="shrink center">Location</th>' +
		'<th class="shrink center">Weight</th>' +
		'<th class="shrink center">Value</th>' +
		'<th class="shrink end">Actions</th>' +
		' </tr>' +
		'</thead>' +
		'<tbody name="inventoryTable">' +
		'</tbody>' +
		'</table>';

	var pageLayout = '<div class="homePage">' + headerLayout + coinageLayout + inventoryLayout + '</div>';

	var mainPage = {};

	var inventory = {};

	function getItem(id) {
		return inventory[id];
	}

	function generateTable() {
		var tbodyElement = document.getElementsByName("inventoryTable")[0];
		var ids = Object.keys(inventory);
		for (var i = 0; i < ids.length; i++) {
			constructRow(inventory[ids[i]], tbodyElement);
		}
	}

	function onCountChange() {
		var id = this.getAttribute('itemTarget');
		var inventoryItem = getItem(id);
		if (this.value < 0) {
			this.value = 0;
		}
		inventoryItem.count = this.value;
		InventoryManager.updateItem(inventoryItem);
		populateRow(id);
		setCurrentCapacityValue();
	}

	function onLocationChange() {
		var id = this.getAttribute('itemTarget');
		var inventoryItem = getItem(id);
		inventoryItem.location = this.value;
		InventoryManager.updateItem(inventoryItem);
	}

	function deletePressed() {
		if (!confirm("Are you sure you want to delete this item?")) {
			return;
		}
		var id = this.getAttribute('itemTarget');
		var tBodyElement = document.getElementsByName("inventoryTable")[0];
		var rowIndex = document.getElementsByName("item" + id)[0].rowIndex - 1;
		tBodyElement.deleteRow(rowIndex);
		delete inventory[id];
		InventoryManager.removeItem(id);
		setCurrentCapacityValue();
	}

	function editPressed() {}

	function populateRow(elementId) {
		var countInput = document.getElementsByName("count-item" + elementId)[0];
		var name = document.getElementsByName("name-item" + elementId)[0];
		var location = document.getElementsByName("location-item" + elementId)[0];
		var weight = document.getElementsByName("weight-item" + elementId)[0];
		var value = document.getElementsByName("value-item" + elementId)[0];

		var inventoryItem = getItem(elementId);
		var valueType = Utils.convertValueLongToShortCode(inventoryItem.baseValueType);

		countInput.value = inventoryItem.count;
		name.innerHTML = inventoryItem.name;
		weight.innerHTML = (inventoryItem.baseWeight * inventoryItem.count) + ' lbs (' + inventoryItem.baseWeight + ' lbs each)';
		value.innerHTML = (inventoryItem.baseValue * inventoryItem.count) + ' ' + valueType + ' (' + inventoryItem.baseValue + ' ' + valueType + ' each)';
		location.value = inventoryItem.location;
	}

	function addItemCancelPressed() {
		createMainPage();
	}

	function createItem() {
		addItemPage.show();
	}

	function getCurrentMaxCapacity() {
		var strengthInput = document.getElementById('strength-input');
		return strengthInput.value * 15;
	}

	function setCarryCapacityValue() {
		var strengthInput = document.getElementById('strength-input');
		var carryCapacity = document.getElementById('carry-capacity');
		var currentStrength = strengthInput.value;
		if (currentStrength < 0 || currentStrength > 20) {
			currentStrength = 0;
		}
		strengthInput.value = currentStrength;
		carryCapacity.value = currentStrength * 15;
		setCurrentCapacityValue();
		InventoryManager.setStrength(currentStrength);
	}

	function setCurrentCapacityValue() {
		calculateTotalCoinageValues();
		var coinWeight = parseFloat(document.getElementById('coinage-weight').value);
		var currentWeight = 0;
		var ids = Object.keys(inventory);
		for (var i = 0; i < ids.length; i++) {
			var inventoryItem = inventory[ids[i]];
			currentWeight += (inventoryItem.baseWeight * inventoryItem.count);
		}
		currentWeight += coinWeight;
		var currentCapacity = document.getElementById('current-weight');
		var currentCapacityLabel = document.getElementById("current-weight-addon");
		currentCapacity.value = currentWeight;

		if (getCurrentMaxCapacity() < currentWeight) {
			currentCapacity.setAttribute("class", "form-control incorrectWeight");
			currentCapacityLabel.setAttribute("class", "input-group-addon incorrectWeight");
		} else {
			currentCapacity.setAttribute("class", "form-control correctWeight");
			currentCapacityLabel.setAttribute("class", "input-group-addon correctWeight");
		}
	}

	function constructRow(element, tbodyElement) {
		var row = tbodyElement.insertRow(tbodyElement.rows.length);
		row.setAttribute('name', 'item' + element.id);

		var countCell = row.insertCell();
		countCell.innerHTML = '<input class="form-control" type="number" itemTarget="' + element.id + '" name="count-item' + element.id + '" id="example-number-input" min="0"></input>';
		countCell.setAttribute('class', 'count');
		document.getElementsByName("count-item" + element.id)[0].addEventListener('change', onCountChange);

		var nameCell = row.insertCell();
		nameCell.setAttribute('class', 'expand center');
		nameCell.setAttribute('name', 'name-item' + element.id);

		var locationCell = row.insertCell();
		locationCell.setAttribute('class', 'location');
		locationCell.innerHTML = '<input list="browsers" itemTarget="' + element.id + '" name="location-item' + element.id + '" class="form-control"></input>';
		document.getElementsByName("location-item" + element.id)[0].addEventListener('change', onLocationChange);

		var weightCell = row.insertCell();
		weightCell.setAttribute('class', 'shrink center');
		weightCell.setAttribute('name', 'weight-item' + element.id);

		var valueCell = row.insertCell();
		valueCell.setAttribute('class', 'shrink center');
		valueCell.setAttribute('name', 'value-item' + element.id);

		var actionCell = row.insertCell();
		actionCell.setAttribute('class', 'shrink end');
		actionCell.innerHTML = '<div>' +
			'<button type="button" class="btn btn-default glyphicon glyphicon-remove icon alert-danger remove-button" itemTarget="' + element.id + '" name="delete-item' + element.id + '"></button>' +
			'<button type="button" class="btn btn-default glyphicon glyphicon-pencil icon alert-info" itemTarget="' + element.id + '" name="edit-item' + element.id + '"></button>' +
			'</div>';

		document.getElementsByName("delete-item" + element.id)[0].addEventListener('click', deletePressed);
		document.getElementsByName("edit-item" + element.id)[0].addEventListener('click', editPressed);

		populateRow(element.id);
	}
	function createBindings() {
		document.getElementById("add-item-button").addEventListener('click', createItem);
		document.getElementById('strength-input').addEventListener('change', setCarryCapacityValue);
	}

	function updateInventory() {
		inventory = InventoryManager.getInventory();
	}

	function setStrengthFromSavedValue() {
		var strengthInput = document.getElementById('strength-input');
		strengthInput.value = InventoryManager.getStrength();
	}

	function coinageChangeListener() {
		var value = this.value;
		if (value < 0) {
			value = 0;
		} else if (value > 999999999) {
			value = 999999999;
		}
		this.value = value;

		var id = this.getAttribute('id');
		var type = id.substring(0, id.indexOf('-'));
		InventoryManager.setCoinageValue(type, value);
		setCurrentCapacityValue();
	}

	function calculateTotalCoinageValues() {
		var platinum = parseInt(document.getElementById('PLATINUM-input').value);
		var gold = parseInt(document.getElementById('GOLD-input').value);
		var electrum = parseInt(document.getElementById('ELECTRUM-input').value);
		var silver = parseInt(document.getElementById('SILVER-input').value);
		var copper = parseInt(document.getElementById('COPPER-input').value);

		var totalValue = document.getElementById('total-coinage-value');
		var totalCoins = document.getElementById('total-coinage-ammount');
		var coinWeight = document.getElementById('coinage-weight');

		var totalValueInCopper = (platinum * 1000) + (gold * 100) + (electrum * 50) + (silver * 10) + copper;
		var totalValueInGold = '~' + (totalValueInCopper / 100).toFixed(0);
		var totalNumberOfCoins = platinum + gold + electrum + silver + copper;

		totalValue.value = totalValueInGold;
		totalCoins.value = totalNumberOfCoins;
		coinWeight.value = totalNumberOfCoins / 50;

	}

	function setCoinageValuesFromSavedValuesAndAddListeners() {
		var platinumInput = document.getElementById('PLATINUM-input');
		var goldInput = document.getElementById('GOLD-input');
		var electrumInput = document.getElementById('ELECTRUM-input');
		var silverInput = document.getElementById('SILVER-input');
		var copperInput = document.getElementById('COPPER-input');

		platinumInput.value = InventoryManager.getPlatinum();
		goldInput.value = InventoryManager.getGold();
		electrumInput.value = InventoryManager.getElectrum();
		silverInput.value = InventoryManager.getSilver();
		copperInput.value = InventoryManager.getCopper();

		platinumInput.addEventListener('change', coinageChangeListener);
		goldInput.addEventListener('change', coinageChangeListener);
		electrumInput.addEventListener('change', coinageChangeListener);
		silverInput.addEventListener('change', coinageChangeListener);
		copperInput.addEventListener('change', coinageChangeListener);
	}

	mainPage.show = function () {
		Utils.clearPage();
		var body = document.getElementById('body');
		body.innerHTML = pageLayout;
		updateInventory();
		generateTable();
		createBindings();
		setStrengthFromSavedValue();
		setCoinageValuesFromSavedValuesAndAddListeners();
		setCarryCapacityValue();
		setCurrentCapacityValue();
		calculateTotalCoinageValues();
	};

	module.exports = mainPage;
})();