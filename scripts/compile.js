// dependancies
var fs = require('fs-extra');
var deasync = require('deasync');
var JSDom = require('jsdom').JSDOM;

var deploy = require('./deploy.js');
var config = require('../scripts/config.json');
var assets = require('../scripts/assets.js');

var specs =  {
    'deploy': process.argv.slice(2)[0] == 'true' ? true : false
};

var path = '.build/';
var data = {
    path: specs.deploy === false ? 'http://localhost:' + config.local.port : config.remote.url,
    embeds: fs.readdirSync('./src/embeds/')
}

fs.emptyDirSync(path);
fs.mkdirsSync(path);

data.embeds.forEach(function(embed) {
    var dom = new JSDom(fs.readFileSync('./src/embeds/' + embed, 'utf8'));
    var document = dom.window.document;
    var embedName = embed.split('.')[0];

    // compile sass
    var sass = document.querySelector('script[type=\'application/sass\']');
    var css = assets.css(sass.innerHTML);
    var style = document.createElement('style')
        style.innerHTML = css;
    document.head.appendChild(style);
    sass.parentNode.removeChild(sass);

    // get fields from inline JSON
    var json = document.querySelector('script[type=\'application/json\']');
    var fields = JSON.parse(json.innerHTML);
    json.parentNode.removeChild(json);

    // write embed
    var embedDest = path + 'embed/from-tool/' + embedName;
    fs.mkdirsSync(embedDest);
    fs.writeFileSync(embedDest + '/index.html', dom.serialize());

    // copy assets
    fs.copySync('./node_modules/handlebars/dist/handlebars.min.js', embedDest + '/handlebars.min.js');

    // create tool page
    assets.html(fs.readFileSync('./src/tool/embed.html', 'utf8'), {
        name: embedName,
        fields: fields,
        path: data.path
    }, 'tools/embed-tool/' + embedName + '/index.html');
});

assets.html(fs.readFileSync('./src/tool/index.html', 'utf8'), data, 'tools/embed-tool/index.html');

if (specs.deploy) {
    fs.emptyDirSync('.deploy');
    fs.copySync(path, '.deploy');

    deploy();
}
