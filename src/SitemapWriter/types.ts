import {
  IConfigExtractorResult,
  ISitemapStylesheet,
  ISitemapUrl,
} from '../ConfigExtractor/types';

export interface ISitemapWriterInterface {
  write: () => ISitemapWriterResult;
}

export interface ISitemapWriter {
  config: IConfigExtractorResult;
  targetDirectory: string;
  sitemapSize: number;
  sitemapStylesheet: ISitemapStylesheet[];
}

export interface ISitemapWriterResult {
  sitemaps: ISitemapWriterResultItem[];
  number: number;
}

export interface ISitemapWriterResultItem {
  name: string;
  count: number;
}

export interface IGetAlternativePath {
  baseUrl: string;
  route: string;
  hreflang: string;
  lang?: string;
  trailingSlash: boolean;
}

export interface IGetBaseUrl {
  domain: string;
  http?: boolean;
}

export interface IGetXmlUrl {
  baseUrl: string;
  route: ISitemapUrl;
  alternativeUrls?: string;
  trailingSlash: boolean;
}

export interface IWriteXmlUrl {
  baseUrl: string;
  route: ISitemapUrl;
  alternativeUrls?: string;
  trailingSlash: boolean;
}
