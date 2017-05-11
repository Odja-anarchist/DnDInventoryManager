(function () {
	var _ = require('lodash');

	var Utils = require('./Utils');
	var TemplateManager = require('./templateManager');
	var InventoryManager = require('./inventoryManager');

	var addItemLayout = '<div class="addItemPage">' +
		'<h1>Add item</h1>' +
		'<hr/>' +
		'<button type="button" class="btn btn-default alert-danger topButton" id="cancel-button">Cancel</button>' +
		'<button type="button" class="btn btn-default alert-success topButton" id="add-button">Add +</button>' +
		'<hr/>' +
		'<TEMPLATE>' +
		'<hr/>' +
		'</br>' +
		'<table>' +
		'<tr>' +
		'<td class="addItemCell">Name:</td>' +
		'<td class="addItemCell" colspan=2><input id="name-input" class="form-control" type="text"></input></td>' +
		'</tr>' +
		'<tr>' +
		'<td class="addItemCell">Weight:</td>' +
		'<td class="addItemCell" colspan=2>' +
		'<div class="input-group">' +
		'<input id="weight-input" class="form-control" value="0" type="number" min="0" aria-describedby="basic-addon2"></input>' +
		'<span class="input-group-addon" id="basic-addon2">lbs</span>' +
		'</div>' +
		'</td>' +
		'</tr>' +
		'<tr>' +
		'<td class="addItemCell">Value:</td>' +
		'<td class="addItemCell">' +
		'<div class="input-group">' +
		'<input type="number" id="value-input" value="0" class="form-control" aria-label="..." min="0">' +
		'<div class="input-group-btn">' +
		'<button type="button" id="value-type-input" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Gold <span class="caret"></span></button>' +
		'<ul class="dropdown-menu dropdown-menu-right">' +
		'<li><a href="#" id="platinum-type">Platinum</a></li>' +
		'<li><a href="#" id="gold-type">Gold</a></li>' +
		'<li><a href="#" id="electrum-type">Electrum</a></li>' +
		'<li><a href="#" id="silver-type">Silver</a></li>' +
		'<li><a href="#" id="copper-type">Copper</a></li>' +
		'</ul>' +
		' </div>' +
		'</div>' +
		'</td>' +
		'</tr>' +
		'</table>' +
		'</div>';

	var addItemPage = {};

	function backToHomeScreen() {
		var homePage = require('./homePage');
		homePage.show();
	}

	function getCurrentValueType() {
		var val = document.getElementById('value-type-input').innerHTML;
		return val.substring(0, val.indexOf(' '))
	}

	function addItem() {
		var name = document.getElementById('name-input').value;
		var weight = document.getElementById('weight-input').value;
		var value = document.getElementById('value-input').value;
		var valueType = getCurrentValueType();

		if (name == '') {
			alert('Name cannot be blank');
			return;
		}
		var item = {
			count: 1,
			name: name,
			baseWeight: weight,
			baseValue: value,
			baseValueType: valueType,
			location: '',
		}
		InventoryManager.addItem(item);
		backToHomeScreen();
	}

	function createTemplateDropDown(templates) {
		var templateString = '<span class="template-title">Template:</span>' +
			'<select class="js-example-basic-single">';

		var categories = Object.keys(templates);
		_.each(categories, function (categoryTitle) {
			var category = templates[categoryTitle];
			templateString += '<optgroup label="' + categoryTitle + '">';
			_.each(category, function (template) {
				templateString += '<option value="' + template.id + '">' + template.name + '</option>';
			});
			templateString += '</optgroup>';
		});
		templateString += '</select>';
		return templateString;
	}

	function onTemplateChange() {
		var template = TemplateManager.getTemplate(this.value);
	}

	function addTemplateChangeListener() {
		$(".js-example-basic-single").select2({
			placeholder: "Select template item",
			allowClear: true
		});
		$(".js-example-basic-single").val(null).trigger("change");
		$(".js-example-basic-single").on("select2:select", function (e) {
			var template = TemplateManager.getTemplate(this.value);
			document.getElementById('name-input').value = template.name;
			document.getElementById('weight-input').value = template.weight;
			document.getElementById('value-input').value = template.value.num;
			document.getElementById('value-type-input').innerHTML = Utils.convertValueShortCodeToLong(template.value.unit) + ' <span class="caret">';
		});
	}

	function numberChangedListener() {
		if (!this.value || this.value < 0) {
			this.value = 0;
		}
	}

	function valueTypeChangedListener() {
		console.log("Value changed");
		document.getElementById("value-type-input").innerHTML = this.innerHTML + ' <span class="caret">';
	}

	function createBindings() {
		document.getElementById("cancel-button").addEventListener('click', backToHomeScreen);
		document.getElementById("add-button").addEventListener('click', addItem);
		document.getElementById("weight-input").addEventListener('change', numberChangedListener);
		document.getElementById("value-input").addEventListener('change', numberChangedListener);
		document.getElementById('platinum-type').addEventListener('click', valueTypeChangedListener);
		document.getElementById('gold-type').addEventListener('click', valueTypeChangedListener);
		document.getElementById('electrum-type').addEventListener('click', valueTypeChangedListener);
		document.getElementById('silver-type').addEventListener('click', valueTypeChangedListener);
		document.getElementById('copper-type').addEventListener('click', valueTypeChangedListener);
	}

	addItemPage.show = function () {
		Utils.clearPage();
		var templates = TemplateManager.getListOfTemplates();
		var body = document.getElementById('body');
		var fullHTML = addItemLayout.replace('<TEMPLATE>', createTemplateDropDown(templates));
		body.innerHTML = fullHTML;
		createBindings();
		addTemplateChangeListener();
	};

	module.exports = addItemPage;

})();