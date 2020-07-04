const { configureSitemap } = require('@sergeymyssak/nextjs-sitemap');

async function getDynamicPaths() {
  const data = ['house', 'flower', 'table'];
  return data.map((item) => `/project/${item}`);
}

getDynamicPaths().then((paths) => {
  const Sitemap = configureSitemap({
    baseUrl: 'https://example.com',
    include: paths,
    exclude: ['/project/[id]'],
    targetDirectory: __dirname + '/public',
    pagesDirectory: __dirname + '/src/pages',
  });
  Sitemap.generateSitemap();
});
