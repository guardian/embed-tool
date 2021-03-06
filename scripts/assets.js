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
                return string.toLowerCase().replace(/ /g, '-').replace(/\//g, '').replace(/'/g, '');
            }
        });

        handlebars.registerHelper("switch", function(value, options) {
            this._switch_value_ = value;
            var html = options.fn(this);
            delete this._switch_value_;
            return html;
        });

        handlebars.registerHelper('if_eq', function(a, b, opts) {
            if(a == b) // Or === depending on your needs
                return opts.fn(this);
            else
                return opts.inverse(this);
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
