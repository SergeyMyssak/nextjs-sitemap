import fs from 'fs';
import path from 'path';
import IConfig, {
  IPagesConfig,
  IPathMap,
  ISitemapSite,
  ISitemapStylesheet,
  IWriteSitemap,
  IWriteXmlUrl,
} from './types';
import {
  getPathMap,
  getSitemap,
  getUrlWithLocaleSubdomain,
  getXmlUrl,
} from './utils';

class Core {
  private xmlHeader = '<?xml version="1.0" encoding="UTF-8" ?>\n';
  private xmlURLSet = `<urlset xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 
    http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd" 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xhtml="http://www.w3.org/1999/xhtml">`;

  private baseUrl: string;
  private exclude: string[];
  private excludeExtensions: string[];
  private excludeIndex: boolean;
  private include: string[];
  private isSubdomain: boolean;
  private langs?: string[];
  private nextConfigPath?: string;
  private pagesConfig: IPagesConfig;
  private pagesDirectory: string;
  private sitemapStylesheet: ISitemapStylesheet[];
  private targetDirectory: string;

  constructor(config: IConfig) {
    if (!config) throw new Error('Config is mandatory');

    const {
      baseUrl,
      exclude = [],
      excludeExtensions = [],
      excludeIndex = true,
      include = [],
      isSubdomain = false,
      langs,
      nextConfigPath,
      pagesConfig = {},
      pagesDirectory,
      sitemapStylesheet = [],
      targetDirectory,
    } = config;

    this.baseUrl = baseUrl;
    this.include = include;
    this.excludeExtensions = excludeExtensions;
    this.exclude = exclude;
    this.excludeIndex = excludeIndex;
    this.isSubdomain = isSubdomain;
    this.langs = langs;
    this.nextConfigPath = nextConfigPath;
    this.pagesConfig = pagesConfig;
    this.pagesDirectory = pagesDirectory;
    this.sitemapStylesheet = sitemapStylesheet;
    this.targetDirectory = targetDirectory;
  }

  public generateSitemap = async (): Promise<void> => {
    const pathMap: IPathMap = getPathMap({
      folderPath: this.pagesDirectory,
      rootPath: this.pagesDirectory,
      excludeExtns: this.excludeExtensions,
      excludeIdx: this.excludeIndex,
    });

    const sitemap: ISitemapSite[] = await getSitemap({
      pathMap,
      include: this.include,
      pagesConfig: this.pagesConfig,
      nextConfigPath: this.nextConfigPath,
    });

    const filteredSitemap: ISitemapSite[] = sitemap.filter(
      (url: ISitemapSite) => !this.exclude.includes(url.pagePath),
    );

    this.writeHeader();
    this.writeSitemap({
      sitemap: filteredSitemap,
    });
    this.writeFooter();
  };

  private writeHeader = async (): Promise<void> => {
    const xmlStyles =
      this.sitemapStylesheet?.reduce(
        (accum: string, { type, styleFile }: ISitemapStylesheet): string =>
          accum + `<?xml-stylesheet href="${styleFile}" type="${type}" ?>\n`,
        '',
      ) ?? '';

    fs.writeFileSync(
      path.resolve(this.targetDirectory, './sitemap.xml'),
      this.xmlHeader + xmlStyles + this.xmlURLSet,
      { flag: 'w' },
    );
  };

  private writeSitemap = ({ sitemap }: IWriteSitemap): void => {
    if (!this.langs) {
      sitemap.forEach((url: ISitemapSite): void => {
        this.writeXmlUrl({
          baseUrl: this.baseUrl,
          url,
        });
      });
      return;
    }

    this.langs.forEach((lang: string): void => {
      const localizedBaseUrl = this.isSubdomain
        ? getUrlWithLocaleSubdomain(this.baseUrl, lang)
        : `${this.baseUrl}/${lang}`;

      sitemap.forEach((url: ISitemapSite): void => {
        const alternateUrls = this.langs?.reduce(
          (accum: string, alternateLang: string): string => {
            const localizedAlternateUrl = this.isSubdomain
              ? getUrlWithLocaleSubdomain(this.baseUrl, alternateLang)
              : `${this.baseUrl}/${alternateLang}`;

            return (
              accum +
              `\n\t\t<xhtml:link rel="alternate" hreflang="${alternateLang}" href="${localizedAlternateUrl}${url.pagePath}" />`
            );
          },
          '',
        );

        this.writeXmlUrl({
          baseUrl: localizedBaseUrl,
          url,
          alternateUrls,
        });
      });
    });
  };

  private writeXmlUrl = ({ baseUrl, url, alternateUrls }: IWriteXmlUrl): void =>
    fs.writeFileSync(
      path.resolve(this.targetDirectory, './sitemap.xml'),
      getXmlUrl({ baseUrl, url, alternateUrls }),
      { flag: 'as' },
    );

  private writeFooter = (): void =>
    fs.writeFileSync(
      path.resolve(this.targetDirectory, './sitemap.xml'),
      '\n</urlset>',
      { flag: 'as' },
    );
}

module.exports = Core;
