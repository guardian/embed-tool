// dependancies
var fs = require('fs-extra');
var promptly = require('promptly');
var deasync = require('deasync');

var deploy = require('./deploy.js');
var config = require('../scripts/config.json');
var assets = require('../scripts/assets.js');

var specs =  {
    'deploy': process.argv.slice(2)[0] == 'true' ? true : false
};

var path = '.build/';
var data = {
    path: specs.deploy === false ? 'http://localhost:' + config.local.port : config.remote.url,
    embeds: fs.readdirSync('./src/embeds')
}

fs.emptyDirSync(path);
fs.mkdirsSync(path);

assets.html(fs.readFileSync('./src/tool/index.html', 'utf8'), data, 'tools/embed-tool/index.html');


if (specs.deploy) {
    fs.emptyDirSync('.deploy');
    fs.copySync(path, '.deploy');

    deploy();
}
