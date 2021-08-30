"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isReservedPage = exports.isExcludedExtn = exports.findMatch = exports.normalizeTrailingSlash = exports.removeTrailingSlash = exports.appendTrailingSlash = exports.splitFilenameAndExtn = exports.splitFoldersAndFiles = void 0;
const splitFoldersAndFiles = (data) => {
    const folders = [];
    const files = data.filter((item) => {
        if (item.charAt(item.length - 1) === '*') {
            folders.push(item);
            return false;
        }
        return true;
    });
    return [folders, files];
};
exports.splitFoldersAndFiles = splitFoldersAndFiles;
const splitFilenameAndExtn = (filename) => {
    const dotIndex = filename.lastIndexOf('.');
    return [
        filename.substring(0, dotIndex),
        filename.substring(dotIndex + 1, filename.length),
    ];
};
exports.splitFilenameAndExtn = splitFilenameAndExtn;
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
const isExcludedExtn = (fileExtension, excludeExtensions) => excludeExtensions.some((toIgnoreExtension) => toIgnoreExtension === fileExtension);
exports.isExcludedExtn = isExcludedExtn;
const findMatch = (path, folders, files) => {
    const foundFile = files.find((file) => file === path);
    if (foundFile) {
        return foundFile;
    }
    for (const folder of folders) {
        // remove asterisk
        const formattedFolder = folder.substring(0, folder.length - 1);
        if (path.includes(formattedFolder)) {
            return folder;
        }
    }
};
exports.findMatch = findMatch;
const isReservedPage = (pageName) => pageName.charAt(0) === '_' || pageName.charAt(0) === '.';
exports.isReservedPage = isReservedPage;
