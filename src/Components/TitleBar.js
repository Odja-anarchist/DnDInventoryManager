var _ = require('lodash');
var shortid = require('shortid');

var Button = require('./Button');

var titleBar = function (config) {
    this.type = config.type || titleBar.TYPES.TITLE;
    this.title = config.title || "";
    this.subTitle = config.subTitle || "";
    this.leftButton = config.leftButton;
    this.rightButton = config.rightButton;
    this.id = shortid.generate();
    _.bind(this.getElement, this);
}

titleBar.prototype.getElement = function () {
    var titleBarDiv = document.createElement('div');
    var className = "titleBar";
    if (this.type === titleBar.TYPES.SUB_TITLE) {
        className += " subTitle";
    }
    titleBarDiv.setAttribute('class', className)
    titleBarDiv.innerHTML = '<div class="titleBarContainer left" id="left-container-' + this.id + '"></div><div id="title-' + this.id + '"><span class="header">~ ' + this.title + ' ~</span></div><div class="titleBarContainer right" id="right-container-' + this.id + '"></div>';
    var rightContainer = this.getElementById(titleBarDiv, 'right-container-' + this.id);
    var subTitleText = this.subTitle ? this.subTitle : '';
    rightContainer.innerHTML = '<span class="subtitle">' + subTitleText + '</span>';


    if (this.rightButton) {
        var rightContainer = this.getElementById(titleBarDiv, 'right-container-' + this.id);
        this.rightButton.setFlipOrder(true);
        rightContainer.appendChild(this.rightButton.getElement());
    } else {
        rightContainer.appendChild(new Button().getElement());
    }

    if (this.leftButton) {
        var rightContainer = this.getElementById(titleBarDiv, 'left-container-' + this.id);
        rightContainer.appendChild(this.leftButton.getElement());
    }
    return titleBarDiv;
}

titleBar.prototype.getElementById = function (element, targetId) {
    for (var i = 0; i < element.children.length; i++) {
        var child = element.children[i];
        if (child.id == targetId) {
            return child;
        }
    }
}

titleBar.TYPES = {
    TITLE: 1,
    SUB_TITLE: 2
}

module.exports = titleBar;