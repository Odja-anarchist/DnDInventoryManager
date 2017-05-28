var constants = {
    inventoryPageActions: {
        ADD_EDIT_ITEM: "ADD_EDIT_ITEM",
        TRANSACTION: 'TRANSACTION',
        RESET: 'RESET',
        CONVERT_COINAGE: 'CONVERT_COINAGE'
    },
    itemListAction: {
        DELETE: "DELETE",
        EDIT: "EDIT"
    },
    coinage: {
        PLATINUM: {
            NAME: "Platinum",
            COPPER_VALUE: 1000
        },
        GOLD: {
            NAME: "Gold",
            COPPER_VALUE: 100
        },
        ELECTRUM: {
            NAME: "Electrum",
            COPPER_VALUE: 50
        },
        SILVER: {
            NAME: "Silver",
            COPPER_VALUE: 10
        },
        COPPER: {
            NAME: "Copper",
            COPPER_VALUE: 1
        },
    },
    abilities: {
        STR: {
            NAME: "Strength",
            SHORT_NAME: "STR"
        },
        DEX: {
            NAME: "Dexterity",
            SHORT_NAME: "DEX"
        },
        CON: {
            NAME: "Constitution",
            SHORT_NAME: "CON"
        },
        INT: {
            NAME: "Intelligence",
            SHORT_NAME: "INT"
        },
        WIS: {
            NAME: "Wisdom",
            SHORT_NAME: "WIS"
        },
        CHA: {
            NAME: "Charisma",
            SHORT_NAME: "CHA"
        }
    }
}

module.exports = constants;