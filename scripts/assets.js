var fs = require('fs-extra');
var sass = require('node-sass');
var handlebars = require('handlebars');

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

    html: function(html, data, exportPath) {
        handlebars.registerHelper('handlise', function(string) {
            return string.toLowerCase().replace(/ /g, '-').replace(/\//g, '');
        });

        handlebars.registerHelper("switch", function(value, options) {
            this._switch_value_ = value;
            var html = options.fn(this);
            delete this._switch_value_;
            return html;
        });

        handlebars.registerHelper("case", function(value, options) {
            if (value == this._switch_value_) {
                return options.fn(this);
            }
        });

        var template = handlebars.compile(html);

        console.log(exportPath);

        fs.mkdirsSync('.build/' + exportPath.substring(0, exportPath.lastIndexOf("/")));
        fs.writeFileSync('.build/' + exportPath, template(data));
    },

    copy: function(path) {
        // fs.copySync('./node_modules/handlebars/dist/handlebars.min.js', path + 'embed/' + name + '/v' + config.version + '/handlebars.min.js');
    }
}
