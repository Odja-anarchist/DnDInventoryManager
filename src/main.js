(function () {
	var homePage = require('./homePage');

	var main = {};
	var a = 1;
	main.start = function () {
		homePage.show();
		console.log('A:' + a);
	}

	module.exports = main;

	onload = function () {
		main.start();
	};
})();