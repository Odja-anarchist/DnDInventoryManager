var shortid = require('shortid');
var _ = require('lodash');
var EventHandler = require('../EventHandler');

var CheckBoxGroup = function (config) {
    if (!config || !config.buttons) {
        throw new Error('Unable to create empty checkboxgroup');
    }
    this.buttons = config.buttons;
    this.checked = config.checked || 0;
    this.id = shortid.generate();
    this.eventHandler = new EventHandler(['CHANGE']);
    _.bindAll(this, _.functionsIn(this));
}

CheckBoxGroup.prototype.addChangeListener = function (listener) {
    this.eventHandler.addListener('CHANGE', listener);
}

CheckBoxGroup.prototype.removeChangeListener = function (listener) {
    this.eventHandler.removeListener('CHANGE', listener);
}

CheckBoxGroup.prototype.getElement = function () {
    var containerDiv = document.createElement('div');
    containerDiv.setAttribute('id', 'checkboxGroupContainer-' + this.id);
    containerDiv.setAttribute('class', 'checkboxGroup');
    var rightDiv = document.createElement('div');
    rightDiv.setAttribute('style', "flex: 1;");
    containerDiv.appendChild(rightDiv);

    for (var i = 0; i < this.buttons.length; i++) {
        var button = this.buttons[i];
        button.setIsSticky(true);
        button.setChecked(this.checked === i);
        containerDiv.appendChild(button.getElement());
        button.addChangeListener(_.partial(this.onButtonChanged, i));
    }
    var leftDiv = document.createElement('div');
    leftDiv.setAttribute('style', "flex: 1;");
    containerDiv.appendChild(leftDiv);
    return containerDiv;
}

CheckBoxGroup.prototype.onButtonChanged = function (buttonInt, buttonState) {
    if (buttonState === true) {
        this.eventHandler.fireEvent('CHANGE', buttonInt);
        for (var i = 0; i < this.buttons.length; i++) {
            if (i != buttonInt) {
                this.buttons[i].setChecked(false)
            }
        }
    }
}


module.exports = CheckBoxGroup;