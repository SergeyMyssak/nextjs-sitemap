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
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./helpers");
const utils_1 = require("./utils");
class ConfigExtractor {
    constructor(props) {
        this.extract = () => __awaiter(this, void 0, void 0, function* () {
            let paths;
            let nextDomains;
            let nextTrailingSlash;
            if (this.nextConfigPath) {
                const nextConfig = yield helpers_1.getNextConfig(this.nextConfigPath);
                paths = nextConfig.paths;
                nextDomains = nextConfig.domains;
                nextTrailingSlash = nextConfig.trailingSlash;
            }
            else {
                paths = helpers_1.getPathsFromDirectory({
                    rootPath: this.pagesDirectory,
                    directoryPath: this.pagesDirectory,
                    excludeExtns: this.excludeExtensions,
                    excludeIdx: this.excludeIndex,
                });
            }
            const [excludeFolders, excludeFiles] = utils_1.splitFoldersAndFiles(this.exclude);
            const filteredPaths = paths.filter((path) => !utils_1.findMatch(path, excludeFolders, excludeFiles));
            const sitemapUrls = helpers_1.getSitemapUrls({
                paths: [...filteredPaths, ...this.include],
                pagesConfig: this.pagesConfig,
            });
            return {
                sitemapUrls,
                domains: nextDomains || this.domains,
                trailingSlash: nextTrailingSlash || this.trailingSlash,
            };
        });
        const { domains, exclude = [], excludeExtensions = [], excludeIndex = true, include = [], trailingSlash = false, nextConfigPath, pagesConfig = {}, pagesDirectory, } = props;
        this.domains = domains;
        this.include = include;
        this.excludeExtensions = excludeExtensions;
        this.exclude = exclude;
        this.excludeIndex = excludeIndex;
        this.trailingSlash = trailingSlash;
        this.nextConfigPath = nextConfigPath;
        this.pagesConfig = pagesConfig;
        this.pagesDirectory = pagesDirectory;
    }
}
exports.default = ConfigExtractor;
