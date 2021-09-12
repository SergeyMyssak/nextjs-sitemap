import fs from 'fs';
import path from 'path';

import {
  IGetPathMap,
  IGetSitemapUrls,
  INextConfig,
  ISitemapUrl,
} from './types';
import {
  findMatch,
  isExcludedExtn,
  isReservedPage,
  splitFilenameAndExtn,
  splitFoldersAndFiles,
} from './utils';

const getNextConfig = async (nextConfigPath: string): Promise<INextConfig> => {
  let nextConfig = require(nextConfigPath);
  if (typeof nextConfig === 'function') {
    nextConfig = nextConfig([], {});
  }

  const res: INextConfig = {
    paths: [],
    domains: nextConfig.i18n?.domains,
    trailingSlash: nextConfig.trailingSlash,
  };

  if (nextConfig.exportPathMap) {
    const pathMap = await nextConfig.exportPathMap({}, {});
    res.paths = Object.keys(pathMap);
  }

  return res;
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

const getSitemapUrls = ({
  paths,
  pagesConfig,
}: IGetSitemapUrls): ISitemapUrl[] => {
  const pagesConfigKeys: string[] = Object.keys(pagesConfig);
  const [foldersConfig, filesConfig] = splitFoldersAndFiles(pagesConfigKeys);

  return paths.map(
    (pagePath: string): ISitemapUrl => {
      const matchingPath = findMatch(pagePath, foldersConfig, filesConfig);
      const pageConfig = matchingPath ? pagesConfig[matchingPath] : undefined;
      const priority = pageConfig?.priority ?? '';
      const changefreq = pageConfig?.changefreq ?? '';

      return { pagePath, priority, changefreq };
    },
  );
};

export { getNextConfig, getPathsFromDirectory, getSitemapUrls };
