var templateManager = {};

templateManager.getTemplate = function (id) {
	for (var i = 0; i < localStorage.length; i++) {
		var key = localStorage.key(i);
		if (key.startsWith('TEMPLATE-' + id)) {
			var value = localStorage.getItem(key);
			var template = JSON.parse(value);
			return template;
		}
	}
}

templateManager.getListOfTemplates = function () {
	var returnArray = [];
	for (var i = 0; i < localStorage.length; i++) {
		var key = localStorage.key(i);
		if (key.startsWith('TEMPLATE-')) {
			var value = localStorage.getItem(key);
			var template = JSON.parse(value);
			returnArray.push({
				id: template.id,
				name: template.name
			});
		}
	}
	return returnArray;
}

module.exports = templateManager;