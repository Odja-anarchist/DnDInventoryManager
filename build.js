var files = [
    "./package.json",
    './baseDnD5eTemplates.json',

    "./src/main.js",

    "./src/Managers/inventoryManager.js",
    "./src/Managers/templateManager.js"
];

var browserify = require('browserify');
var b = browserify(files);
b.bundle().pipe(process.stdout);