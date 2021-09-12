declare const findMatch: (path: string, folders: string[], files: string[]) => string | undefined;
declare const isExcludedExtn: (fileExtension: string, excludeExtensions: string[]) => boolean;
declare const isReservedPage: (pageName: string) => boolean;
declare const splitFilenameAndExtn: (filename: string) => string[];
declare const splitFoldersAndFiles: (data: string[]) => string[][];
export { findMatch, isExcludedExtn, isReservedPage, splitFilenameAndExtn, splitFoldersAndFiles, };
