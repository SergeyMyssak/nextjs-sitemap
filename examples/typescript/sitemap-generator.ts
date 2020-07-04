import { configureSitemap } from '@sergeymyssak/nextjs-sitemap';

const Sitemap = configureSitemap({
  baseUrl: 'https://example.com',
  pagesConfig: {
    '/about': {
      priority: '0.5',
      changefreq: 'daily',
    },
  },
  targetDirectory: __dirname + '/../public',
  pagesDirectory: __dirname + '/../src/pages',
});
Sitemap.generateSitemap();
