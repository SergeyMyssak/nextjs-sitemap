const { configureSitemap } = require('@sergeymyssak/nextjs-sitemap');

const Sitemap = configureSitemap({
  domains: [{ domain: 'example.com', locales: ['en', 'es'] }],
  excludeIndex: true,
  trailingSlash: true,
  targetDirectory: __dirname + '/public',
  pagesDirectory: __dirname + '/src/pages',
});
Sitemap.generateSitemap();
