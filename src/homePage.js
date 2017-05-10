(function () {
	var _ = require('lodash');

	var Utils = require('./Utils');
	var addItemPage = require('./addItemPage');
	var InventoryManager = require('./inventoryManager');

	var mainPageLayout = '<div class="homePage">' +
		'<h1>Inventory Manager</h1>' +
		'<div style="display: flex; align-items: center">' +
		'<span class="topBarLabel">Strength:</span><input class="form-control inputWidth" value="0" type="number" id="strength-input" min="0" max="20"></input>' +
		'<span class="topBarLabel">Carrying Capacity: </span>' +
		'<div class="input-group" style="width: 8em !important">' +
		'<input id="carry-capacity" class="form-control forceWhiteBackground" value="0" type="number" min="0" aria-describedby="basic-addon2" readonly="true"></input>' +
		'<span class="input-group-addon forceWhiteBackground" id="basic-addon2">lbs</span>' +
		'</div>' +
		'<span class="topBarLabel">Current: </span>' +
		'<div class="input-group" style="width: 8em !important">' +
		'<input id="current-weight" class="form-control" value="0" type="number" min="0" aria-describedby="basic-addon2" readonly="true"></input>' +
		'<span class="input-group-addon" id="current-weight-addon">lbs</span>' +
		'</div>' +
		'</div>' +
		'<hr/>' +
		'<button type="button" class="btn btn-default alert-success topButton" id="add-item-button">Add Item +</button>' +
		'<hr/>' +
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
		'</table>' +
		'</div>';

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
		var currentWeight = 0;
		var ids = Object.keys(inventory);
		for (var i = 0; i < ids.length; i++) {
			var inventoryItem = inventory[ids[i]];
			currentWeight += (inventoryItem.baseWeight * inventoryItem.count);
		}
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

	mainPage.show = function () {
		Utils.clearPage();
		var body = document.getElementById('body');
		body.innerHTML = mainPageLayout;
		updateInventory();
		generateTable();
		createBindings();
		setStrengthFromSavedValue();
		setCarryCapacityValue();
		setCurrentCapacityValue();
	};

	module.exports = mainPage;
})();