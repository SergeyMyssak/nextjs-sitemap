module.exports = {
  bracketSpacing: true,
  jsxBracketSameLine: false,
  parser: 'babel',
  printWidth: 80,
  rcVerbose: true,
  semi: true,
  singleQuote: true,
  jsxSingleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  useTabs: false,
  overrides: [
    {
      files: '*.*',
      options: {
        parser: 'typescript',
      },
    },
  ],
};
