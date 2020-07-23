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

const isExcludedPath = (
  pagePath: string,
  excludeFiles: string[],
  excludeFolders: string[],
): boolean => {
  if (excludeFiles.includes(pagePath)) return true;

  for (const excludeFolder of excludeFolders) {
    // remove asterisk and trailing slash
    const formattedExcludeFolder = excludeFolder.substring(
      0,
      excludeFolder.length - 2,
    );
    if (pagePath.includes(formattedExcludeFolder)) return true;
  }

  return false;
};

const isReservedPage = (pageName: string): boolean =>
  pageName.charAt(0) === '_' || pageName.charAt(0) === '.';

export {
  splitFilenameAndExtn,
  appendTrailingSlash,
  removeTrailingSlash,
  isExcludedExtn,
  isExcludedPath,
  isReservedPage,
};
