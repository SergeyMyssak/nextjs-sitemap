const { configureSitemap } = require('@sergeymyssak/nextjs-sitemap');

const Sitemap = configureSitemap({
  domains: [{ domain: 'example.com', defaultLocale: 'en', http: true }],
  exclude: ['/admin/*'],
  excludeIndex: true,
  pagesConfig: {
    '/projects/*': {
      priority: '0.5',
      changefreq: 'daily',
    },
  },
  trailingSlash: true,
  targetDirectory: __dirname + '/public',
  pagesDirectory: __dirname + '/src/pages',
});

Sitemap.generateSitemap();
