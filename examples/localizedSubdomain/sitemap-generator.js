const { configureSitemap } = require('@sergeymyssak/nextjs-sitemap');

const Sitemap = configureSitemap({
  domains: [
    { domain: 'example.com', defaultLocale: 'en', locales: ['en-US', 'en-CA'] },
    { domain: 'es.example.com', defaultLocale: 'es' },
  ],
  excludeIndex: true,
  trailingSlash: true,
  targetDirectory: __dirname + '/public',
  pagesDirectory: __dirname + '/src/pages',
});
Sitemap.generateSitemap();
