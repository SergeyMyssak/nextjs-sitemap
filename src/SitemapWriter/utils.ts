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

export { appendTrailingSlash, normalizeTrailingSlash, removeTrailingSlash };
