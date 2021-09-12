const { configureSitemap } = require('@sergeymyssak/nextjs-sitemap');

const Sitemap = configureSitemap({
  sitemapUrl: 'https://www.example.com',
  sitemapSize: 5000,
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
