import fs from 'fs';
import path from 'path';
import {
  getAlternativePath,
  getBaseUrl,
  getNextConfig,
  getPathsFromDirectory,
  getSitemap,
  getXmlUrl,
} from './helpers';
import IConfig, {
  ICoreConstructor,
  ICoreInterface,
  IDomain,
  IPagesConfig,
  ISitemapSite,
  ISitemapStylesheet,
  IWriteSitemap,
  IWriteXmlUrl,
} from './types';
import { splitFoldersAndFiles, findMatch } from './utils';

class Core implements ICoreInterface {
  private xmlHeader = '<?xml version="1.0" encoding="UTF-8" ?>\n';
  private xmlURLSet = `<urlset xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 
    http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd" 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xhtml="http://www.w3.org/1999/xhtml">`;

  private domains: IDomain[];
  private exclude: string[];
  private excludeExtensions: string[];
  private excludeIndex: boolean;
  private include: string[];
  private trailingSlash: boolean;
  private nextConfigPath?: string;
  private pagesConfig: IPagesConfig;
  private pagesDirectory: string;
  private sitemapStylesheet: ISitemapStylesheet[];
  private targetDirectory: string;

  constructor(config: IConfig) {
    if (!config) throw new Error('Config is mandatory');

    const {
      domains = [],
      exclude = [],
      excludeExtensions = [],
      excludeIndex = true,
      include = [],
      trailingSlash = false,
      nextConfigPath,
      pagesConfig = {},
      pagesDirectory,
      sitemapStylesheet = [],
      targetDirectory,
    } = config;

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

  public generateSitemap = async (): Promise<void> => {
    let paths: string[];
    let nextDomains: IDomain[] | undefined;
    let nextTrailingSlash: boolean | undefined;

    if (this.nextConfigPath) {
      const nextConfig = await getNextConfig(this.nextConfigPath);
      paths = nextConfig.paths;
      nextDomains = nextConfig.domains;
      nextTrailingSlash = nextConfig.trailingSlash;
    } else {
      paths = getPathsFromDirectory({
        rootPath: this.pagesDirectory,
        directoryPath: this.pagesDirectory,
        excludeExtns: this.excludeExtensions,
        excludeIdx: this.excludeIndex,
      });
    }

    const [excludeFolders, excludeFiles] = splitFoldersAndFiles(this.exclude);
    const filteredPaths: string[] = paths.filter(
      (path: string) => !findMatch(path, excludeFolders, excludeFiles),
    );

    const sitemap: ISitemapSite[] = getSitemap({
      paths: [...filteredPaths, ...this.include],
      pagesConfig: this.pagesConfig,
    });

    this.writeHeader();
    this.writeSitemap({ sitemap, nextDomains, nextTrailingSlash });
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

  private writeSitemap = ({
    sitemap,
    nextDomains,
    nextTrailingSlash,
  }: IWriteSitemap): void => {
    const domains = nextDomains || this.domains;
    const trailingSlash = nextTrailingSlash || this.trailingSlash;

    domains.forEach(({ domain, defaultLocale, locales, http }): void => {
      const baseUrl = getBaseUrl({ domain, http });

      sitemap.forEach((route: ISitemapSite): void => {
        let alternativeUrls = defaultLocale
          ? getAlternativePath({
              baseUrl,
              route: route.pagePath,
              hreflang: defaultLocale,
              trailingSlash,
            })
          : '';

        locales?.forEach((alternativeLang: string): void => {
          alternativeUrls += getAlternativePath({
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

        locales?.forEach((lang: string): void => {
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

  private writeXmlUrl = ({
    baseUrl,
    route,
    alternativeUrls,
    trailingSlash,
  }: IWriteXmlUrl): void =>
    fs.writeFileSync(
      path.resolve(this.targetDirectory, './sitemap.xml'),
      getXmlUrl({
        baseUrl,
        route,
        alternativeUrls,
        trailingSlash,
      }),
      { flag: 'as' },
    );

  private writeFooter = (): void =>
    fs.writeFileSync(
      path.resolve(this.targetDirectory, './sitemap.xml'),
      '\n</urlset>',
      { flag: 'as' },
    );
}

export function configureSitemap(config: IConfig): ICoreInterface {
  const Sitemap: ICoreConstructor = Core;
  return new Sitemap(config);
}
