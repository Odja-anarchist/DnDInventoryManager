(function () {
    var _ = require('lodash');

    var Utils = require('../Utils');
    var TitleBar = require('../Components/TitleBar');
    var CharacterManager = require('../Managers/CharacterManager');
    var InventoryItem = require('../Components/InventoryItem');
    var Constants = require('../Constants');
    var Skills = require('../Skills');

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


        var abilityScores = CharacterManager.getAbilities(),
            self = this;
        _.each(Constants.abilities, function (ability) {
            var currentValue = abilityScores[ability.NAME];
            abilityScores[ability.NAME] = self.getAbilitySection(ability, currentValue);
        })

        var abilityContent1 = document.createElement('div');
        abilityContent1.setAttribute('class', 'abilityContent');
        abilityContent1.appendChild(abilityScores[Constants.abilities.STR.NAME]);
        abilityContent1.appendChild(abilityScores[Constants.abilities.DEX.NAME]);
        abilityContent1.appendChild(abilityScores[Constants.abilities.CON.NAME]);
        content.appendChild(abilityContent1);

        var abilityContent2 = document.createElement('div');
        abilityContent2.setAttribute('class', 'abilityContent');
        abilityContent2.appendChild(abilityScores[Constants.abilities.INT.NAME]);
        abilityContent2.appendChild(abilityScores[Constants.abilities.WIS.NAME]);
        abilityContent2.appendChild(abilityScores[Constants.abilities.CHA.NAME]);
        content.appendChild(abilityContent2);

        CharacterManager.addListener(CharacterManager.KEYS.ABILITES, this.onAbilityChange);

        $(".integer").keypress(function (e) {
            if (e.which < 48 || e.which > 57) {
                return (false);
            }
        });
    };

    characterPage.prototype.hide = function () {
        CharacterManager.removeListener(CharacterManager.KEYS.ABILITES, this.onAbilityChange);
    }

    characterPage.prototype.onAbilityChange = function (abilities) {
        var self;
        _.each(_.keys(abilities), function (abilityName) {
            var value = abilities[abilityName];
            var inputSection = document.getElementById(abilityName + '-input');
            var modifierSection = document.getElementById(abilityName + '-modifier');
            inputSection.value = value;
            modifierSection.innerHTML = Utils.getAbilityModifierFromAbilityValue(value);

            var modifiers = document.getElementsByClassName('mod-' + abilityName);
            _.each(modifiers, function (modifier) {
                if (modifier.getAttribute('data-attribute')) {
                    modifier.innerHTML = Utils.getAbilityModifierFromAbilityValue(value);
                }
            });
        });
    }

    characterPage.prototype.getAbilitySection = function (abilityDescription, value) {
        var abilitySection = document.createElement('div');
        abilitySection.setAttribute('class', 'abilitySection');

        var innerTable = document.createElement('table');
        abilitySection.appendChild(innerTable);

        var abilityNames = [];
        _.each(_.keys(Skills), function (skillName) {
            var skill = Skills[skillName];
            if (skill.ABILITY === abilityDescription.NAME) {
                abilityNames.push(skill.NAME);
            }
        });

        var baseModifier = Utils.getAbilityModifierFromAbilityValue(value);

        var inputSection = this.getInputSection(abilityDescription.NAME + '-input', abilityDescription.NAME, value);
        var abilityModifierSection = this.createAbilityModifier(abilityDescription.NAME + '-modifier', baseModifier);
        var titleSection = this.createAbilityModifier(abilityDescription.NAME, abilityDescription.SHORT_NAME);

        this.createRow(inputSection, [baseModifier, 'SAVING THROWS', baseModifier, abilityNames[0]], innerTable, abilityDescription.NAME);
        this.createRow(abilityModifierSection, [baseModifier, abilityNames[1], baseModifier, abilityNames[2]], innerTable, abilityDescription.NAME);
        this.createRow(titleSection, [baseModifier, abilityNames[3], baseModifier, abilityNames[4]], innerTable, abilityDescription.NAME);

        return abilitySection;
    }

    characterPage.prototype.createAbilityModifier = function (id, value) {
        var cell = document.createElement('td');
        cell.setAttribute('class', 'inputSection valueSection');
        cell.setAttribute('rowspan', "2");
        cell.setAttribute('id', id);
        cell.innerHTML = value;
        return cell;
    }

    characterPage.prototype.createRow = function (firstElement, values, table, id) {
        var firstRow = document.createElement('tr');
        firstRow.appendChild(firstElement);
        this.createDescriptionSection(values[0], values[1], firstRow, id);

        var secondRow = document.createElement('tr');
        this.createDescriptionSection(values[2], values[3], secondRow, id);

        table.appendChild(firstRow);
        table.appendChild(secondRow);
    }

    characterPage.prototype.getInputSection = function (id, type, currentValue) {
        var input = document.createElement('input');
        input.setAttribute('class', 'form-control integer inputWidth');
        input.setAttribute('step', "1");
        input.setAttribute('value', currentValue);
        input.setAttribute('type', 'number');
        input.setAttribute('id', id);
        input.addEventListener('input', function () {
            var value = Utils.sanitiseNumberInput(this.value, 20, 0);
            this.value = value;
            CharacterManager.setAbility(type, value)
        });
        var cell = document.createElement('td');
        cell.setAttribute('class', 'inputSection valueSection');
        cell.setAttribute('rowspan', "2");
        cell.appendChild(input);
        return cell;
    }

    characterPage.prototype.createDescriptionSection = function (value1, value2, tableRow, id) {
        if (_.isUndefined(value2) || value2 === '') {
            value1 = ' ';
        }
        this.createCellWithValue(value1, 'modifierSection mod-' + id, tableRow, value2);
        this.createCellWithValue(value2, 'descriptionSection ' + id, tableRow);
    }

    characterPage.prototype.createCellWithValue = function (value, tableClass, row, val) {
        var tableCell = document.createElement('td');
        tableCell.setAttribute('class', tableClass);
        if (val && (value !== '' && value !== ' ')) {
            tableCell.setAttribute('data-attribute', val);
        }
        tableCell.innerHTML = value || ' ';
        row.appendChild(tableCell);
    }

    module.exports = new characterPage();
})();