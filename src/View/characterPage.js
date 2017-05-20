(function () {
    var _ = require('lodash');

    var Utils = require('../Utils');
    var TitleBar = require('../Components/TitleBar');
    var CharacterManager = require('../Managers/CharacterManager');


    var characterDetailsUI = '<span>Name:</span>' +
        '<input></input>' +
        '<span>Class:</input>' +
        '<input></input>';

    var characterPage = function () {
        _.bindAll(this, _.functionsIn(this));
    };

    characterPage.prototype.getButton = function () {
        return {
            title: 'Character',
            icon: 'fa-user',
            entry: this.show
        };
    };

    characterPage.prototype.show = function (content) {
        content.appendChild(new TitleBar({
            title: 'Character',
            type: TitleBar.TYPES.SUB_TITLE
        }).getElement());

        content.insertAdjacentHTML('beforeEnd', characterDetailsUI);
        content.appendChild(new TitleBar({
            title: 'Abilities',
            type: TitleBar.TYPES.SUB_TITLE
        }).getElement());


        var abilityScores = CharacterManager.getAbilities();
        var abilitySection = '<div class="abilityContent">';
        abilitySection += this.getAbilitySection('STR', abilityScores.strength);
        abilitySection += this.getAbilitySection('DEX', abilityScores.dexterity);
        abilitySection += this.getAbilitySection('CON', abilityScores.constitution);
        abilitySection += '</div><div class="abilityContent">';
        abilitySection += this.getAbilitySection('INT', abilityScores.intelligence);
        abilitySection += this.getAbilitySection('WIS', abilityScores.wisdom);
        abilitySection += this.getAbilitySection('CHA', abilityScores.charisma);
        abilitySection += "</div>"
        content.insertAdjacentHTML('beforeEnd', abilitySection);
        $(".integer").keypress(function (e) {
            if (e.which < 48 || e.which > 57) {
                return (false);
            }
        });
    };

    characterPage.prototype.getAbilitySection = function (title, value) {
        return '<div class="abilitySection">' +
            '<table>' +
            this.getSection([value, '+1', 'SAVING THROWS', '+2', 'Athletics'], 0) +
            this.getSection([Utils.getAbilityModifierFromAbilityValue(value), '+1', 'a', '0', 'b'], 1) +
            this.getSection([title, '+1', 'a', '0', 'b'], 2) +
            '</table>' +
            "</div>";
    }

    characterPage.prototype.getSection = function (values, level) {
        var classes = ["inputSection", "middleSection", "titleSection"]
        var classText = classes[level] + " valueSection";
        var value = level !== 0 ? values[0] : '<input class="form-control integer inputWidth" step="1" value="' + values[0] + '" type="number" id="strength-input" min="0" max="20"></input>';
        return '<tr>' +
            '<td rowspan="2" class="' + classText + '">' +
            value +
            '</td>' +
            '<td class="modifierSection">' +
            values[1] +
            '</td>' +
            '<td class="descriptionSection">' +
            values[2] +
            '</td>' +
            '</tr>' +
            '<tr>' +
            '<td class="modifierSection">' +
            values[3] +
            '</td>' +
            '<td class="descriptionSection">' +
            values[4] +
            '</td>' +
            '</tr>';
    }

    module.exports = new characterPage();
})();