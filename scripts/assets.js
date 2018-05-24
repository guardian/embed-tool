var fs = require('fs-extra');
var sass = require('node-sass');
var handlebars = require('handlebars');

var fields = require('../src/fields.json');
var config = require('../scripts/config.json');
var name = config.name.toLowerCase().replace(/ /g, '-').replace(/\//g, '');

module.exports = {
    css: function(path, absolutePath, version) {
        fs.removeSync(path + 'embed/' + name + '/style.css');

        var css = sass.renderSync({
            file: './src/embed/sass/style.scss'
        }).css.toString('utf8');

        fs.mkdirsSync(path + 'embed/' + name + '/v' + version);
        fs.writeFileSync(path + 'embed/' + name + '/v' + version + '/style.css', css.replace(/@@assetPath@@/g, absolutePath).replace(/@@version@@/g, 'v' + version));
        console.log('updated css');
    },

    html: function(path, absolutePath, version) {
        fs.mkdirsSync(path + 'tools/' + name + '');
        fs.writeFileSync(path + 'tools/' + name + '/index.html', this.compileHtml('tool', absolutePath));

        fs.mkdirsSync(path + 'embed/' + name + '/v' + version)
        fs.writeFileSync(path + 'embed/' + name + '/v' + version + '/index.html', 
            fs.readFileSync('./src/embed/index.html', 'utf8')
        );

        console.log('updated html!');
    },

    compileHtml: function(file, absolutePath) {
        handlebars.registerHelper("switch", function(value, options) {
            this._switch_value_ = value;
            var html = options.fn(this); // Process the body of the switch block
            delete this._switch_value_;
            return html;
        });

        handlebars.registerHelper("case", function(value, options) {
            if (value == this._switch_value_) {
                return options.fn(this);
            }
        });

        handlebars.registerHelper('handlise', function(string) {
            return string.toLowerCase().replace(/ /g, '-').replace(/\//g, '');
        });

        var html = fs.readFileSync('src/' + file + '/index.html', 'utf8');
        var template = handlebars.compile(html);
        var data = {
            'name': config.name,
            'version': 'v' + config.version,
            'path': absolutePath,
            'fields': fields
        };

        return template(data);
    },

    copy: function(path) {
        fs.copySync('./node_modules/handlebars/dist/handlebars.min.js', path + 'embed/' + name + '/v' + config.version + '/handlebars.min.js');
    }
} 