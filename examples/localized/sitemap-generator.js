const Sitemap = require('@sergeymyssak/nextjs-sitemap');

const sitemap = new Sitemap({
  langs: ['en', 'es', 'ru'],
  baseUrl: 'https://example.com',
  targetDirectory: __dirname + '/public',
  pagesDirectory: __dirname + '/src/pages',
});
sitemap.generateSitemap();
