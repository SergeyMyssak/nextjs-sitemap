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
const SitemapWriter_1 = __importDefault(require("./SitemapWriter"));
const SitemapIndexWriter_1 = __importDefault(require("./SitemapIndexWriter"));
const ConfigExtractor_1 = __importDefault(require("./ConfigExtractor"));
class SitemapGenerator {
    constructor(config) {
        this.generateSitemap = () => __awaiter(this, void 0, void 0, function* () {
            const configExtractor = new ConfigExtractor_1.default({
                domains: this.domains,
                exclude: this.exclude,
                excludeExtensions: this.excludeExtensions,
                excludeIndex: this.excludeIndex,
                include: this.include,
                trailingSlash: this.trailingSlash,
                nextConfigPath: this.nextConfigPath,
                pagesConfig: this.pagesConfig,
                pagesDirectory: this.pagesDirectory,
            });
            const config = yield configExtractor.extract();
            const sitemapWriter = new SitemapWriter_1.default({
                config,
                targetDirectory: this.targetDirectory,
                sitemapSize: this.sitemapSize,
                sitemapStylesheet: this.sitemapStylesheet,
            });
            const { sitemaps, number } = sitemapWriter.write();
            if (number > 1) {
                const sitemapsNames = sitemaps.map(({ name }) => name);
                this.writeSitemapIndex(sitemapsNames);
            }
            return sitemaps;
        });
        this.regenerateSitemapIndex = (sitemapsNames) => this.writeSitemapIndex(sitemapsNames);
        this.writeSitemapIndex = (sitemapsNames) => {
            if (!this.sitemapUrl) {
                throw new Error("'sitemapUrl' is required");
            }
            const sitemapIndexWriter = new SitemapIndexWriter_1.default({
                sitemapsNames,
                sitemapUrl: this.sitemapUrl,
                targetDirectory: this.targetDirectory,
            });
            sitemapIndexWriter.write();
        };
        if (!config) {
            throw new Error('Config is required');
        }
        const { domains = [], exclude = [], excludeExtensions = [], excludeIndex = true, include = [], trailingSlash = false, nextConfigPath, pagesConfig = {}, pagesDirectory, targetDirectory, sitemapUrl, sitemapSize = 50000, sitemapStylesheet = [], } = config;
        this.domains = domains;
        this.excludeExtensions = excludeExtensions;
        this.exclude = exclude;
        this.excludeIndex = excludeIndex;
        this.include = include;
        this.trailingSlash = trailingSlash;
        this.nextConfigPath = nextConfigPath;
        this.pagesConfig = pagesConfig;
        this.pagesDirectory = pagesDirectory;
        this.targetDirectory = targetDirectory;
        this.sitemapUrl = sitemapUrl;
        this.sitemapSize = sitemapSize;
        this.sitemapStylesheet = sitemapStylesheet;
    }
}
function configureSitemap(config) {
    const sitemapGenerator = SitemapGenerator;
    return new sitemapGenerator(config);
}
exports.configureSitemap = configureSitemap;
