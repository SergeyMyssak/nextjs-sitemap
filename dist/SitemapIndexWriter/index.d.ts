import { ISitemapIndexWriter, ISitemapIndexWriterInterface } from './types';
declare class SitemapIndexWriter implements ISitemapIndexWriterInterface {
    private sitemapsNames;
    private sitemapUrl;
    private targetDirectory;
    constructor(props: ISitemapIndexWriter);
    write: () => Promise<void>;
    private writeHeader;
    private writeBody;
    private writeFooter;
}
export default SitemapIndexWriter;
