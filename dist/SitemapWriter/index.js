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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const constants_1 = require("./constants");
const helpers_1 = require("./helpers");
class SitemapWriter {
    constructor(props) {
        this.currentSitemapIndex = 0;
        this.sitemaps = [
            { name: 'sitemap.xml', count: 0 },
        ];
        this.write = () => {
            this.writeHeader();
            this.writeBody();
            this.writeFooter();
            return {
                sitemaps: this.sitemaps,
                number: this.sitemaps.length,
            };
        };
        this.writeHeader = () => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const xmlStyles = (_b = (_a = this.sitemapStylesheet) === null || _a === void 0 ? void 0 : _a.reduce((accum, { type, styleFile }) => accum + `<?xml-stylesheet href="${styleFile}" type="${type}" ?>\n`, '')) !== null && _b !== void 0 ? _b : '';
            fs_1.default.writeFileSync(path_1.default.resolve(this.targetDirectory, this.sitemaps[this.currentSitemapIndex].name), constants_1.HEADER + xmlStyles + constants_1.URL_SET, { flag: 'w' });
        });
        this.writeBody = () => {
            const { sitemapUrls, domains, trailingSlash } = this.config;
            domains.forEach(({ domain, defaultLocale, locales, http }) => {
                const baseUrl = helpers_1.getBaseUrl({ domain, http });
                sitemapUrls.forEach((route) => {
                    let alternativeUrls = defaultLocale
                        ? helpers_1.getAlternativePath({
                            baseUrl,
                            route: route.pagePath,
                            hreflang: defaultLocale,
                            trailingSlash,
                        })
                        : '';
                    locales === null || locales === void 0 ? void 0 : locales.forEach((alternativeLang) => {
                        alternativeUrls += helpers_1.getAlternativePath({
                            baseUrl,
                            route: route.pagePath,
                            hreflang: alternativeLang,
                            lang: alternativeLang,
                            trailingSlash,
                        });
                    });
                    if (defaultLocale) {
                        this.writeXmlUrl({
                            baseUrl,
                            route,
                            alternativeUrls,
                            trailingSlash,
                        });
                    }
                    locales === null || locales === void 0 ? void 0 : locales.forEach((lang) => {
                        this.writeXmlUrl({
                            baseUrl: `${baseUrl}/${lang}`,
                            route,
                            alternativeUrls,
                            trailingSlash,
                        });
                    });
                });
            });
        };
        this.writeXmlUrl = ({ baseUrl, route, alternativeUrls, trailingSlash, }) => {
            if (this.sitemaps[this.currentSitemapIndex].count > this.sitemapSize) {
                this.writeFooter();
                if (this.currentSitemapIndex === 0) {
                    const newSitemapName = helpers_1.getNewSitemapName(this.currentSitemapIndex);
                    fs_1.default.renameSync(path_1.default.resolve(this.targetDirectory, this.sitemaps[this.currentSitemapIndex].name), path_1.default.resolve(this.targetDirectory, newSitemapName));
                    this.sitemaps[this.currentSitemapIndex].name = newSitemapName;
                }
                this.currentSitemapIndex++;
                this.sitemaps.push({
                    name: helpers_1.getNewSitemapName(this.currentSitemapIndex),
                    count: 0,
                });
                this.writeHeader();
            }
            this.sitemaps[this.currentSitemapIndex].count++;
            fs_1.default.writeFileSync(path_1.default.resolve(this.targetDirectory, this.sitemaps[this.currentSitemapIndex].name), helpers_1.getXmlUrl({
                baseUrl,
                route,
                alternativeUrls,
                trailingSlash,
            }), { flag: 'as' });
        };
        this.writeFooter = () => fs_1.default.writeFileSync(path_1.default.resolve(this.targetDirectory, this.sitemaps[this.currentSitemapIndex].name), '\n</urlset>', { flag: 'as' });
        const { config, targetDirectory, sitemapSize, sitemapStylesheet } = props;
        this.config = config;
        this.targetDirectory = targetDirectory;
        this.sitemapSize = sitemapSize;
        this.sitemapStylesheet = sitemapStylesheet;
    }
}
exports.default = SitemapWriter;
