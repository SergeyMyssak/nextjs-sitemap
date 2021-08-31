module.exports = {
  i18n: {
    domains: [
      {
        domain: 'example.com',
        defaultLocale: 'en',
        locales: ['en-US', 'en-CA'],
      },
      { domain: 'example.es', defaultLocale: 'es' },
    ],
  },
  trailingSlash: true,
  exportPathMap: async function () {
    return {
      '/': { page: '/' },
      '/admin': { page: '/admin' },
      '/p/learn-nextjs': { page: '/post', query: { title: 'learn-nextjs' } },
    };
  },
};
