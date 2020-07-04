const { configureSitemap } = require('@sergeymyssak/nextjs-sitemap');

const Sitemap = configureSitemap({
  langs: ['en', 'es', 'ru'],
  isSubdomain: true,
  baseUrl: 'https://example.com',
  targetDirectory: __dirname + '/public',
  pagesDirectory: __dirname + '/src/pages',
});
Sitemap.generateSitemap();
