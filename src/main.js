var _ = require('lodash');
var pack = require('../package.json');

var inventoryPage = require('./View/inventoryPage');
var characterPage = require('./View/characterpage');
var notesPage = require('./View/notesPage');
var spellsPage = require('./View/spellsPage');

var Button = require('./Components/Button');
var TitleBar = require('./Components/TitleBar');

var main = {
	layout: '<div class="icon-bar" id="tab-bar"></div>' +
	'<div class="content" id="content"></div>',

	_getContent: function () {
		return document.getElementById('content');
	},

	_clearContent: function () {
		this._getContent().innerHTML = '';
	},

	_changeTab: function (target) {
		if (this.currentTab) {
			if (this.currentTab === target) {
				return;
			}
			var currentlyActiveTabBarElement = document.getElementById(this.currentTab);
			currentlyActiveTabBarElement.classList.remove('active');
			if (this.tabBarClickMap[this.currentTab]) {
				var currentTab = this.tabBarClickMap[this.currentTab];
				if (currentTab.hide) {
					currentTab.hide.apply(currentTab.scope);
				}

			}
		}
		var nextActiveTabBarElement = document.getElementById(target);
		nextActiveTabBarElement.classList.add('active');
		this.currentTab = target;
		this._clearContent();

		if (this.tabBarClickMap[target]) {
			var currentTab = this.tabBarClickMap[target];
			currentTab.entry.apply(currentTab.scope, [this._getContent()]);
		}
	},

	_setupNavBar: function (contentPages) {
		var self = this,
			onTabBarClickListener = function () {
				_.bind(self._changeTab, self, this.id)();
			};
		tabBar = document.getElementById('tab-bar');
		var tabBarInnerHtml = "";

		_.each(contentPages, function (contentPage) {
			var buttonConfig = contentPage.getButton();
			tabBarInnerHtml += '<a href="#" id="tab-bar-button-' + buttonConfig.title + '"><i class="fa ' + buttonConfig.icon + '" aria-hidden="true"></i><span>' + buttonConfig.title + '</span></a>';
			self.tabBarClickMap['tab-bar-button-' + buttonConfig.title] = buttonConfig;
		});
		tabBar.innerHTML += tabBarInnerHtml;

		for (var i = 0; i < tabBar.children.length; i++) {
			var child = tabBar.children[i];
			child.addEventListener('click', onTabBarClickListener);
		}
		self._changeTab(tabBar.children[0].id);
	},

	start: function () {
		this.tabBarClickMap = {};
		var body = document.getElementById('body');
		body.innerHTML = '';
		body.appendChild(new TitleBar({
			title: 'Inventory Manager',
			subTitle: 'v' + pack.version
		}).getElement());
		body.insertAdjacentHTML('beforeend', this.layout);

		var contentPages = [
			characterPage,
			spellsPage,
			inventoryPage,
			notesPage
		];
		this._setupNavBar(contentPages);
	}
};

onload = function () {
	main.start();
};