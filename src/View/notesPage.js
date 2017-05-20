(function () {
    var _ = require('lodash');

    var Utils = require('../Utils');
    var TitleBar = require('../Components/TitleBar');
    var notesPage = function () {
        _.bindAll(this, _.functionsIn(this));
    };

    var notesPageUI = '<div class="notesPage">' +
        '<textarea rows="10" id="notesArea">' +
        '</textarea>' +
        '</div>';

    notesPage.prototype.show = function (content) {
        content.appendChild(new TitleBar({
            title: 'Notes',
            type: TitleBar.TYPES.SUB_TITLE
        }).getElement());

        content.insertAdjacentHTML('beforeEnd', notesPageUI);

        var notesArea = document.getElementById('notesArea');
        notesArea.value = localStorage['NOTES'] || '';
        notesArea.addEventListener('input', this.onInput);
    };

    notesPage.prototype.onInput = function () {
        var notesArea = document.getElementById('notesArea');
        var notesAreaValue = notesArea.value;
        localStorage['NOTES'] = notesAreaValue;
    };

    notesPage.prototype.getButton = function () {
        return {
            title: 'Notes',
            icon: 'fa-commenting-o',
            entry: this.show
        };
    };

    module.exports = new notesPage();
})();