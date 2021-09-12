import {
  getNextConfig,
  getPathsFromDirectory,
  getSitemapUrls,
} from './helpers';
import {
  IConfigExtractor,
  IConfigExtractorInterface,
  IConfigExtractorResult,
  IDomain,
  IPagesConfig,
  ISitemapUrl,
} from './types';
import { splitFoldersAndFiles, findMatch } from './utils';

class ConfigExtractor implements IConfigExtractorInterface {
  private domains: IDomain[];
  private exclude: string[];
  private excludeExtensions: string[];
  private excludeIndex: boolean;
  private trailingSlash: boolean;
  private include: string[];
  private nextConfigPath?: string;
  private pagesConfig: IPagesConfig;
  private pagesDirectory: string;

  constructor(props: IConfigExtractor) {
    const {
      domains,
      exclude = [],
      excludeExtensions = [],
      excludeIndex = true,
      include = [],
      trailingSlash = false,
      nextConfigPath,
      pagesConfig = {},
      pagesDirectory,
    } = props;

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

  public extract = async (): Promise<IConfigExtractorResult> => {
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

    const sitemapUrls: ISitemapUrl[] = getSitemapUrls({
      paths: [...filteredPaths, ...this.include],
      pagesConfig: this.pagesConfig,
    });

    return {
      sitemapUrls,
      domains: nextDomains || this.domains,
      trailingSlash: nextTrailingSlash || this.trailingSlash,
    };
  };
}

export default ConfigExtractor;
