var Utils = {};
Utils.clearPage = function () {
	this.getContentContainer().innerHTML = "";
}

Utils.getContentContainer = function () {
	return document.getElementById('content');
};

Utils.sanitiseNumberInput = function (value, max, min) {
	max = max || 9999;
	min = min || 0;
	if (value === '') {
		value = 0;
	} else {
		value = parseInt(value);
	}
	if (value > max) {
		value = max;
	} else if (value < min) {
		value = min;
	}
	return value;
}

Utils.getCoinageValues = function (value, type) {
	var copperValue = this.convertCoinageValueToCopper(value, type);
	return Math.floor(copperValue / 1000) + " PL\n" +
		Math.floor(copperValue / 100) + " GP\n" +
		Math.floor(copperValue / 50) + " EL\n" +
		Math.floor(copperValue / 10) + " SL\n" +
		copperValue + " CP";
}

Utils.addCoinagePopupToElement = function (value, type, element) {
	var popupText = this.getCoinageValues(value, type);
	element.setAttribute('data-original-title', popupText);
	element.setAttribute('title', popupText);
}


Utils.convertCoinageValueToCopper = function (value, type) {
	if (type == "Silver") {
		return value * 10;
	} else if (type == "Electrum") {
		return value * 50;
	} else if (type == "Gold") {
		return value * 100;
	} else if (type == "Platinum") {
		return value * 1000;
	}
	return value;
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

Utils.getAbilityModifierFromAbilityValue = function (value) {
	if (value > 30) {
		return "+10";
	} else if (value < 1) {
		return "-5";
	} else {
		var modifier = Math.floor((value / 2) - 5);
		if (modifier > 0) {
			return "+" + modifier;
		} else if (modifier < 0) {
			return "" + modifier;
		} else {
			return "+" + modifier;
		}
	}
}

module.exports = Utils;