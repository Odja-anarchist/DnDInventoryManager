(function () {
	var _ = require('lodash');

	var Utils = require('../Utils');
	var InventoryManager = require('../Managers/inventoryManager');
	var CharacterManager = require('../Managers/CharacterManager');
	var CoinageManager = require('../Managers/CoinageManager');
	var TitleBar = require('../Components/TitleBar');
	var Constants = require('../Constants');
	var CoinageSection = require('./InventoryPage/CoinageSection');
	var ItemListSection = require('./InventoryPage/ItemListSection');
	var AddEditItem = require('./InventoryPage/AddEditItem');
	var InventoryHeaderSection = require('./InventoryPage/InventoryHeaderSection');
	var Transaction = require('./Inventorypage/Transaction');
	var EventHandler = require('../EventHandler');

	var uiStates = {
		MAIN_UI: 1,
		ADD_ITEM: 2,
		TRANSACTION: 3
	}

	var inventoryPage = function () {
		_.bindAll(this, _.functionsIn(this));
		this.eventHandler = new EventHandler(_.values(Constants.inventoryPageActions));
		this.currentUiState = uiStates.MAIN_UI;
		var self = this;
		_.each(this.eventHandler.getPossibleEvents(), function (eventType) {
			self.eventHandler.addListener(eventType, self.eventListenerTriggered);
		});
	};

	inventoryPage.prototype.eventListenerTriggered = function (data, type) {
		this.hide();
		Utils.clearPage();
		if (type === Constants.inventoryPageActions.TRANSACTION) {
			this.currentUiState = uiStates.TRANSACTION;
		} else if (type === Constants.inventoryPageActions.RESET) {
			this.currentUiState = uiStates.MAIN_UI;
		} else if (type === Constants.inventoryPageActions.ADD_EDIT_ITEM) {
			this.currentUiState = uiStates.ADD_ITEM;
		}
		this.show(Utils.getContentContainer());
	}

	inventoryPage.prototype.getButton = function () {
		return {
			title: 'inventory',
			icon: 'fa-archive',
			entry: this.show,
			hide: this.hide,
			scope: this
		};
	}

	inventoryPage.prototype.isCurrentlyInMainUI = function () {
		return this.currentUiState === uiStates.MAIN_UI;
	}
	inventoryPage.prototype.isCurrentlyInAddItem = function () {
		return this.currentUiState === uiStates.ADD_ITEM;
	}
	inventoryPage.prototype.isCurrentlyInTransaction = function () {
		return this.currentUiState === uiStates.TRANSACTION;
	}

	// -----------
	// Show
	// -----------

	inventoryPage.prototype.show = function (contentDiv) {
		if (this.isCurrentlyInMainUI()) {
			this.showMainUI(contentDiv);
		} else if (this.isCurrentlyInAddItem()) {
			this.showAddEditUI(contentDiv);
		} else if (this.isCurrentlyInTransaction()) {
			this.showTransactionUI(contentDiv);
		}
	}

	inventoryPage.prototype.showMainUI = function (contentDiv) {
		contentDiv.appendChild(new TitleBar({
			title: 'Inventory',
			type: TitleBar.TYPES.SUB_TITLE
		}).getElement());
		InventoryHeaderSection.showInside(contentDiv, this.eventHandler);
		CoinageSection.showInside(contentDiv, this.eventHandler);
		ItemListSection.showInside(contentDiv, this.eventHandler);
		$(document).ready(function () {
			$('[data-toggle="tooltip"]').tooltip();
		});
	}

	inventoryPage.prototype.showAddEditUI = function (contentDiv) {
		AddEditItem.showInside(contentDiv, this.eventHandler);
	}

	inventoryPage.prototype.showTransactionUI = function (contentDiv) {
		Transaction.showInside(contentDiv, this.eventHandler);
	}

	// -----------
	// HIDE
	// -----------

	inventoryPage.prototype.hide = function () {
		if (this.isCurrentlyInMainUI()) {
			this.hideMainUI();
		} else if (this.isCurrentlyInAddItem()) {
			this.hideAddItemUi();
		} else if (this.isCurrentlyInTransaction()) {
			this.hideTransactionUI();
		}
		this.currentUiState = uiStates.MAIN_UI;
	}

	inventoryPage.prototype.hideMainUI = function () {
		CoinageSection.hide();
		InventoryHeaderSection.hide();
		ItemListSection.hide();
	}

	inventoryPage.prototype.hideAddItemUi = function () {
		AddEditItem.hide();
	}

	inventoryPage.prototype.hideTransactionUI = function () {
		Transaction.hide();
	}

	module.exports = new inventoryPage();
})();