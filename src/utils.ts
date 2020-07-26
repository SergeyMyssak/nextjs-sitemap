const splitFoldersAndFiles = (data: string[]): string[][] => {
  const folders: string[] = [];
  const files = data.filter((item: string) => {
    if (item.charAt(item.length - 1) === '*') {
      folders.push(item);
      return false;
    }
    return true;
  });

  return [folders, files];
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

const findMatch = (
  path: string,
  folders: string[],
  files: string[],
): string | undefined => {
  const foundFile: string | undefined = files.find(
    (file: string) => file === path,
  );

  if (foundFile) return foundFile;

  for (const folder of folders) {
    // remove asterisk
    const formattedFolder = folder.substring(0, folder.length - 1);
    if (path.includes(formattedFolder)) return folder;
  }
};

const isReservedPage = (pageName: string): boolean =>
  pageName.charAt(0) === '_' || pageName.charAt(0) === '.';

export {
  splitFoldersAndFiles,
  splitFilenameAndExtn,
  appendTrailingSlash,
  removeTrailingSlash,
  findMatch,
  isExcludedExtn,
  isReservedPage,
};
