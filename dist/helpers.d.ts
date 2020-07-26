import { IGetPathMap, IGetSitemap, IGetXmlUrl, ISitemapSite } from './types';
declare const getLocalizedSubdomainUrl: (baseUrl: string, lang: string) => string;
declare const getXmlUrl: ({ baseUrl, url, alternateUrls, }: IGetXmlUrl) => string;
declare const getPaths: ({ folderPath, rootPath, excludeExtns, excludeIdx, }: IGetPathMap) => string[];
declare const getPathsFromNextConfig: (nextConfigPath: string) => Promise<string[]>;
declare const getSitemap: ({ paths, include, pagesConfig, isTrailingSlashRequired, }: IGetSitemap) => Promise<ISitemapSite[]>;
export { getLocalizedSubdomainUrl, getXmlUrl, getPaths, getPathsFromNextConfig, getSitemap, };
