var _ = require('lodash');

var TitleBar = require('../../Components/TitleBar');
var Button = require('../../Components/Button');
var EventHandler = require('../../EventHandler');
var Utils = require('../../Utils');
var Constants = require('../../Constants');
var CoinageManager = require('../../Managers/CoinageManager');

var ui = '<table>' +
    '<tr>' +
        '<td rowspan="2">' +
            '<i class="fa fa-square-o" aria-hidden="true"></i>' +
        '</td>' +
        '<td>' +
            '<i class="fa fa-free-code-camp" aria-hidden="true"></i>' +
        '</td>' +
    '</tr>' +
    '<tr>' +
        '<td>' +
            'text' +
        '</td>' +
    '</tr>' +
    '</table>';

var transaction = function () {
    _.bindAll(this, _.functionsIn(this));
}

transaction.prototype.showInside = function (contentDiv, eventListener) {
    this.parentEventListener = eventListener;
    var addItemButton = new Button({
        title: 'Accept',
        icon: 'fa-check',
        listener: this.onAcceptTap
    });
    var cancelButton = new Button({
        title: 'Cancel',
        icon: 'fa-times',
        listener: this.onCancelTap
    })

    contentDiv.appendChild(new TitleBar({
        title: 'Transaction',
        type: TitleBar.TYPES.SUB_TITLE,
        rightButton: addItemButton,
        leftButton: cancelButton
    }).getElement());



    contentDiv.insertAdjacentHTML('beforeEnd', ui);
}

transaction.prototype.hide = function () {
}

transaction.prototype.onAcceptTap = function () {
    this.goBack()
}
transaction.prototype.onCancelTap = function () {
    this.goBack()
}
transaction.prototype.goBack = function () {
    this.parentEventListener.fireEvent(Constants.inventoryPageActions.RESET);
}

module.exports = new transaction();