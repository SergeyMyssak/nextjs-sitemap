import { IGetAlternativePath, IGetBaseUrl, IGetPathMap, IGetSitemap, IGetXmlUrl, ISitemapSite } from './types';
declare const getXmlUrl: ({ baseUrl, route, alternativeUrls, trailingSlash, }: IGetXmlUrl) => string;
declare const getPathsFromDirectory: ({ rootPath, directoryPath, excludeExtns, excludeIdx, }: IGetPathMap) => string[];
declare const getPathsFromNextConfig: (nextConfigPath: string) => Promise<string[]>;
declare const getSitemap: ({ paths, pagesConfig }: IGetSitemap) => ISitemapSite[];
declare const getBaseUrl: ({ domain, http }: IGetBaseUrl) => string;
declare const getAlternativePath: ({ baseUrl, route, hreflang, lang, trailingSlash, }: IGetAlternativePath) => string;
export { getXmlUrl, getPathsFromDirectory, getPathsFromNextConfig, getSitemap, getBaseUrl, getAlternativePath, };
