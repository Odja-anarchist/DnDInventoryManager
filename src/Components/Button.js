var shortid = require('shortid');
var _ = require('lodash');

var button = function (config) {
    config = config || {};
    this.title = config.title;
    this.icon = config.icon;
    this.listener = config.listener;
    this.flipOrder = config.flipOrder || false;
    this.id = shortid.generate();

    _.bind(this.getElement, this);
}

button.prototype.getElement = function () {
    var buttonDiv = document.createElement('div');
    if (this.isPopulatedButton()) {
        buttonDiv.setAttribute('class', 'button-container');
    }

    var iconStyle = this.icon ? '' : 'display: none;';

    var icon = '<i class="fa ' + (this.icon ? this.icon : '') + '" style="' + iconStyle + '" aria-hidden="true"></i>';
    var title = '<span>' + (this.title ? this.title : '') + '</span>';

    var element = '<a href="#" class="button" id="button-' + this.id + '">';
    if (!this.flipOrder) {
        element += icon + title;
    } else {
        element += title + icon;
    }

    element += '</a>';
    buttonDiv.innerHTML = element;
    if (this.listener) {
        buttonDiv.addEventListener('click', this.listener);
    }
    return buttonDiv;
}

button.prototype.isPopulatedButton = function () {
    return !!this.title || !!this.icon;
}

button.prototype.setFlipOrder = function (flipOrder) {
    this.flipOrder = flipOrder;
}

module.exports = button;