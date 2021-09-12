export interface ISitemapIndexWriterInterface {
  write: () => Promise<void>;
}

export interface ISitemapIndexWriter {
  sitemapsNames: string[];
  sitemapUrl: string;
  targetDirectory: string;
}
