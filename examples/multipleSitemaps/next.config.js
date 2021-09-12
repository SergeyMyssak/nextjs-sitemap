module.exports = {
  i18n: {
    domains: [
      {
        domain: 'example.com',
        defaultLocale: 'en',
        locales: ['en-au', 'en-bz', 'en-ca', 'en-cb'],
      },
      {
        domain: 'example.es',
        defaultLocale: 'es',
        locales: ['es-ar', 'es-bo', 'es-cl', 'es-co'],
      },
    ],
  },
  trailingSlash: true,
  exportPathMap: async function () {
    // generate many pages
    const res = { '/': { page: '/' }, '/admin': { page: '/admin' } };

    for (let i = 0; i < 1000; i++) {
      res[`/p/${i}`] = { page: '/post' };
    }

    return res;
  },
};
