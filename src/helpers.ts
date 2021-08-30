import fs from 'fs';
import path from 'path';
import { format } from 'date-fns';
import {
  IGetAlternativePath,
  IGetBaseUrl,
  IGetPathMap,
  IGetSitemap,
  IGetXmlUrl,
  ISitemapSite,
} from './types';
import {
  splitFoldersAndFiles,
  splitFilenameAndExtn,
  findMatch,
  isExcludedExtn,
  isReservedPage,
  normalizeTrailingSlash,
} from './utils';

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

const getPathsFromDirectory = ({
  rootPath,
  directoryPath,
  excludeExtns,
  excludeIdx,
}: IGetPathMap): string[] => {
  const fileNames: string[] = fs.readdirSync(directoryPath);
  let paths: string[] = [];

  for (const fileName of fileNames) {
    if (isReservedPage(fileName)) continue;

    const nextPath = directoryPath + path.sep + fileName;
    const isFolder = fs.lstatSync(nextPath).isDirectory();

    if (isFolder) {
      const directoryPaths = getPathsFromDirectory({
        rootPath,
        directoryPath: nextPath,
        excludeExtns,
        excludeIdx,
      });
      paths = [...paths, ...directoryPaths];
      continue;
    }

    const [fileNameWithoutExtn, fileExtn] = splitFilenameAndExtn(fileName);
    if (isExcludedExtn(fileExtn, excludeExtns)) continue;

    const newDirectoryPath = directoryPath
      .replace(rootPath, '')
      .replace(path.sep, '/');

    const pagePath = `${newDirectoryPath}/${
      excludeIdx && fileNameWithoutExtn === 'index' ? '' : fileNameWithoutExtn
    }`;
    paths.push(pagePath);
  }

  return paths;
};

const getPathsFromNextConfig = async (
  nextConfigPath: string,
): Promise<string[]> => {
  let nextConfig = require(nextConfigPath);
  if (typeof nextConfig === 'function') {
    nextConfig = nextConfig([], {});
  }

  if (nextConfig?.exportPathMap) {
    const { exportPathMap } = nextConfig;

    const pathMap = await exportPathMap({}, {});
    return Object.keys(pathMap);
  }

  return [];
};

const getSitemap = ({ paths, pagesConfig }: IGetSitemap): ISitemapSite[] => {
  const pagesConfigKeys: string[] = Object.keys(pagesConfig);
  const [foldersConfig, filesConfig] = splitFoldersAndFiles(pagesConfigKeys);

  return paths.map(
    (pagePath: string): ISitemapSite => {
      const matchingPath = findMatch(pagePath, foldersConfig, filesConfig);
      const pageConfig = matchingPath ? pagesConfig[matchingPath] : undefined;
      const priority = pageConfig?.priority ?? '';
      const changefreq = pageConfig?.changefreq ?? '';

      return { pagePath, priority, changefreq };
    },
  );
};

const getBaseUrl = ({ domain, http }: IGetBaseUrl): string =>
  `${http ? 'http' : 'https'}://${domain}`;

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

export {
  getXmlUrl,
  getPathsFromDirectory,
  getPathsFromNextConfig,
  getSitemap,
  getBaseUrl,
  getAlternativePath,
};
