const Sitemap = require('@sergeymyssak/nextjs-sitemap');

const sitemap = new Sitemap({
  baseUrl: 'https://example.com',
  pagesConfig: {
    '/about': {
      priority: '0.5',
      changefreq: 'daily',
    },
  },
  targetDirectory: __dirname + '/public',
  pagesDirectory: __dirname + '/src/pages',
});
sitemap.generateSitemap();
