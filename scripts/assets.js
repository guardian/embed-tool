var fs = require('fs-extra');
var sass = require('node-sass');
var handlebars = require('handlebars');

module.exports = {
    css: function(importedSass) {
        var css = sass.renderSync({
            data: importedSass
        }).css.toString('utf8');

        return css;
    },

    html: function(html, data, exportPath) {
        handlebars.registerHelper('handlise', function(string) {
            if (string) {
                return string.toLowerCase().replace(/ /g, '-').replace(/\//g, '');
            }
        });

        handlebars.registerHelper('handliseFileName', function(string) {
            if (string) {
                return string.toLowerCase().replace(/ /g, '-').replace(/\//g, '').replace('.html', '');
            }
        });

        handlebars.registerHelper('fileToTitle', function(string) {
            if (string) {
                string = string.toLowerCase().replace(/ /g, '-').replace(/\//g, '').replace('.html', '');
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
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

        fs.mkdirsSync('.build/' + exportPath.substring(0, exportPath.lastIndexOf("/")));
        fs.writeFileSync('.build/' + exportPath, template(data));
    }
}
