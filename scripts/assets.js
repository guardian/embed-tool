var fs = require('fs-extra');
var sass = require('node-sass');
var config = require('../scripts/config.json');

module.exports = {
    css: function(path, absolutePath, version) {
        fs.removeSync(path + 'embed/' + config.name + '/style.css');

        var css = sass.renderSync({
            file: './src/embed/sass/style.scss'
        }).css.toString('utf8');

        fs.mkdirsSync(path + 'embed/' + config.name + '/v' + version);
        fs.writeFileSync(path + 'embed/' + config.name + '/v' + version + '/style.css', css.replace(/@@assetPath@@/g, absolutePath).replace(/@@version@@/g, 'v' + version));
        console.log('updated css');
    },

    html: function(path, absolutePath, version) {
        fs.mkdirsSync(path + 'tools/' + config.name + '');
        fs.writeFileSync(path + 'tools/' + config.name + '/index.html',
            fs.readFileSync('./src/tool/index.html', 'utf8').replace(/@@assetPath@@/g, absolutePath).replace(/@@version@@/g, 'v' + version)
        );

        fs.mkdirsSync(path + 'embed/' + config.name + '/v' + version)
        fs.writeFileSync(path + 'embed/' + config.name + '/v' + version + '/embed.html',
            fs.readFileSync('./src/embed/embed.html', 'utf8').replace(/@@assetPath@@/g, absolutePath).replace(/@@version@@/g, 'v' + version)
        );

        console.log('updated html!');
    }
} 