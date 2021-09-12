import ISitemapGenerator, {
  ISitemapGeneratorConstructor,
  ISitemapGeneratorInterface,
} from './types';
import SitemapWriter from './SitemapWriter';
import SitemapIndexWriter from './SitemapIndexWriter';
import ConfigExtractor from './ConfigExtractor';
import {
  IConfigExtractorResult,
  IDomain,
  IPagesConfig,
  ISitemapStylesheet,
} from './ConfigExtractor/types';
import { ISitemapWriterResultItem } from './SitemapWriter/types';

class SitemapGenerator implements ISitemapGeneratorInterface {
  private domains: IDomain[];
  private exclude: string[];
  private excludeExtensions: string[];
  private excludeIndex: boolean;
  private include: string[];
  private trailingSlash: boolean;
  private nextConfigPath?: string;
  private pagesConfig: IPagesConfig;
  private pagesDirectory: string;
  private sitemapUrl?: string;
  private sitemapSize: number;
  private sitemapStylesheet: ISitemapStylesheet[];
  private targetDirectory: string;

  constructor(config: ISitemapGenerator) {
    if (!config) {
      throw new Error('Config is required');
    }

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
      targetDirectory,
      sitemapUrl,
      sitemapSize = 50000,
      sitemapStylesheet = [],
    } = config;

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

  public generateSitemap = async (): Promise<ISitemapWriterResultItem[]> => {
    const configExtractor = new ConfigExtractor({
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

    const config: IConfigExtractorResult = await configExtractor.extract();

    const sitemapWriter = new SitemapWriter({
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
  };

  public regenerateSitemapIndex = (sitemapsNames: string[]): void =>
    this.writeSitemapIndex(sitemapsNames);

  private writeSitemapIndex = (sitemapsNames: string[]) => {
    if (!this.sitemapUrl) {
      throw new Error("'sitemapUrl' is required");
    }

    const sitemapIndexWriter = new SitemapIndexWriter({
      sitemapsNames,
      sitemapUrl: this.sitemapUrl,
      targetDirectory: this.targetDirectory,
    });

    sitemapIndexWriter.write();
  };
}

export function configureSitemap(
  config: ISitemapGenerator,
): ISitemapGeneratorInterface {
  const sitemapGenerator: ISitemapGeneratorConstructor = SitemapGenerator;

  return new sitemapGenerator(config);
}
