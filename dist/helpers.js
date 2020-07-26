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
exports.getSitemap = exports.getPathsFromNextConfig = exports.getPaths = exports.getXmlUrl = exports.getLocalizedSubdomainUrl = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const date_fns_1 = require("date-fns");
const utils_1 = require("./utils");
const getLocalizedSubdomainUrl = (baseUrl, lang) => {
    const protocolAndHostname = baseUrl.split('//');
    protocolAndHostname[1] = `${lang}.${protocolAndHostname[1]}`;
    return protocolAndHostname.join('//');
};
exports.getLocalizedSubdomainUrl = getLocalizedSubdomainUrl;
const getXmlUrl = ({ baseUrl, url, alternateUrls = '', }) => {
    const { pagePath, priority, changefreq } = url;
    const date = date_fns_1.format(new Date(), 'yyyy-MM-dd');
    const xmlChangefreq = changefreq
        ? `
        <changefreq>${changefreq}</changefreq>`
        : '';
    const xmlPriority = priority
        ? `
        <priority>${priority}</priority>`
        : '';
    return `
    <url>
        <loc>${baseUrl}${pagePath}</loc>
        <lastmod>${date}</lastmod>${xmlChangefreq}${xmlPriority}${alternateUrls}
    </url>`;
};
exports.getXmlUrl = getXmlUrl;
const getPaths = ({ folderPath, rootPath, excludeExtns, excludeIdx, }) => {
    const fileNames = fs_1.default.readdirSync(folderPath);
    let paths = [];
    for (const fileName of fileNames) {
        if (utils_1.isReservedPage(fileName))
            continue;
        const nextPath = folderPath + path_1.default.sep + fileName;
        const isFolder = fs_1.default.lstatSync(nextPath).isDirectory();
        if (isFolder) {
            const pathsInFolder = getPaths({
                folderPath: nextPath,
                rootPath,
                excludeExtns,
                excludeIdx,
            });
            paths = [...paths, ...pathsInFolder];
            continue;
        }
        const [fileNameWithoutExtn, fileExtn] = utils_1.splitFilenameAndExtn(fileName);
        if (utils_1.isExcludedExtn(fileExtn, excludeExtns))
            continue;
        const newFolderPath = folderPath
            .replace(rootPath, '')
            .replace(path_1.default.sep, '/');
        const pagePath = `${newFolderPath}/${excludeIdx && fileNameWithoutExtn === 'index' ? '' : fileNameWithoutExtn}`;
        paths.push(pagePath);
    }
    return paths;
};
exports.getPaths = getPaths;
const getPathsFromNextConfig = (nextConfigPath) => __awaiter(void 0, void 0, void 0, function* () {
    let nextConfig = require(nextConfigPath);
    if (typeof nextConfig === 'function') {
        nextConfig = nextConfig([], {});
    }
    if (nextConfig && nextConfig.exportPathMap) {
        const { exportPathMap } = nextConfig;
        const pathMap = yield exportPathMap({}, {});
        return Object.keys(pathMap);
    }
    return [];
});
exports.getPathsFromNextConfig = getPathsFromNextConfig;
const getSitemap = ({ paths, include, pagesConfig, isTrailingSlashRequired, }) => __awaiter(void 0, void 0, void 0, function* () {
    const pagesConfigKeys = Object.keys(pagesConfig);
    const [foldersConfig, filesConfig] = utils_1.splitFoldersAndFiles(pagesConfigKeys);
    const newPaths = [...paths, ...include];
    return newPaths.map((pagePath) => {
        var _a, _b;
        const formattedPagePath = isTrailingSlashRequired
            ? utils_1.appendTrailingSlash(pagePath)
            : utils_1.removeTrailingSlash(pagePath);
        const matchingPath = utils_1.findMatch(pagePath, foldersConfig, filesConfig);
        const pageConfig = matchingPath ? pagesConfig[matchingPath] : undefined;
        const priority = (_a = pageConfig === null || pageConfig === void 0 ? void 0 : pageConfig.priority) !== null && _a !== void 0 ? _a : '';
        const changefreq = (_b = pageConfig === null || pageConfig === void 0 ? void 0 : pageConfig.changefreq) !== null && _b !== void 0 ? _b : '';
        return { pagePath: formattedPagePath, priority, changefreq };
    });
});
exports.getSitemap = getSitemap;
