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

const isExcludedExtn = (
  fileExtension: string,
  excludeExtensions: string[],
): boolean =>
  excludeExtensions.some(
    (toIgnoreExtension: string) => toIgnoreExtension === fileExtension,
  );

const isReservedPage = (pageName: string): boolean =>
  pageName.charAt(0) === '_' || pageName.charAt(0) === '.';

const splitFilenameAndExtn = (filename: string): string[] => {
  const dotIndex = filename.lastIndexOf('.');

  return [
    filename.substring(0, dotIndex),
    filename.substring(dotIndex + 1, filename.length),
  ];
};

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

export {
  findMatch,
  isExcludedExtn,
  isReservedPage,
  splitFilenameAndExtn,
  splitFoldersAndFiles,
};
