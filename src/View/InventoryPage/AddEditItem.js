var _ = require('lodash');

var TitleBar = require('../../Components/TitleBar');
var Button = require('../../Components/Button');
var EventHandler = require('../../EventHandler');
var Utils = require('../../Utils');
var Constants = require('../../Constants');
var TemplateManager = require('../../Managers/templateManager');
var InventoryManager = require('../../Managers/inventoryManager');

var addEditItemLayout = '<table style="width: 100%">' +
    '<tr>' +
    '<TEMPLATE>' +
    '</tr>' +
    '<tr><td colspan="2"><hr/></td></tr>' +
    '<tr>' +
    '<td class="addItemCell">Name:</td>' +
    '<td class="addItemCell" colspan=2><input id="name-input" class="form-control" type="text"></input></td>' +
    '</tr>' +
    '<tr>' +
    '<td class="addItemCell">Weight:</td>' +
    '<td class="addItemCell" colspan=2>' +
    '<div class="input-group">' +
    '<input id="weight-input" class="form-control numberInput" value="0" type="number" min="0" aria-describedby="basic-addon2"></input>' +
    '<span class="input-group-addon" id="basic-addon2">lbs</span>' +
    '</div>' +
    '</td>' +
    '</tr>' +
    '<tr>' +
    '<td class="addItemCell">Value:</td>' +
    '<td class="addItemCell">' +
    '<div class="input-group">' +
    '<input type="number" id="value-input" value="0" class="form-control numberInput" aria-label="..." min="0">' +
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
    '<tr>' +
    '<td class="addItemCell">Description:</td>' +
    '<td class="addItemCell" colspan=2><input id="description-input" class="form-control" type="text"></input></td>' +
    '</tr>' +
    '</table>';

var AddEditItem = function () {
    _.bindAll(this, _.functionsIn(this));
}

AddEditItem.prototype.showInside = function (contentDiv, eventListener, editItem) {
    this.parentEventListener = eventListener;
    this.templates = TemplateManager.getListOfTemplates();
    this.editItem = editItem;
    this.createUI(contentDiv);
    this.addTemplateChangeListener();
    this.setupValueTypeChangeListener();
    this.setupNumericInputChangeListeners();
}

AddEditItem.prototype.createUI = function (contentDiv) {
    var title = this.editItem ? 'Edit Item - ' + this.editItem.name : 'Add Item';
    var addItemButton = new Button({
        title: this.editItem ? 'Save' : 'Add',
        icon: 'fa-check',
        listener: this.onAddTap
    });
    var cancelButton = new Button({
        title: 'Cancel',
        icon: 'fa-times',
        listener: this.onCancelTap
    })

    contentDiv.appendChild(new TitleBar({
        title: title,
        type: TitleBar.TYPES.SUB_TITLE,
        rightButton: addItemButton,
        leftButton: cancelButton
    }).getElement());
    var fullHTML = addEditItemLayout.replace('<TEMPLATE>', this.createTemplateDropDown());
    contentDiv.insertAdjacentHTML('beforeEnd', fullHTML);
    if (this.editItem) {
        this.setupEditItemFields();
    }
    $(".numberInput").keypress(function (e) {
        if (e.which < 48 || e.which > 57) {
            return (false);
        }
    });
}

AddEditItem.prototype.onNumericInput = function (e) {
    var inputField = e.target;
    var value = Utils.sanitiseNumberInput(inputField.value, 9999, 0);
    inputField.value = value;
}

AddEditItem.prototype.setupNumericInputChangeListeners = function () {
    document.getElementById('weight-input').addEventListener('input', this.onNumericInput);
    document.getElementById('value-input').addEventListener('input', this.onNumericInput);
}


AddEditItem.prototype.valueTypeChangedListener = function (e) {
    document.getElementById("value-type-input").innerHTML = e.target.innerHTML + ' <span class="caret">';
}

AddEditItem.prototype.setupValueTypeChangeListener = function () {
    document.getElementById('platinum-type').addEventListener('click', this.valueTypeChangedListener);
    document.getElementById('gold-type').addEventListener('click', this.valueTypeChangedListener);
    document.getElementById('electrum-type').addEventListener('click', this.valueTypeChangedListener);
    document.getElementById('silver-type').addEventListener('click', this.valueTypeChangedListener);
    document.getElementById('copper-type').addEventListener('click', this.valueTypeChangedListener);
}

AddEditItem.prototype.hide = function () {
}

AddEditItem.prototype.setupEditItemFields = function () {
    document.getElementById('name-input').value = this.editItem.name;
    document.getElementById('description-input').value = this.editItem.description;
    document.getElementById('weight-input').value = this.editItem.baseWeight;
    document.getElementById('value-input').value = this.editItem.baseValue;
    document.getElementById('value-type-input').innerHTML = this.editItem.baseValueType + ' <span class="caret">';
}

AddEditItem.prototype.createTemplateDropDown = function () {
    var templateString = '<td><span class="template-title">Template:</span></td>' +
        '<td><select class="js-example-basic-single">',
        self = this;

    var categories = Object.keys(this.templates);
    _.each(categories, function (categoryTitle) {
        var category = self.templates[categoryTitle];
        templateString += '<optgroup label="' + categoryTitle + '">';
        _.each(category, function (template) {
            templateString += '<option value="' + template.id + '">' + template.name + '</option>';
        });
        templateString += '</optgroup>';
    });
    templateString += '</select></td>';
    return templateString;
}

AddEditItem.prototype.getCurrentValueType = function () {
    var val = document.getElementById('value-type-input').innerHTML;
    return val.substring(0, val.indexOf(' '))
}

AddEditItem.prototype.addTemplateChangeListener = function () {
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
        document.getElementById('description-input').value = template.description;
    });
}

AddEditItem.prototype.onAddTap = function () {
    var name = (document.getElementById('name-input').value + "").trim();
    var weight = document.getElementById('weight-input').value;
    var value = document.getElementById('value-input').value;
    var valueType = this.getCurrentValueType();
    var description = (document.getElementById('description-input').value + "").trim();

    if (name == "") {
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
        description: description
    };
    if (this.editItem) {
        item.count = this.editItem.count;
        item.id = this.editItem.id;
        InventoryManager.updateItem(item);
    } else {
        InventoryManager.addItem(item);
    }

    this.goBack();
}
AddEditItem.prototype.onCancelTap = function () {
    this.goBack();
}

AddEditItem.prototype.goBack = function () {
    this.parentEventListener.fireEvent(Constants.inventoryPageActions.RESET);
}

module.exports = new AddEditItem();