var path = require('path'),
    glob = require('glob');

module.exports = function (filesPath) {
    var entries = {},
        basename,temp,pathname;

    glob.sync(filesPath).forEach(function (entry) {
        basename = path.basename(entry,path.extname(entry));
        temp = entry.split('/').splice(-2);
        pathname = temp.splice(0,1) + '/' + basename;
        entries[pathname] = entry;
    });

    return entries;
}