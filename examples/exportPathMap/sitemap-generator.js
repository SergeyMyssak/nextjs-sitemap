const Sitemap = require('@sergeymyssak/nextjs-sitemap');

const sitemap = new Sitemap({
  baseUrl: 'https://example.com',
  nextConfigPath: __dirname + '/next.config.js',
  targetDirectory: __dirname + '/public',
  pagesDirectory: __dirname + '/src/pages',
});
sitemap.generateSitemap();
