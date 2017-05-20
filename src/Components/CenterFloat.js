var _ = require('lodash');

var CenterFloat = function (element) {
    this.containedElement = element;
}

CenterFloat.prototype.getElement = function () {
    var containerDiv = document.createElement('div');
    containerDiv.setAttribute('style', "display: flex;");
    var rightDiv = document.createElement('div');
    rightDiv.setAttribute('style', "flex: 1;");
    containerDiv.appendChild(rightDiv);
    if (this.containedElement && _.isFunction(this.containedElement.getElement)) {
        this.containedElement = this.containedElement.getElement()
    }
    containerDiv.appendChild(this.containedElement);
    var leftDiv = document.createElement('div');
    leftDiv.setAttribute('style', "flex: 1;");
    containerDiv.appendChild(leftDiv);
    return containerDiv;
}

module.exports = CenterFloat;