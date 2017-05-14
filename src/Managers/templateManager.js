var _ = require('lodash');
var shortid = require('shortid');
var baseTemplates = require('../../baseDnD5eTemplates.json');

var idCounter = 0;

var templateManager = function () {
	var self = this;
	this.templates = {};
	_.each(baseTemplates, function (template) {
		template.id = idCounter++;
		self.templates[template.id] = template;
	});
};

templateManager.prototype.getTemplate = function (id) {
	return this.templates[id];
}

templateManager.prototype.getListOfTemplates = function () {
	var result = {}
	_.map(this.templates, function (template) {
		if (!result[template.category]) {
			result[template.category] = [];
		}
		result[template.category].push(
			{
				id: template.id,
				name: template.name
			});
	});
	var categories = Object.keys(result);
	function customCompare(a, b) {
		return a.name.localeCompare(b.name);
	}
	_.each(categories, function (category) {
		result[category].sort(customCompare)
	});
	return result;

}

module.exports = new templateManager();