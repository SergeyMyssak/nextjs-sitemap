export interface ICoreConstructor {
  new (config: IConfig): ICoreInterface;
}

export interface ICoreInterface {
  generateSitemap: () => Promise<void>;
}

interface IConfig {
  domains?: IDomain[];
  exclude?: string[];
  excludeExtensions?: string[];
  excludeIndex?: boolean;
  include?: string[];
  trailingSlash?: boolean;
  nextConfigPath?: string;
  pagesConfig?: IPagesConfig;
  pagesDirectory: string;
  sitemapStylesheet?: ISitemapStylesheet[];
  targetDirectory: string;
}

export interface IDomain {
  domain: string;
  defaultLocale?: string;
  locales?: string[];
  http?: boolean;
}

export interface IPagesConfig {
  [key: string]: {
    priority: string;
    changefreq: string;
  };
}

export interface ISitemapStylesheet {
  type: string;
  styleFile: string;
}

export interface ISitemapSite {
  pagePath: string;
  priority: string;
  changefreq: string;
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

export interface IGetSitemap {
  paths: string[];
  pagesConfig: IPagesConfig;
}

export interface IGetBaseUrl {
  domain: string;
  http?: boolean;
}

export interface IGetAlternativePath {
  baseUrl: string;
  route: string;
  hreflang: string;
  lang?: string;
  trailingSlash: boolean;
}

export interface IWriteSitemap {
  sitemap: ISitemapSite[];
  nextDomains?: IDomain[];
  nextTrailingSlash?: boolean;
}

export interface IGetXmlUrl {
  baseUrl: string;
  route: ISitemapSite;
  alternativeUrls?: string;
  trailingSlash: boolean;
}

export interface IWriteXmlUrl {
  baseUrl: string;
  route: ISitemapSite;
  alternativeUrls?: string;
  trailingSlash: boolean;
}

export default IConfig;
