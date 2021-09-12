import { format } from 'date-fns';

import { normalizeTrailingSlash } from './utils';
import { IGetAlternativePath, IGetBaseUrl, IGetXmlUrl } from './types';

const getAlternativePath = ({
  baseUrl,
  route,
  hreflang,
  lang = '',
  trailingSlash,
}: IGetAlternativePath): string => {
  const normalizedBaseUrl = normalizeTrailingSlash(baseUrl, !!lang);
  const href = `${normalizedBaseUrl}${lang}${route}`;
  const normalizedHref = normalizeTrailingSlash(href, trailingSlash);

  return `\n\t\t<xhtml:link rel="alternate" hreflang="${hreflang}" href="${normalizedHref}" />`;
};

const getBaseUrl = ({ domain, http }: IGetBaseUrl): string =>
  `${http ? 'http' : 'https'}://${domain}`;

const getNewSitemapName = (index: number): string => `sitemap${index + 1}.xml`;

const getXmlUrl = ({
  baseUrl,
  route,
  alternativeUrls = '',
  trailingSlash,
}: IGetXmlUrl): string => {
  const { pagePath, priority, changefreq } = route;
  const loc = normalizeTrailingSlash(`${baseUrl}${pagePath}`, trailingSlash);
  const date = format(new Date(), 'yyyy-MM-dd');

  const xmlChangefreq = changefreq
    ? `
        <changefreq>${changefreq}</changefreq>`
    : '';
  const xmlPriority = priority
    ? `
        <priority>${priority}</priority>`
    : '';

  return `
    <url>
        <loc>${loc}</loc>
        <lastmod>${date}</lastmod>${xmlChangefreq}${xmlPriority}${alternativeUrls}
    </url>`;
};

export { getAlternativePath, getBaseUrl, getNewSitemapName, getXmlUrl };
