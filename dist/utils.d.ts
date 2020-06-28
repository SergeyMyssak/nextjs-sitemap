import {
  IGetPathMap,
  IGetSitemap,
  IGetXmlUrl,
  IPathMap,
  ISitemapSite,
} from './types';
declare const getUrlWithLocaleSubdomain: (
  baseUrl: string,
  lang: string,
) => string;
declare const getXmlUrl: ({
  baseUrl,
  url,
  alternateUrls,
}: IGetXmlUrl) => string;
declare const getPathMap: ({
  folderPath,
  rootPath,
  excludeExtns,
  excludeIdx,
}: IGetPathMap) => IPathMap;
declare const getSitemap: ({
  pathMap,
  include,
  pagesConfig,
  nextConfigPath,
}: IGetSitemap) => Promise<ISitemapSite[]>;
export { getUrlWithLocaleSubdomain, getXmlUrl, getPathMap, getSitemap };
