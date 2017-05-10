var NwVersions = require('nw-builder/lib/versions');
var when = require('when');
var http = require('http');
var fs = require('fs');
var _ = require('lodash');
var ProgressBar = require('progress');
var unzip = require('unzip');
var ncp = require('ncp').ncp;
var rimraf = require('rimraf');
var glob = require('glob');
var mkdir = require('mkdirp');
var packageJson = require('./package.json');

var Utils = require('./Utils.js');

var appFiles = [
    './ScriptManager.js',
    './Message.js',
    './Utils.js',
    './index.html',
    './css/**/**',
    './fonts/**/**',
    './img/**/**',
    './js/**/**',
    './scripts/**/**'
];

var debugBuild = false;
ncp.limit = 16;

var buildDir = '';
processArguments()
    .then(function () {
        var buildType = debugBuild ? 'debug' : 'production';
        console.log('Building ' + buildType + ' release');
        return NwVersions.getLatestVersion('http://dl.nwjs.io/');
    })
    .then(function (latestVersion) {
        // Hardcoding to 0.12.3 since alpha appears to be broken
        latestVersion = '0.12.3';
        var fileName = "nwjs-v" + latestVersion + "-win-ia32.zip";
        console.log('Latest Node Webkit version: v' + latestVersion);
        return createCacheDirectoryIfNotExists()
            .then(_.partial(downloadIfNotExists, fileName, latestVersion))
            .then(createBuildDirectoryIfNotExists)
            .then(createFinalBuildDirectory)
            .then(function (buildDir2) {
                buildDir = buildDir2;
                return extractZipContenceToBuildFolder('./cache/' + fileName, fileName, buildDir2);
            })
    }).then(function () {
        var destFile = buildDir + '/';
        return copyPackageJson(destFile)
            .then(_.partial(copyApplicationFilesToBuildDir, destFile));
    }).then(function () {
        console.log("Successfully created build: " + buildDir.substring(buildDir.lastIndexOf('/') + 1));
    });

function copyApplicationFilesToBuildDir(destFile) {
    console.log('Moving application files to build dir');
    var promises = [];
    var moduleGlob = getFilesFromNodeModules();
    moduleGlob = moduleGlob.concat(appFiles);
    _.each(moduleGlob, function (fileString) {
        var getGlobPromise = when.promise(function (resolve) {
            glob(fileString, {}, function (er, files) {
                if (er) {
                    reject(er);
                } else {
                    resolve(files);
                }
            });
        });
        promises.push(getGlobPromise);
    });
    var destFile2 = destFile;
    return when.all(promises).then(function (files) {
        files = _.flatten(files);
        _.each(files, function (fileName) {
            var destFile = fileName.replace('./', destFile2);
            copyFile(fileName, destFile);
        });
    });
}

function copyPackageJson(destfile) {
    return when.promise(function (resolve, reject) {
        packageJson.window.toolbar = false;
        if (debugBuild) {
            packageJson.window.toolbar = true;
            packageJson.window.height = 810;
        }
        var outputFile = destfile + 'package.json';
        fs.writeFile(outputFile, JSON.stringify(packageJson), function (err) {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });

}

function copyFile(sourceFile, destFile) {
    var lastSlash = destFile.lastIndexOf('/');
    var fileDirToCheck = destFile.substring(0, lastSlash);
    var fileName = destFile.substring(lastSlash + 1);
    if (fileName.indexOf('.') == -1) {
        return;
    }
    mkdir.sync(fileDirToCheck, {});
    fs.createReadStream(sourceFile).pipe(fs.createWriteStream(destFile));
}

function getFilesFromNodeModules() {
    var fileNames = [];
    var modules = Object.keys(packageJson.dependencies);
    _.each(modules, function (moduleName) {
        var folderName = './node_modules/' + moduleName + '/**/**';
        fileNames.push(folderName);
    });
    return fileNames;
}

function processArguments() {
    process.argv.forEach(function (val, index, array) {
        if ((val === '-d') || (val === '-debug')) {
            debugBuild = true;
        }
    });
    return when.resolve();
}

function extractZipContenceToBuildFolder(zipFilePath, fileName, buildDir) {
    var source = buildDir + '/' + (fileName.substring(0, fileName.length - 4));
    console.log("Extracting " + zipFilePath + " to " + buildDir + " ...");
    return when.promise(function (resolve, reject) {
        fs.createReadStream(zipFilePath)
            .pipe(unzip.Extract({path: buildDir}))
            .on('close', function () {
                console.log('Finished extracting');
                resolve();
            });
    }).then(function () {
        console.log('Moving files up one directory');
        return copyFolderContenceUpOneDir(source, buildDir);
    }).then(function () {
        return when.promise(function (resolve) {
            rimraf(source, function () {
                resolve();
            });
        });

    });
}

function copyFolderContenceUpOneDir(source, destination) {
    return when.promise(function (resolve, reject) {
        ncp(source, destination, function (err) {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
}

function createFinalBuildDirectory() {
    var version = packageJson.version;
    var buildDir = 'ScriptManager v' + version;
    if (debugBuild) {
        buildDir += '-debug'
    }
    console.log('Creating output for: ' + buildDir);
    buildDir = './build/' + buildDir;
    return Utils.createDirectoryIfNotExists(buildDir).then(function () {
        rmDir(buildDir, false);
        return buildDir;
    });
}

function downloadIfNotExists(fileName, latestVersion) {
    if (Utils.doesFileExist('./cache/' + fileName)) {
        console.log(fileName + " already exists, skipping download");
        return when.resolve();
    } else {
        console.log("Downloading " + fileName);
        return downloadLatestNwVersion(fileName, latestVersion);
    }
}

function downloadLatestNwVersion(fileName, latestVersion) {
    var downloadFile = fs.createWriteStream("./cache/" + fileName);
    return when.promise(function (resolve) {
        http.get("http://dl.nwjs.io/v" + latestVersion + "/" + fileName,
            function (res) {
                console.log("Total size: " + formatBytes(res.headers['content-length'], 2));
                var len = parseInt(res.headers['content-length'], 10);
                var bar = new ProgressBar('  downloading [:bar] :percent :etas', {
                    complete: '=',
                    incomplete: ' ',
                    width: 20,
                    total: len
                });
                res.on('data', function (chunk) {
                    bar.tick(chunk.length);
                    downloadFile.write(chunk);
                });
                res.on('end', function () {
                    console.log('Downloaded ' + fileName);
                    resolve();
                });
            });
    });
}

function createCacheDirectoryIfNotExists() {
    return Utils.createDirectoryIfNotExists('./cache');
}

function createBuildDirectoryIfNotExists() {
    return Utils.createDirectoryIfNotExists('./build');
}

function rmDir(dirPath, removeSelf) {
    if (removeSelf === undefined)
        removeSelf = true;
    try {
        var files = fs.readdirSync(dirPath);
    }
    catch (e) {
        return;
    }
    if (files.length > 0)
        for (var i = 0; i < files.length; i++) {
            var filePath = dirPath + '/' + files[i];
            if (fs.statSync(filePath).isFile())
                fs.unlinkSync(filePath);
            else
                rmDir(filePath);
        }
    if (removeSelf)
        fs.rmdirSync(dirPath);
}

function formatBytes(bytes, decimals) {
    if (bytes == 0) {
        return "0 Byte";
    }
    var k = 1024; //Or 1 kilo = 1000
    var sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + " " + sizes[i];
}