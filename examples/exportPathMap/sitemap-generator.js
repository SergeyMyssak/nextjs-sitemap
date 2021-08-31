const { configureSitemap } = require('@sergeymyssak/nextjs-sitemap');

const Sitemap = configureSitemap({
  exclude: ['/admin'],
  excludeIndex: true,
  pagesConfig: {
    '/p/*': {
      priority: '0.5',
      changefreq: 'daily',
    },
  },
  nextConfigPath: __dirname + '/next.config.js',
  targetDirectory: __dirname + '/public',
  pagesDirectory: __dirname + '/src/pages',
});
Sitemap.generateSitemap();
