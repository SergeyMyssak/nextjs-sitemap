declare const splitFoldersAndFiles: (data: string[]) => string[][];
declare const splitFilenameAndExtn: (filename: string) => string[];
declare const appendTrailingSlash: (pagePath: string) => string;
declare const removeTrailingSlash: (pagePath: string) => string;
declare const isExcludedExtn: (fileExtension: string, excludeExtensions: string[]) => boolean;
declare const findMatch: (path: string, folders: string[], files: string[]) => string | undefined;
declare const isReservedPage: (pageName: string) => boolean;
export { splitFoldersAndFiles, splitFilenameAndExtn, appendTrailingSlash, removeTrailingSlash, findMatch, isExcludedExtn, isReservedPage, };
