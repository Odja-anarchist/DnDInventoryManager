(function () {
    var _ = require('lodash');

    var Utils = require('../Utils');
    var TitleBar = require('../Components/TitleBar');

    var ui = '<div>Character</div>'

    var characterPage = function () {
        _.bindAll(this, _.functionsIn(this));
    };

    characterPage.prototype.show = function (content) {
        content.appendChild(new TitleBar({
            title: 'Character',
            type: TitleBar.TYPES.SUB_TITLE
        }).getElement());
    };


    characterPage.prototype.getButton = function () {
        return {
            title: 'Character',
            icon: 'fa-user',
            entry: this.show
        };
    };

    module.exports = new characterPage();
})();