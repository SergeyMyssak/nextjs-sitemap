declare const splitFoldersAndFiles: (data: string[]) => string[][];
declare const splitFilenameAndExtn: (filename: string) => string[];
declare const appendTrailingSlash: (str: string) => string;
declare const removeTrailingSlash: (str: string) => string;
declare const normalizeTrailingSlash: (str: string, trailingSlash: boolean) => string;
declare const isExcludedExtn: (fileExtension: string, excludeExtensions: string[]) => boolean;
declare const findMatch: (path: string, folders: string[], files: string[]) => string | undefined;
declare const isReservedPage: (pageName: string) => boolean;
export { splitFoldersAndFiles, splitFilenameAndExtn, appendTrailingSlash, removeTrailingSlash, normalizeTrailingSlash, findMatch, isExcludedExtn, isReservedPage, };
