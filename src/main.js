var _ = require('lodash');
var pack = require('../package.json');

var inventoryPage = require('./View/inventoryPage');
var characterPage = require('./View/characterpage');
var notesPage = require('./View/notesPage');
var spellsPage = require('./View/spellsPage');

var Button = require('./Components/Button');
var TitleBar = require('./Components/TitleBar');

var DATABASE_VERSION = 1;

var main = {
	layout: '<div class="icon-bar" id="tab-bar"></div>' +
	'<div class="content" id="content"></div>',

	_getContent: function () {
		return document.getElementById('content');
	},

	_clearContent: function () {
		this._getContent().innerHTML = '';
	},

	_changeTab: function (target, index) {
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
			localStorage['LAST_PAGE_INDEX'] = parseInt(index);
			var currentTab = this.tabBarClickMap[target];
			currentTab.entry.apply(currentTab.scope, [this._getContent()]);
		}
	},

	_setupNavBar: function (contentPages) {
		var self = this,
			onTabBarClickListener = function () {
				_.bind(self._changeTab, self, this.id, this.getAttribute('index'))();
				return true;
			};
		tabBar = document.getElementById('tab-bar');
		var tabBarInnerHtml = "";

		var index = 0;
		_.each(contentPages, function (contentPage) {
			var buttonConfig = contentPage.getButton();
			tabBarInnerHtml += '<div class="titleBarButton" index="' + index + '" id="tab-bar-button-' + buttonConfig.title + '"><i class="fa ' + buttonConfig.icon + '" aria-hidden="true"></i><span>' + buttonConfig.title + '</span></div>';
			self.tabBarClickMap['tab-bar-button-' + buttonConfig.title] = buttonConfig;
			index++;
		});
		tabBar.innerHTML += tabBarInnerHtml;

		for (var i = 0; i < tabBar.children.length; i++) {
			var child = tabBar.children[i];
			child.addEventListener('click', onTabBarClickListener);
		}
		var pageIndex = 0;
		if (localStorage['LAST_PAGE_INDEX']) {
			var value = localStorage['LAST_PAGE_INDEX'];
			if (tabBar.children.length > value) {
				pageIndex = value;
			}
		}
		self._changeTab(tabBar.children[pageIndex].id, tabBar.children[pageIndex].getAttribute('index'));
	},

	setupInitListener: function () {
		window.onclick = function (event) {
			var excusedId;
			if (event.target.id) {
				if (event.target.id.startsWith('dropdownButton') || event.target.id.startsWith('dropdownIcon')) {
					excusedId = event.target.id.substring(event.target.id.indexOf('-') + 1);
				}
			}
			var dropdowns = document.getElementsByClassName("dropdown-content");
			var i;
			for (i = 0; i < dropdowns.length; i++) {
				var openDropdown = dropdowns[i];
				if (excusedId && (openDropdown.id == 'dropdownContent-' + excusedId)) {
				} else {
					openDropdown.classList.remove('show');
					openDropdown.classList.remove('show-right');
				}
			}
		}
	},

	checkLocalStorageVersion: function () {
		if (localStorage['DBVERSION']) {
			if (localStorage['DBVERSION'] != DATABASE_VERSION) {
				localStorage.clear();
			}
		} else {
			localStorage.clear();
		}
		localStorage['DBVERSION'] = DATABASE_VERSION;
	},

	start: function () {
		this.checkLocalStorageVersion();
		this.tabBarClickMap = {};
		var body = document.getElementById('body');
		body.innerHTML = '';
		body.appendChild(new TitleBar({
			title: 'Inventory Manager',
			subTitle: 'v' + pack.version
		}).getElement());
		body.insertAdjacentHTML('beforeend', this.layout);

		this.setupInitListener();
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