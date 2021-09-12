"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitFoldersAndFiles = exports.splitFilenameAndExtn = exports.isReservedPage = exports.isExcludedExtn = exports.findMatch = void 0;
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
const isExcludedExtn = (fileExtension, excludeExtensions) => excludeExtensions.some((toIgnoreExtension) => toIgnoreExtension === fileExtension);
exports.isExcludedExtn = isExcludedExtn;
const isReservedPage = (pageName) => pageName.charAt(0) === '_' || pageName.charAt(0) === '.';
exports.isReservedPage = isReservedPage;
const splitFilenameAndExtn = (filename) => {
    const dotIndex = filename.lastIndexOf('.');
    return [
        filename.substring(0, dotIndex),
        filename.substring(dotIndex + 1, filename.length),
    ];
};
exports.splitFilenameAndExtn = splitFilenameAndExtn;
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
