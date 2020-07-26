const { configureSitemap } = require('@sergeymyssak/nextjs-sitemap');

const Sitemap = configureSitemap({
  baseUrl: 'https://example.com',
  exclude: ['/admin/*'],
  excludeIndex: true,
  pagesConfig: {
    '/projects/*': {
      priority: '0.5',
      changefreq: 'daily',
    },
  },
  isTrailingSlashRequired: true,
  targetDirectory: __dirname + '/public',
  pagesDirectory: __dirname + '/src/pages',
});
Sitemap.generateSitemap();
