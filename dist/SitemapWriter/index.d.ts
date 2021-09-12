import { ISitemapWriter, ISitemapWriterInterface, ISitemapWriterResult } from './types';
declare class SitemapWriter implements ISitemapWriterInterface {
    private currentSitemapIndex;
    private sitemaps;
    private config;
    private targetDirectory;
    private sitemapSize;
    private sitemapStylesheet;
    constructor(props: ISitemapWriter);
    write: () => ISitemapWriterResult;
    private writeHeader;
    private writeBody;
    private writeXmlUrl;
    private writeFooter;
}
export default SitemapWriter;
