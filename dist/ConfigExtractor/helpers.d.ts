import { IGetPathMap, IGetSitemapUrls, INextConfig, ISitemapUrl } from './types';
declare const getNextConfig: (nextConfigPath: string) => Promise<INextConfig>;
declare const getPathsFromDirectory: ({ rootPath, directoryPath, excludeExtns, excludeIdx, }: IGetPathMap) => string[];
declare const getSitemapUrls: ({ paths, pagesConfig, }: IGetSitemapUrls) => ISitemapUrl[];
export { getNextConfig, getPathsFromDirectory, getSitemapUrls };
