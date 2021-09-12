import { IGetAlternativePath, IGetBaseUrl, IGetXmlUrl } from './types';
declare const getAlternativePath: ({ baseUrl, route, hreflang, lang, trailingSlash, }: IGetAlternativePath) => string;
declare const getBaseUrl: ({ domain, http }: IGetBaseUrl) => string;
declare const getNewSitemapName: (index: number) => string;
declare const getXmlUrl: ({ baseUrl, route, alternativeUrls, trailingSlash, }: IGetXmlUrl) => string;
export { getAlternativePath, getBaseUrl, getNewSitemapName, getXmlUrl };
