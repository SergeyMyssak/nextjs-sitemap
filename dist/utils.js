'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.getSitemap = exports.getPathMap = exports.getXmlUrl = exports.getUrlWithLocaleSubdomain = void 0;
const fs_1 = __importDefault(require('fs'));
const path_1 = __importDefault(require('path'));
const date_fns_1 = require('date-fns');
const getUrlWithLocaleSubdomain = (baseUrl, lang) => {
  const protocolAndHostname = baseUrl.split('//');
  protocolAndHostname[1] = `${lang}.${protocolAndHostname[1]}`;
  return protocolAndHostname.join('//');
};
exports.getUrlWithLocaleSubdomain = getUrlWithLocaleSubdomain;
const getXmlUrl = ({ baseUrl, url, alternateUrls = '' }) => {
  const { pagePath, priority, changefreq } = url;
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
        <loc>${baseUrl}${pagePath}</loc>
        <lastmod>${date}</lastmod>${xmlChangefreq}${xmlPriority}${alternateUrls}
    </url>`;
};
exports.getXmlUrl = getXmlUrl;
const isExcludedExtn = (fileExtension, excludeExtensions) =>
  excludeExtensions.some(
    (toIgnoreExtension) => toIgnoreExtension === fileExtension,
  );
const isReservedPage = (pageName) =>
  pageName.charAt(0) === '_' || pageName.charAt(0) === '.';
const getPathMap = ({ folderPath, rootPath, excludeExtns, excludeIdx }) => {
  var _a;
  const pagesNames = fs_1.default.readdirSync(folderPath);
  let pathMap = {};
  for (const pageName of pagesNames) {
    if (isReservedPage(pageName)) continue;
    const nextPath = folderPath + path_1.default.sep + pageName;
    const isFolder = fs_1.default.lstatSync(nextPath).isDirectory();
    if (isFolder) {
      const folderPathMap = getPathMap({
        folderPath: nextPath,
        rootPath,
        excludeExtns,
        excludeIdx,
      });
      pathMap = Object.assign(Object.assign({}, pathMap), folderPathMap);
      continue;
    }
    const fileExtn =
      (_a = pageName.split('.').pop()) !== null && _a !== void 0 ? _a : '';
    const fileExtnLen = fileExtn.length + 1;
    if (isExcludedExtn(fileExtn, excludeExtns)) continue;
    let fileNameWithoutExtn = pageName.slice(0, pageName.length - fileExtnLen);
    if (excludeIdx && fileNameWithoutExtn === 'index') {
      fileNameWithoutExtn = '';
    }
    const newFolderPath = folderPath.replace(rootPath, '').replace(/\\/g, '/');
    const pagePath = `${newFolderPath}${
      fileNameWithoutExtn ? '/' + fileNameWithoutExtn : ''
    }`;
    pathMap[pagePath] = {
      page: pagePath,
    };
  }
  return pathMap;
};
exports.getPathMap = getPathMap;
const getSitemap = ({ pathMap, include, pagesConfig, nextConfigPath }) =>
  __awaiter(void 0, void 0, void 0, function* () {
    if (nextConfigPath) {
      let nextConfig = require(nextConfigPath);
      if (typeof nextConfig === 'function') {
        nextConfig = nextConfig([], {});
      }
      if (nextConfig && nextConfig.exportPathMap) {
        const { exportPathMap } = nextConfig;
        try {
          pathMap = yield exportPathMap(pathMap, {});
        } catch (err) {
          throw new Error('Export path map: ' + err);
        }
      }
    }
    const paths = [...Object.keys(pathMap), ...include];
    return paths.map((pagePath) => {
      var _a, _b;
      const pageConfig = pagesConfig[pagePath];
      const priority =
        (_a =
          pageConfig === null || pageConfig === void 0
            ? void 0
            : pageConfig.priority) !== null && _a !== void 0
          ? _a
          : '';
      const changefreq =
        (_b =
          pageConfig === null || pageConfig === void 0
            ? void 0
            : pageConfig.changefreq) !== null && _b !== void 0
          ? _b
          : '';
      return { pagePath, priority, changefreq };
    });
  });
exports.getSitemap = getSitemap;
