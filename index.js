'use strict';

var through = require('through2');
var path = require('path');
var gutil = require('gulp-util');
var PLUGIN_NAME = 'gulp-polymer-styles';

module.exports = function(opts) {
    function namefn(file) {
        // path/to/filename.css -> filename-styles
        return path.basename(file.path, path.extname(file.path));
    }

    var fname = opts && opts.filename || namefn;

    return through.obj(function (file, enc, cb) {

        if (file.isStream()) {
            return cb(new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
        }
        if (file.isNull()) {
            return cb(null, file);
        }

        var filename = typeof fname === 'function' ? fname(file) : fname;
        var dirname = path.dirname(file.path);

        var res = 'import { html } from \'@polymer/polymer/polymer-element.js\';\n' +
            'export default html`<style>\n' +
            file.contents.toString('utf8') + '\n' +
            '</style>`;';

        file.contents = new Buffer(res);
        file.path = path.join(dirname, filename) + '.js';

        return cb(null, file);
    });

};

