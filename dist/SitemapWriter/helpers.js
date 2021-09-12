"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getXmlUrl = exports.getNewSitemapName = exports.getBaseUrl = exports.getAlternativePath = void 0;
const date_fns_1 = require("date-fns");
const utils_1 = require("./utils");
const getAlternativePath = ({ baseUrl, route, hreflang, lang = '', trailingSlash, }) => {
    const normalizedBaseUrl = utils_1.normalizeTrailingSlash(baseUrl, !!lang);
    const href = `${normalizedBaseUrl}${lang}${route}`;
    const normalizedHref = utils_1.normalizeTrailingSlash(href, trailingSlash);
    return `\n\t\t<xhtml:link rel="alternate" hreflang="${hreflang}" href="${normalizedHref}" />`;
};
exports.getAlternativePath = getAlternativePath;
const getBaseUrl = ({ domain, http }) => `${http ? 'http' : 'https'}://${domain}`;
exports.getBaseUrl = getBaseUrl;
const getNewSitemapName = (index) => `sitemap${index + 1}.xml`;
exports.getNewSitemapName = getNewSitemapName;
const getXmlUrl = ({ baseUrl, route, alternativeUrls = '', trailingSlash, }) => {
    const { pagePath, priority, changefreq } = route;
    const loc = utils_1.normalizeTrailingSlash(`${baseUrl}${pagePath}`, trailingSlash);
    const date = date_fns_1.format(new Date(), 'yyyy-MM-dd');
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
exports.getXmlUrl = getXmlUrl;
