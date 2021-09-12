import fs from 'fs';
import path from 'path';
import { format } from 'date-fns';

import { HEADER, URL_SET } from './constants';
import { ISitemapIndexWriter, ISitemapIndexWriterInterface } from './types';

class SitemapIndexWriter implements ISitemapIndexWriterInterface {
  private sitemapsNames: string[];
  private sitemapUrl: string;
  private targetDirectory: string;

  constructor(props: ISitemapIndexWriter) {
    const { sitemapsNames, sitemapUrl, targetDirectory } = props;

    this.sitemapsNames = sitemapsNames;
    this.sitemapUrl = sitemapUrl;
    this.targetDirectory = targetDirectory;
  }

  public write = async (): Promise<void> => {
    this.writeHeader();
    this.writeBody();
    this.writeFooter();
  };

  private writeHeader = async (): Promise<void> => {
    fs.writeFileSync(
      path.resolve(this.targetDirectory, './sitemap.xml'),
      HEADER + URL_SET,
      { flag: 'w' },
    );
  };

  private writeBody = (): void => {
    this.sitemapsNames.forEach((name): void => {
      const date = format(new Date(), 'yyyy-MM-dd');

      fs.writeFileSync(
        path.resolve(this.targetDirectory, './sitemap.xml'),
        `
    <sitemap>
        <loc>${this.sitemapUrl}/${name}</loc>
        <lastmod>${date}</lastmod>
    </sitemap>`,
        { flag: 'as' },
      );
    });
  };

  private writeFooter = (): void =>
    fs.writeFileSync(
      path.resolve(this.targetDirectory, './sitemap.xml'),
      '\n</sitemapindex>',
      { flag: 'as' },
    );
}

export default SitemapIndexWriter;
