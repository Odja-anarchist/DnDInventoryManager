var checkbox = function (config) {
    config = config || {};
    this.title = config.title;
    this.icon = config.icon;
    this.checked = config.checked || false;
}

checkbox.prototype.getElement = function () {
    var checkboxDiv = document.createElement('div');
    checkboxDiv.setAttribute('class', 'checkboxContainer');

    var innerHTML = "<table>";
    // add row
    // add column 
    // if has icon and title set row span to 2
    // add icon to first column
    // add this icon to next column, or title if only one
    // close row
    // if icon and text
    // add row
    // add column
    // add text
    // close row

    innerHTML += "</table>";
    checkboxDiv.innerHTML = innerHTML;

    return checkboxDiv;
}

module.exports = checkbox;