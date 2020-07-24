import fs from 'fs';
import path from 'path';
import { format } from 'date-fns';
import { IGetPathMap, IGetSitemap, IGetXmlUrl, ISitemapSite } from './types';
import {
  splitFoldersAndFiles,
  splitFilenameAndExtn,
  appendTrailingSlash,
  removeTrailingSlash,
  findMatch,
  isExcludedExtn,
  isReservedPage,
} from './utils';

const getLocalizedSubdomainUrl = (baseUrl: string, lang: string): string => {
  const protocolAndHostname = baseUrl.split('//');
  protocolAndHostname[1] = `${lang}.${protocolAndHostname[1]}`;

  return protocolAndHostname.join('//');
};

const getXmlUrl = ({
  baseUrl,
  url,
  alternateUrls = '',
}: IGetXmlUrl): string => {
  const { pagePath, priority, changefreq } = url;
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
        <loc>${baseUrl}${pagePath}</loc>
        <lastmod>${date}</lastmod>${xmlChangefreq}${xmlPriority}${alternateUrls}
    </url>`;
};

const getPaths = ({
  folderPath,
  rootPath,
  excludeExtns,
  excludeIdx,
}: IGetPathMap): string[] => {
  const fileNames: string[] = fs.readdirSync(folderPath);
  let paths: string[] = [];

  for (const fileName of fileNames) {
    if (isReservedPage(fileName)) continue;

    const nextPath = folderPath + path.sep + fileName;
    const isFolder = fs.lstatSync(nextPath).isDirectory();

    if (isFolder) {
      const pathsInFolder = getPaths({
        folderPath: nextPath,
        rootPath,
        excludeExtns,
        excludeIdx,
      });
      paths = [...paths, ...pathsInFolder];
      continue;
    }

    const [fileNameWithoutExtn, fileExtn] = splitFilenameAndExtn(fileName);
    if (isExcludedExtn(fileExtn, excludeExtns)) continue;

    const newFolderPath = folderPath
      .replace(rootPath, '')
      .replace(path.sep, '/');

    const pagePath = `${newFolderPath}/${
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

  if (nextConfig && nextConfig.exportPathMap) {
    const { exportPathMap } = nextConfig;

    const pathMap = await exportPathMap({}, {});
    return Object.keys(pathMap);
  }

  return [];
};

const getSitemap = async ({
  paths,
  include,
  pagesConfig,
  isTrailingSlashRequired,
}: IGetSitemap): Promise<ISitemapSite[]> => {
  const pagesConfigKeys: string[] = Object.keys(pagesConfig);
  const [foldersConfig, filesConfig] = splitFoldersAndFiles(pagesConfigKeys);

  const newPaths = [...paths, ...include];
  return newPaths.map(
    (pagePath: string): ISitemapSite => {
      const formattedPagePath = isTrailingSlashRequired
        ? appendTrailingSlash(pagePath)
        : removeTrailingSlash(pagePath);

      const matchingPath = findMatch(pagePath, foldersConfig, filesConfig);
      const pageConfig = matchingPath ? pagesConfig[matchingPath] : undefined;
      const priority = pageConfig?.priority ?? '';
      const changefreq = pageConfig?.changefreq ?? '';

      return { pagePath: formattedPagePath, priority, changefreq };
    },
  );
};

export {
  getLocalizedSubdomainUrl,
  getXmlUrl,
  getPaths,
  getPathsFromNextConfig,
  getSitemap,
};
