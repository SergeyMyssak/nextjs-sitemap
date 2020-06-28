const Sitemap = require('@sergeymyssak/nextjs-sitemap');

const sitemap = new Sitemap({
  langs: ['en', 'es', 'ru'],
  isSubdomain: true,
  baseUrl: 'https://example.com',
  targetDirectory: __dirname + '/public',
  pagesDirectory: __dirname + '/src/pages',
});
sitemap.generateSitemap();
