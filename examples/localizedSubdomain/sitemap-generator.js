const { configureSitemap } = require('@sergeymyssak/nextjs-sitemap');

const Sitemap = configureSitemap({
  baseUrl: 'https://example.com',
  excludeIndex: true,
  langs: ['en', 'es', 'ru'],
  isSubdomain: true,
  isTrailingSlashRequired: true,
  targetDirectory: __dirname + '/public',
  pagesDirectory: __dirname + '/src/pages',
});
Sitemap.generateSitemap();
