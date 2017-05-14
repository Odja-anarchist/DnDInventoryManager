(function () {
    var _ = require('lodash');

    var Utils = require('../Utils');
    var TitleBar = require('../Components/TitleBar');
    
    var spellsPage = function () {
        _.bindAll(this, _.functionsIn(this));
    };

    spellsPage.prototype.show = function (content) {
        content.appendChild(new TitleBar({
            title: 'Spells',
            type: TitleBar.TYPES.SUB_TITLE
		}).getElement());
    };

    spellsPage.prototype.getButton = function () {
        return {
            title: 'Spells',
            icon: 'fa-magic',
            entry: this.show
        };
    };

    module.exports = new spellsPage();
})();