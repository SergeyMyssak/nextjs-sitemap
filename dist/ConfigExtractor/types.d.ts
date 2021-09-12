export interface IConfigExtractorInterface {
    extract: () => Promise<IConfigExtractorResult>;
}
export interface IConfigExtractor {
    domains: IDomain[];
    exclude: string[];
    excludeExtensions: string[];
    excludeIndex: boolean;
    trailingSlash: boolean;
    include: string[];
    nextConfigPath?: string;
    pagesConfig: IPagesConfig;
    pagesDirectory: string;
}
export interface IConfigExtractorResult {
    sitemapUrls: ISitemapUrl[];
    domains: IDomain[];
    trailingSlash: boolean;
}
export interface IDomain {
    domain: string;
    defaultLocale?: string;
    locales?: string[];
    http?: boolean;
}
export interface ISitemapUrl {
    pagePath: string;
    priority: string;
    changefreq: string;
}
export interface ISitemapStylesheet {
    type: string;
    styleFile: string;
}
export interface IPagesConfig {
    [key: string]: {
        priority: string;
        changefreq: string;
    };
}
export interface INextConfig {
    paths: string[];
    domains?: IDomain[];
    trailingSlash: boolean;
}
export interface IGetPathMap {
    rootPath: string;
    directoryPath: string;
    excludeExtns: string[];
    excludeIdx?: boolean;
}
export interface IGetSitemapUrls {
    paths: string[];
    pagesConfig: IPagesConfig;
}
