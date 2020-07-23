import fs from 'fs';
import path from 'path';
import { format } from 'date-fns';
import {
  IGetPathMap,
  IGetSitemap,
  IGetXmlUrl,
  IPathMap,
  ISitemapSite,
} from './types';

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

const splitFilenameAndExtn = (filename: string): string[] => {
  const dotIndex = filename.lastIndexOf('.');
  return [
    filename.substring(0, dotIndex),
    filename.substring(dotIndex + 1, filename.length),
  ];
};

const appendTrailingSlash = (pagePath: string): string => {
  const lastChar = pagePath.charAt(pagePath.length - 1);
  if (lastChar === '/') {
    return pagePath;
  }
  return pagePath + '/';
};

const removeTrailingSlash = (pagePath: string): string => {
  const lastChar = pagePath.charAt(pagePath.length - 1);
  if (lastChar === '/') {
    return pagePath.substring(0, pagePath.length - 1);
  }
  return pagePath;
};

const isExcludedExtn = (
  fileExtension: string,
  excludeExtensions: string[],
): boolean =>
  excludeExtensions.some(
    (toIgnoreExtension: string) => toIgnoreExtension === fileExtension,
  );

const isReservedPage = (pageName: string): boolean =>
  pageName.charAt(0) === '_' || pageName.charAt(0) === '.';

const getPathMap = ({
  folderPath,
  rootPath,
  excludeExtns,
  excludeIdx,
}: IGetPathMap): IPathMap => {
  const fileNames: string[] = fs.readdirSync(folderPath);
  let pathMap: IPathMap = {};

  for (const fileName of fileNames) {
    if (isReservedPage(fileName)) continue;

    const nextPath = folderPath + path.sep + fileName;
    const isFolder = fs.lstatSync(nextPath).isDirectory();

    if (isFolder) {
      const folderPathMap = getPathMap({
        folderPath: nextPath,
        rootPath,
        excludeExtns,
        excludeIdx,
      });
      pathMap = {
        ...pathMap,
        ...folderPathMap,
      };
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

    pathMap[pagePath] = {
      page: pagePath,
    };
  }

  return pathMap;
};

const getSitemap = async ({
  pathMap,
  include,
  pagesConfig,
  nextConfigPath,
  isTrailingSlashRequired,
}: IGetSitemap): Promise<ISitemapSite[]> => {
  if (nextConfigPath) {
    let nextConfig = require(nextConfigPath);

    if (typeof nextConfig === 'function') {
      nextConfig = nextConfig([], {});
    }

    if (nextConfig && nextConfig.exportPathMap) {
      const { exportPathMap } = nextConfig;
      try {
        pathMap = await exportPathMap(pathMap, {});
      } catch (err) {
        throw new Error('Export path map: ' + err);
      }
    }
  }

  const paths = [...Object.keys(pathMap), ...include];
  return paths.map(
    (pagePath: string): ISitemapSite => {
      const pageConfig = pagesConfig[pagePath];
      const priority = pageConfig?.priority ?? '';
      const changefreq = pageConfig?.changefreq ?? '';

      const formattedPagePath = isTrailingSlashRequired
        ? appendTrailingSlash(pagePath)
        : removeTrailingSlash(pagePath);

      return { pagePath: formattedPagePath, priority, changefreq };
    },
  );
};

export { getLocalizedSubdomainUrl, getXmlUrl, getPathMap, getSitemap };
