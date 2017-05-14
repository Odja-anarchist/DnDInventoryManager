(function () {
    var _ = require('lodash');

    var Utils = require('../Utils');
    var TitleBar = require('../Components/TitleBar');
    var notesPage = function () {
        _.bindAll(this, _.functionsIn(this));
    };

    notesPage.prototype.show = function (content) {
        content.appendChild(new TitleBar({
            title: 'Notes',
            type: TitleBar.TYPES.SUB_TITLE
		}).getElement());
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