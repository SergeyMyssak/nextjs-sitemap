"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeTrailingSlash = exports.normalizeTrailingSlash = exports.appendTrailingSlash = void 0;
const appendTrailingSlash = (str) => {
    const lastChar = str.charAt(str.length - 1);
    if (lastChar === '/') {
        return str;
    }
    return str + '/';
};
exports.appendTrailingSlash = appendTrailingSlash;
const removeTrailingSlash = (str) => {
    const lastChar = str.charAt(str.length - 1);
    if (lastChar === '/') {
        return str.substring(0, str.length - 1);
    }
    return str;
};
exports.removeTrailingSlash = removeTrailingSlash;
const normalizeTrailingSlash = (str, trailingSlash) => trailingSlash ? appendTrailingSlash(str) : removeTrailingSlash(str);
exports.normalizeTrailingSlash = normalizeTrailingSlash;
