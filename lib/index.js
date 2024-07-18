const loaderUtils = require('loader-utils');
const { transfer } = require('./utils');

/**
 * patterns:{
 *  exportName:string;
 *  importPaths:string[];
 *  originPath:string
 * }[]
 *
 */

module.exports = function (content) {
    const options = loaderUtils.getOptions(this) || {};
    const { patterns = [] } = options;
    const callback = this.callback;

    if (!patterns || patterns.length === 0) {
        callback(null, content);
    }
    patterns.forEach((pattern) => {
        content = transfer(content, pattern);
    });

    callback(null, content);
};
