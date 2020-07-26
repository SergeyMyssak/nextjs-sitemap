const { configureSitemap } = require('@sergeymyssak/nextjs-sitemap');

const Sitemap = configureSitemap({
  baseUrl: 'https://example.com',
  exclude: ['/admin'],
  excludeIndex: true,
  pagesConfig: {
    '/about': {
      priority: '0.5',
      changefreq: 'daily',
    },
  },
  isTrailingSlashRequired: true,
  nextConfigPath: __dirname + '/next.config.js',
  targetDirectory: __dirname + '/public',
  pagesDirectory: __dirname + '/src/pages',
});
Sitemap.generateSitemap();
