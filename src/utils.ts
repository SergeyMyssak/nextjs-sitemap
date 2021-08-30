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

const appendTrailingSlash = (str: string): string => {
  const lastChar = str.charAt(str.length - 1);
  if (lastChar === '/') {
    return str;
  }
  return str + '/';
};

const removeTrailingSlash = (str: string): string => {
  const lastChar = str.charAt(str.length - 1);
  if (lastChar === '/') {
    return str.substring(0, str.length - 1);
  }
  return str;
};

const normalizeTrailingSlash = (str: string, trailingSlash: boolean): string =>
  trailingSlash ? appendTrailingSlash(str) : removeTrailingSlash(str);

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

  if (foundFile) {
    return foundFile;
  }

  for (const folder of folders) {
    // remove asterisk
    const formattedFolder = folder.substring(0, folder.length - 1);
    if (path.includes(formattedFolder)) {
      return folder;
    }
  }
};

const isReservedPage = (pageName: string): boolean =>
  pageName.charAt(0) === '_' || pageName.charAt(0) === '.';

export {
  splitFoldersAndFiles,
  splitFilenameAndExtn,
  appendTrailingSlash,
  removeTrailingSlash,
  normalizeTrailingSlash,
  findMatch,
  isExcludedExtn,
  isReservedPage,
};
