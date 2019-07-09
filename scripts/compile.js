var fs = require('fs-extra');
var deasync = require('deasync');
var JSDom = require('jsdom').JSDOM;

var deploy = require('./deploy.js');
var config = require('../scripts/config.json');
var assets = require('../scripts/assets.js');

var isDeploy = process.argv.slice(2)[0] == 'true';

var path = '.build/';
var data = {
    path: isDeploy ? config.remote.url : 'http://localhost:' + config.local.port,
    embeds: fs.readdirSync('./src/embeds/')
}

fs.emptyDirSync(path);
fs.mkdirsSync(path);
fs.copySync('./node_modules/handlebars/dist/handlebars.min.js', path + 'embed/from-tool/handlebars.min.js');

var formattedEmbeds = {};

data.embeds.forEach(function(embed) {
    var dom = new JSDom(fs.readFileSync('./src/embeds/' + embed, 'utf8'));
    var document = dom.window.document;
    var embedName = embed.split('.')[0];
    var displayName = document.title.replace(' Embed', '');

    // compile sass
    var sass = document.querySelector('script[type=\'application/sass\']');
    var css = assets.css(sass.innerHTML);
    var style = document.createElement('style')
        style.innerHTML = css;
    document.head.appendChild(style);
    sass.parentNode.removeChild(sass);

    // get fields from inline JSON
    var json = document.querySelector('script[type=\'application/json\']');
    var embedData = JSON.parse(json.innerHTML);
    json.parentNode.removeChild(json);

    // write embed
    var embedDest = path + 'embed/from-tool/' + embedName;
    fs.mkdirsSync(embedDest);
    fs.writeFileSync(embedDest + '/index.html', dom.serialize());

    // add additional data
    embedData.name = embedName;
    embedData.displayName = displayName;
    embedData.path = data.path;

    // create tool page
    assets.html(fs.readFileSync('./src/tool/embed.html', 'utf8'), embedData, 'tools/embed-tool/' + embedName + '/index.html');

    // add to data object that will build the index
    if (!formattedEmbeds[embedData.type]) {
        formattedEmbeds[embedData.type] = [];
    }

    formattedEmbeds[embedData.type].push({
        name: embedName,
        displayName: displayName
    });
});

data.embeds = formattedEmbeds;

assets.html(fs.readFileSync('./src/tool/index.html', 'utf8'), data, 'tools/embed-tool/index.html');

fs.copySync('./src/tool/assets/', path + 'tools/embed-tool/assets/');

if (isDeploy) {
    fs.emptyDirSync('.deploy');
    fs.copySync(path, '.deploy');

    deploy();
}
