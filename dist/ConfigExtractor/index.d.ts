import { IConfigExtractor, IConfigExtractorInterface, IConfigExtractorResult } from './types';
declare class ConfigExtractor implements IConfigExtractorInterface {
    private domains;
    private exclude;
    private excludeExtensions;
    private excludeIndex;
    private trailingSlash;
    private include;
    private nextConfigPath?;
    private pagesConfig;
    private pagesDirectory;
    constructor(props: IConfigExtractor);
    extract: () => Promise<IConfigExtractorResult>;
}
export default ConfigExtractor;
