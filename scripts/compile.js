// dependancies
var fs = require('fs-extra');
var promptly = require('promptly');
var deasync = require('deasync');

var deploy = require('./deploy.js');
var config = require('../scripts/config.json');
var assets = require('../scripts/assets.js');

var specs =  {
    'deploy': process.argv.slice(2)[0] == 'true' ? true : false,
    'isNewVersion': process.argv.slice(2)[1] == 'true' ? true : false
};

var path = '.build/';
var version = config.version;
var assetPath = specs.deploy === false ? 'http://localhost:' + config.local.port : config.remote.url;

var questionAnswered = false;

if (specs.isNewVersion) {
    var newConfig = JSON.parse(JSON.stringify(config));
        newConfig.version += 1;

    var confirmed = false;

    promptly.confirm('Increase version from ' + config.version + ' to ' + newConfig.version + '?', function(err, value) {
        confirmed = value;

        if (confirmed) {
            version = newConfig.version;
            fs.writeFileSync('./scripts/config.json', JSON.stringify(newConfig, null, 4));
            questionAnswered = true;
        } else {
            console.log('Compile aborted');
            process.exit();
        }
    })

    deasync.loopWhile(function(){return !questionAnswered;});
}

fs.emptyDirSync(path);

assets.css(path, assetPath, version);
assets.html(path, assetPath, version);

if (specs.deploy) {
    fs.emptyDirSync('.deploy');
    fs.copySync(path, '.deploy');

    deploy();
}
