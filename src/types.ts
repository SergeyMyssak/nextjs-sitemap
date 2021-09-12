import {
  IDomain,
  IPagesConfig,
  ISitemapStylesheet,
} from './ConfigExtractor/types';
import { ISitemapWriterResultItem } from './SitemapWriter/types';

export interface ISitemapGeneratorConstructor {
  new (config: ISitemapGenerator): ISitemapGeneratorInterface;
}

export interface ISitemapGeneratorInterface {
  generateSitemap: () => Promise<ISitemapWriterResultItem[]>;
  regenerateSitemapIndex: (sitemapsNames: string[]) => void;
}

interface ISitemapGenerator {
  domains?: IDomain[];
  exclude?: string[];
  excludeExtensions?: string[];
  excludeIndex?: boolean;
  include?: string[];
  trailingSlash?: boolean;
  nextConfigPath?: string;
  pagesConfig?: IPagesConfig;
  pagesDirectory: string;
  targetDirectory: string;
  sitemapUrl?: string;
  sitemapSize?: number;
  sitemapStylesheet?: ISitemapStylesheet[];
}

export default ISitemapGenerator;
