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
const date_fns_1 = require("date-fns");
const constants_1 = require("./constants");
class SitemapIndexWriter {
    constructor(props) {
        this.write = () => __awaiter(this, void 0, void 0, function* () {
            this.writeHeader();
            this.writeBody();
            this.writeFooter();
        });
        this.writeHeader = () => __awaiter(this, void 0, void 0, function* () {
            fs_1.default.writeFileSync(path_1.default.resolve(this.targetDirectory, './sitemap.xml'), constants_1.HEADER + constants_1.URL_SET, { flag: 'w' });
        });
        this.writeBody = () => {
            this.sitemapsNames.forEach((name) => {
                const date = date_fns_1.format(new Date(), 'yyyy-MM-dd');
                fs_1.default.writeFileSync(path_1.default.resolve(this.targetDirectory, './sitemap.xml'), `
    <sitemap>
        <loc>${this.sitemapUrl}/${name}</loc>
        <lastmod>${date}</lastmod>
    </sitemap>`, { flag: 'as' });
            });
        };
        this.writeFooter = () => fs_1.default.writeFileSync(path_1.default.resolve(this.targetDirectory, './sitemap.xml'), '\n</sitemapindex>', { flag: 'as' });
        const { sitemapsNames, sitemapUrl, targetDirectory } = props;
        this.sitemapsNames = sitemapsNames;
        this.sitemapUrl = sitemapUrl;
        this.targetDirectory = targetDirectory;
    }
}
exports.default = SitemapIndexWriter;
