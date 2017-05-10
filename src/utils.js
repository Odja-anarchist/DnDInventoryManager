var Utils = {};
Utils.clearPage = function () {
	var body = document.getElementById('body');
	body.innerHTML = '';
}

var valueShortCodes = {
	'GP': 'Gold',
	'PL': 'Platinum',
	'EL': 'Electrum',
	'SL': 'Silver',
	'CP': 'Copper'
};

var valueLongCodes = {
	'Gold': 'GP',
	'Platinum': 'PL',
	'Electrum': 'EL',
	'Silver': 'SL',
	'Copper': 'CP'
};

Utils.convertValueShortCodeToLong = function (shortCode) {
	return valueShortCodes[shortCode];
}

Utils.convertValueLongToShortCode = function (longCode) {
	return valueLongCodes[longCode];
}

module.exports = Utils;