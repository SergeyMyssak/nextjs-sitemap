"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSitemapUrls = exports.getPathsFromDirectory = exports.getNextConfig = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const utils_1 = require("./utils");
const getNextConfig = (nextConfigPath) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let nextConfig = require(nextConfigPath);
    if (typeof nextConfig === 'function') {
        nextConfig = nextConfig([], {});
    }
    const res = {
        paths: [],
        domains: (_a = nextConfig.i18n) === null || _a === void 0 ? void 0 : _a.domains,
        trailingSlash: nextConfig.trailingSlash,
    };
    if (nextConfig.exportPathMap) {
        const pathMap = yield nextConfig.exportPathMap({}, {});
        res.paths = Object.keys(pathMap);
    }
    return res;
});
exports.getNextConfig = getNextConfig;
const getPathsFromDirectory = ({ rootPath, directoryPath, excludeExtns, excludeIdx, }) => {
    const fileNames = fs_1.default.readdirSync(directoryPath);
    let paths = [];
    for (const fileName of fileNames) {
        if (utils_1.isReservedPage(fileName))
            continue;
        const nextPath = directoryPath + path_1.default.sep + fileName;
        const isFolder = fs_1.default.lstatSync(nextPath).isDirectory();
        if (isFolder) {
            const directoryPaths = getPathsFromDirectory({
                rootPath,
                directoryPath: nextPath,
                excludeExtns,
                excludeIdx,
            });
            paths = [...paths, ...directoryPaths];
            continue;
        }
        const [fileNameWithoutExtn, fileExtn] = utils_1.splitFilenameAndExtn(fileName);
        if (utils_1.isExcludedExtn(fileExtn, excludeExtns))
            continue;
        const newDirectoryPath = directoryPath
            .replace(rootPath, '')
            .replace(path_1.default.sep, '/');
        const pagePath = `${newDirectoryPath}/${excludeIdx && fileNameWithoutExtn === 'index' ? '' : fileNameWithoutExtn}`;
        paths.push(pagePath);
    }
    return paths;
};
exports.getPathsFromDirectory = getPathsFromDirectory;
const getSitemapUrls = ({ paths, pagesConfig, }) => {
    const pagesConfigKeys = Object.keys(pagesConfig);
    const [foldersConfig, filesConfig] = utils_1.splitFoldersAndFiles(pagesConfigKeys);
    return paths.map((pagePath) => {
        var _a, _b;
        const matchingPath = utils_1.findMatch(pagePath, foldersConfig, filesConfig);
        const pageConfig = matchingPath ? pagesConfig[matchingPath] : undefined;
        const priority = (_a = pageConfig === null || pageConfig === void 0 ? void 0 : pageConfig.priority) !== null && _a !== void 0 ? _a : '';
        const changefreq = (_b = pageConfig === null || pageConfig === void 0 ? void 0 : pageConfig.changefreq) !== null && _b !== void 0 ? _b : '';
        return { pagePath, priority, changefreq };
    });
};
exports.getSitemapUrls = getSitemapUrls;
