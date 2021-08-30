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
exports.configureSitemap = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const helpers_1 = require("./helpers");
const utils_1 = require("./utils");
class Core {
    constructor(config) {
        this.xmlHeader = '<?xml version="1.0" encoding="UTF-8" ?>\n';
        this.xmlURLSet = `<urlset xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 
    http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd" 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xhtml="http://www.w3.org/1999/xhtml">`;
        this.generateSitemap = () => __awaiter(this, void 0, void 0, function* () {
            const paths = this.nextConfigPath
                ? yield helpers_1.getPathsFromNextConfig(this.nextConfigPath)
                : helpers_1.getPathsFromDirectory({
                    rootPath: this.pagesDirectory,
                    directoryPath: this.pagesDirectory,
                    excludeExtns: this.excludeExtensions,
                    excludeIdx: this.excludeIndex,
                });
            const [excludeFolders, excludeFiles] = utils_1.splitFoldersAndFiles(this.exclude);
            const filteredPaths = paths.filter((path) => !utils_1.findMatch(path, excludeFolders, excludeFiles));
            const sitemap = helpers_1.getSitemap({
                paths: [...filteredPaths, ...this.include],
                pagesConfig: this.pagesConfig,
            });
            this.writeHeader();
            this.writeSitemap({ sitemap });
            this.writeFooter();
        });
        this.writeHeader = () => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const xmlStyles = (_b = (_a = this.sitemapStylesheet) === null || _a === void 0 ? void 0 : _a.reduce((accum, { type, styleFile }) => accum + `<?xml-stylesheet href="${styleFile}" type="${type}" ?>\n`, '')) !== null && _b !== void 0 ? _b : '';
            fs_1.default.writeFileSync(path_1.default.resolve(this.targetDirectory, './sitemap.xml'), this.xmlHeader + xmlStyles + this.xmlURLSet, { flag: 'w' });
        });
        this.writeSitemap = ({ sitemap }) => {
            this.domains.forEach(({ domain, defaultLocale, locales, http }) => {
                const baseUrl = helpers_1.getBaseUrl({ domain, http });
                sitemap.forEach((route) => {
                    let alternativeUrls = defaultLocale
                        ? helpers_1.getAlternativePath({
                            baseUrl,
                            route: route.pagePath,
                            hreflang: defaultLocale,
                            trailingSlash: this.trailingSlash,
                        })
                        : '';
                    locales === null || locales === void 0 ? void 0 : locales.forEach((alternativeLang) => {
                        alternativeUrls += helpers_1.getAlternativePath({
                            baseUrl,
                            route: route.pagePath,
                            hreflang: alternativeLang,
                            lang: alternativeLang,
                            trailingSlash: this.trailingSlash,
                        });
                    });
                    if (defaultLocale) {
                        this.writeXmlUrl({ baseUrl, route, alternativeUrls });
                    }
                    locales === null || locales === void 0 ? void 0 : locales.forEach((lang) => {
                        this.writeXmlUrl({
                            baseUrl: `${baseUrl}/${lang}`,
                            route,
                            alternativeUrls,
                        });
                    });
                });
            });
        };
        this.writeXmlUrl = ({ baseUrl, route, alternativeUrls, }) => fs_1.default.writeFileSync(path_1.default.resolve(this.targetDirectory, './sitemap.xml'), helpers_1.getXmlUrl({
            baseUrl,
            route,
            alternativeUrls,
            trailingSlash: this.trailingSlash,
        }), { flag: 'as' });
        this.writeFooter = () => fs_1.default.writeFileSync(path_1.default.resolve(this.targetDirectory, './sitemap.xml'), '\n</urlset>', { flag: 'as' });
        if (!config)
            throw new Error('Config is mandatory');
        const { domains = [], exclude = [], excludeExtensions = [], excludeIndex = true, include = [], trailingSlash = false, nextConfigPath, pagesConfig = {}, pagesDirectory, sitemapStylesheet = [], targetDirectory, } = config;
        this.domains = domains;
        this.include = include;
        this.excludeExtensions = excludeExtensions;
        this.exclude = exclude;
        this.excludeIndex = excludeIndex;
        this.trailingSlash = trailingSlash;
        this.nextConfigPath = nextConfigPath;
        this.pagesConfig = pagesConfig;
        this.pagesDirectory = pagesDirectory;
        this.sitemapStylesheet = sitemapStylesheet;
        this.targetDirectory = targetDirectory;
    }
}
function configureSitemap(config) {
    const Sitemap = Core;
    return new Sitemap(config);
}
exports.configureSitemap = configureSitemap;
