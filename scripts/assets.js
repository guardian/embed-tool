var fs = require('fs-extra');
var sass = require('node-sass');
var handlebars = require('handlebars');
var glob = require('glob-fs')({ gitignore: true });

var fields = require('../src/fields.json');
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
        fs.writeFileSync(path + 'tools/' + config.name + '/index.html', this.compileHtml('tool'));

        fs.mkdirsSync(path + 'embed/' + config.name + '/v' + version)
        fs.writeFileSync(path + 'embed/' + config.name + '/v' + version + '/index.html',
            fs.readFileSync('./src/embed/index.html', 'utf8').replace(/@@assetPath@@/g, absolutePath).replace(/@@version@@/g, 'v' + version)
        );

        console.log('updated html!');
    },

    compileHtml: function(file) {
        var html = fs.readFileSync('src/' + file + '/index.html', 'utf8');
        var template = handlebars.compile(html);
        var data = {
            'name': config.name,
            'version': config.version,
            'fields': fields
        };

        var partials = glob.readdirSync('src/' + file + '/**/*.html');

        console.log(partials);

        partials.forEach(function(partial) {
            var name = partial.replace('src/templates/', '').split('.')[0];
            var template = fs.readFileSync(partial, 'utf8');

            handlebars.registerPartial(name, template);
        });

        return template(data);
    }
} 