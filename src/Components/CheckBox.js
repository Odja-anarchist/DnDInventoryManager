var shortid = require('shortid');
var _ = require('lodash');
var EventHandler = require('../EventHandler');

var checkbox = function (config) {
    config = config || {};
    this.title = config.title;
    this.icon = config.icon;
    this.iconStyle = config.iconStyle;
    this.checked = config.checked || false;
    this.isSticky = config.isSticky || false;
    this.id = shortid.generate();
    this.eventHandler = new EventHandler(['CHANGE']);
    _.bindAll(this, _.functionsIn(this));
}

checkbox.prototype.getElement = function () {
    if (this.element) {
        return this.element;
    }
    var checkboxDiv = document.createElement('div');
    checkboxDiv.setAttribute('id', 'checkboxDiv-' + this.id);
    checkboxDiv.setAttribute('class', 'checkboxContainer');
    checkboxDiv.addEventListener('click', this.onMouseClick);
    checkboxDiv.addEventListener('mousedown', this.onMouseDown);
    checkboxDiv.addEventListener('mouseup', this.onMouseUp);

    var bothItems = this.title && this.icon;

    var innerHTML = "<table>" + '<tr>';
    var rowSpan = bothItems ? 2 : 1;
    var style = this.checked ? 'fa-check-square-o' : 'fa-square-o';
    var iconStyle = this.iconStyle ? 'style="' + this.iconStyle + '"' : '';
    innerHTML += '<td rowspan="' + rowSpan + '"><i class="fa ' + style + ' checkedIcon" aria-hidden="true" id="checkbox-area-' + this.id + '"></i></td>';
    if (bothItems || this.icon) {
        innerHTML += '<td style="text-align: center;">' + '<i class="fa ' + this.icon + '" ' + iconStyle + 'aria-hidden="true"></i>' + '</td>';
    } else {
        innerHTML += '<td>' + '<span>' + this.title + '</span>' + '</td>';
    }
    innerHTML += "</tr>";

    if (bothItems) {
        innerHTML += '<tr><td><span>' + this.title + '</span></td></tr>';
    }
    innerHTML += "</table>";
    checkboxDiv.innerHTML = innerHTML;

    this.element = checkboxDiv;
    return checkboxDiv;
}

checkbox.prototype.onMouseDown = function () {
    var divElement = document.getElementById("checkboxDiv-" + this.id);
    if (divElement) {
        divElement.classList.add('pressed');
    }
}

checkbox.prototype.onMouseUp = function () {
    var divElement = document.getElementById("checkboxDiv-" + this.id);
    if (divElement) {
        divElement.classList.remove('pressed');
    }
}

checkbox.prototype.setChecked = function (checked) {
    this.checked = checked;
    var checkedElement = document.getElementById("checkbox-area-" + this.id);
    if (checkedElement) {
        var style = checked ? 'fa-check-square-o' : 'fa-square-o';
        checkedElement.setAttribute('class', 'fa ' + style + ' checkedIcon');
        this.eventHandler.fireEvent('CHANGE', this.checked);
    }
}

checkbox.prototype.setIsSticky = function (isSticky) {
    this.isSticky = isSticky;
}

checkbox.prototype.toggleChecked = function () {
    this.setChecked(!this.checked);
}

checkbox.prototype.onMouseClick = function () {
    if (this.checked && this.isSticky) {
        return;
    }
    this.toggleChecked();
}

checkbox.prototype.addChangeListener = function (listener) {
    this.eventHandler.addListener('CHANGE', listener);
}

checkbox.prototype.removeChangeListener = function (listener) {
    this.eventHandler.removeListener('CHANGE', listener);
}

module.exports = checkbox;