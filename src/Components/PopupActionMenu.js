var shortid = require('shortid');
var _ = require('lodash');

var popupActionMenu = function (config) {
    this.title = config.title;
    this.buttons = config.buttons;
    this.id = shortid.generate();
    _.bindAll(this, _.functionsIn(this));
}


var buttonUI = '<div class="dropdown">' +
    '<button class="dropbtn" id="dropdownButton">' +
    '<i class="fa fa-ellipsis-v" aria-hidden="true"></i>' +
    '</button>' +
    '<div id="myDropdown" class="dropdown-content">' +
    '<span class="title">Title</span>' +
    '<a href="#">Link 1</a>' +
    '<a href="#">Link 2</a>' +
    '<a href="#">Link 3</a>' +
    '</div>' +
    '</div>';

popupActionMenu.prototype.getElement = function () {
    var actionMenuDiv = document.createElement('div');
    actionMenuDiv.setAttribute('class', 'dropdown');
    actionMenuDiv.setAttribute('id', 'actionMenuDiv-' + this.id);

    var button = document.createElement('button');
    button.setAttribute('id', 'dropdownButton-' + this.id);
    button.setAttribute('class', 'dropbtn');
    button.addEventListener('click', this.onDropdownClick);
    button.addEventListener('mousedown', this.onMouseDown);
    button.addEventListener('mouseup', this.onMouseUp);

    var icon = document.createElement('i');
    icon.setAttribute('class', 'fa fa-ellipsis-v dropicon');
    icon.setAttribute('aria-hidden', 'true');
    icon.setAttribute('id', 'dropdownIcon-' + this.id);

    button.appendChild(icon);
    actionMenuDiv.appendChild(button);

    var contentDiv = document.createElement('div');
    contentDiv.setAttribute('class', 'dropdown-content');
    contentDiv.setAttribute('id', 'dropdownContent-' + this.id);

    if (this.title) {
        contentDiv.insertAdjacentHTML('beforeEnd', '<span class="title">' + this.title + '</span>');
    }
    _.each(this.buttons, function (button) {
        var link = document.createElement('div');
        link.setAttribute('class', 'popupElement');
        if (button.icon) {
            link.innerHTML = '<i class="fa ' + button.icon + '" aria-hidden="true"></i>' + button.title;
        } else {
            link.innerHTML = button.title;
        }
        link.addEventListener('click', function () {
            if (button.listener) {
                button.listener();
            }
        });
        contentDiv.appendChild(link);
    });
    actionMenuDiv.appendChild(contentDiv);

    return actionMenuDiv;
}

popupActionMenu.prototype.onDropdownClick = function (a, b, c, d, e, f, g, h) {
    var backgroundElementWidth = $(".background").outerWidth();
    var currentElementPosition = $("#actionMenuDiv-" + this.id).position();
    var classesToAdd = (currentElementPosition.left > backgroundElementWidth - 230) ? "show-right" : "show";
    var element = document.getElementById("dropdownContent-" + this.id);
    if (element.classList.contains("show") || element.classList.contains("show-right")) {
        element.classList.remove("show");
        element.classList.remove("show-right");
    } else {
        element.classList.add(classesToAdd);
        element.classList.add('shownOpacity');
    }
}

popupActionMenu.prototype.onMouseDown = function () {
    var buttonElement = document.getElementById("dropdownButton-" + this.id);
    if (buttonElement) {
        buttonElement.classList.add('pressed');
    }
}

popupActionMenu.prototype.onMouseUp = function () {
    var buttonElement = document.getElementById("dropdownButton-" + this.id);
    if (buttonElement) {
        buttonElement.classList.remove('pressed');
    }
}

module.exports = popupActionMenu;