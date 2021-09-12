import fs from 'fs';
import path from 'path';

import { HEADER, URL_SET } from './constants';
import {
  getAlternativePath,
  getBaseUrl,
  getNewSitemapName,
  getXmlUrl,
} from './helpers';
import {
  ISitemapWriter,
  ISitemapWriterInterface,
  ISitemapWriterResult,
  ISitemapWriterResultItem,
  IWriteXmlUrl,
} from './types';
import {
  IConfigExtractorResult,
  ISitemapStylesheet,
  ISitemapUrl,
} from '../ConfigExtractor/types';

class SitemapWriter implements ISitemapWriterInterface {
  private currentSitemapIndex = 0;
  private sitemaps: ISitemapWriterResultItem[] = [
    { name: 'sitemap.xml', count: 0 },
  ];

  private config: IConfigExtractorResult;
  private targetDirectory: string;
  private sitemapSize: number;
  private sitemapStylesheet: ISitemapStylesheet[];

  constructor(props: ISitemapWriter) {
    const { config, targetDirectory, sitemapSize, sitemapStylesheet } = props;

    this.config = config;
    this.targetDirectory = targetDirectory;
    this.sitemapSize = sitemapSize;
    this.sitemapStylesheet = sitemapStylesheet;
  }

  public write = (): ISitemapWriterResult => {
    this.writeHeader();
    this.writeBody();
    this.writeFooter();

    return {
      sitemaps: this.sitemaps,
      number: this.sitemaps.length,
    };
  };

  private writeHeader = async (): Promise<void> => {
    const xmlStyles =
      this.sitemapStylesheet?.reduce(
        (accum: string, { type, styleFile }: ISitemapStylesheet): string =>
          accum + `<?xml-stylesheet href="${styleFile}" type="${type}" ?>\n`,
        '',
      ) ?? '';

    fs.writeFileSync(
      path.resolve(
        this.targetDirectory,
        this.sitemaps[this.currentSitemapIndex].name,
      ),
      HEADER + xmlStyles + URL_SET,
      { flag: 'w' },
    );
  };

  private writeBody = (): void => {
    const { sitemapUrls, domains, trailingSlash } = this.config;

    domains.forEach(({ domain, defaultLocale, locales, http }): void => {
      const baseUrl = getBaseUrl({ domain, http });

      sitemapUrls.forEach((route: ISitemapUrl): void => {
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
  }: IWriteXmlUrl): void => {
    if (this.sitemaps[this.currentSitemapIndex].count > this.sitemapSize) {
      this.writeFooter();

      if (this.currentSitemapIndex === 0) {
        const newSitemapName = getNewSitemapName(this.currentSitemapIndex);

        fs.renameSync(
          path.resolve(
            this.targetDirectory,
            this.sitemaps[this.currentSitemapIndex].name,
          ),
          path.resolve(this.targetDirectory, newSitemapName),
        );

        this.sitemaps[this.currentSitemapIndex].name = newSitemapName;
      }

      this.currentSitemapIndex++;
      this.sitemaps.push({
        name: getNewSitemapName(this.currentSitemapIndex),
        count: 0,
      });
      this.writeHeader();
    }

    this.sitemaps[this.currentSitemapIndex].count++;
    fs.writeFileSync(
      path.resolve(
        this.targetDirectory,
        this.sitemaps[this.currentSitemapIndex].name,
      ),
      getXmlUrl({
        baseUrl,
        route,
        alternativeUrls,
        trailingSlash,
      }),
      { flag: 'as' },
    );
  };

  private writeFooter = (): void =>
    fs.writeFileSync(
      path.resolve(
        this.targetDirectory,
        this.sitemaps[this.currentSitemapIndex].name,
      ),
      '\n</urlset>',
      { flag: 'as' },
    );
}

export default SitemapWriter;
