const { configureSitemap } = require('@sergeymyssak/nextjs-sitemap');

async function fetchDynamicPaths() {
  return ['house', 'flower', 'table'];
}

async function getDynamicPaths() {
  const paths = await fetchDynamicPaths();

  return paths.map((item) => `/project/${item}`);
}

getDynamicPaths().then((paths) => {
  const Sitemap = configureSitemap({
    domains: [{ domain: 'example.com', defaultLocale: 'en' }],
    include: paths,
    exclude: ['/project/*'],
    excludeIndex: true,
    pagesConfig: {
      '/project/*': {
        priority: '0.5',
        changefreq: 'daily',
      },
    },
    trailingSlash: true,
    targetDirectory: __dirname + '/public',
    pagesDirectory: __dirname + '/src/pages',
  });
  Sitemap.generateSitemap();
});
