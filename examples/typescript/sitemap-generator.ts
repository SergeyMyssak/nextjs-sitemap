import { configureSitemap } from '@sergeymyssak/nextjs-sitemap';

async function fetchDynamicPaths(): Promise<string[]> {
  return ['house', 'flower', 'table'];
}

async function getDynamicPaths(): Promise<string[]> {
  const paths = await fetchDynamicPaths();

  return paths.map((item) => `/project/${item}`);
}

getDynamicPaths().then((paths) => {
  const Sitemap = configureSitemap({
    domains: [{ domain: 'example.com', defaultLocale: 'en' }],
    include: paths,
    exclude: ['/project/[id]'],
    excludeIndex: true,
    pagesConfig: {
      '/project/*': {
        priority: '0.5',
        changefreq: 'daily',
      },
    },
    trailingSlash: true,
    targetDirectory: __dirname + '/../public',
    pagesDirectory: __dirname + '/../src/pages',
  });

  Sitemap.generateSitemap();
});
