# Next.js sitemap generator

[![Version][version-badge]][package]
[![Downloads][downloads-badge]][downloads]
[![ISC License][license-badge]][license]

Generate dynamic sitemap.xml for Next.js projects (support dynamic routes and localization)!  
- We create sitemap.xml following the [example](https://support.google.com/webmasters/answer/189077#sitemap) of Google.  
- Checkout the [examples](https://github.com/SergeyMyssak/nextjs-sitemap/tree/master/examples) folder for source code.

## Installation

Open a Terminal in the project root and run:

```sh
npm install @sergeymyssak/nextjs-sitemap
```
or

```shell
yarn add @sergeymyssak/nextjs-sitemap
```

## Quick start

Example `src` folder:
```
└── src
    └── pages
        ├── projects
        │   ├── computers
        │   │   ├── laptop.js
        │   │   └── pc.js
        │   └── phones
        │       ├── android.js
        │       └── ios.js
        ├── admin
        │   ├── account.js
        │   └── cms.js
        └── index.js
```
All static routes from `pages` folder will be automatically added to the sitemap.
```js
// import { configureSitemap } from '@sergeymyssak/nextjs-sitemap'; // for typescript
const { configureSitemap } = require('@sergeymyssak/nextjs-sitemap');

const Sitemap = configureSitemap({
  baseUrl: 'https://example.com',
  exclude: ['/admin/*'],
  excludeIndex: true,
  pagesConfig: {
    '/projects/*': {
      priority: '0.5',
      changefreq: 'daily',
    },
  },
  isTrailingSlashRequired: true,
  targetDirectory: __dirname + '/public',
  pagesDirectory: __dirname + '/src/pages',
});
Sitemap.generateSitemap();
```
<details><summary>Look at the generated sitemap.xml</summary>
<p>
    
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<urlset xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 
    http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd" 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xhtml="http://www.w3.org/1999/xhtml">
    <url>
        <loc>https://example.com/</loc>
        <lastmod>2020-07-25</lastmod>
    </url>
    <url>
        <loc>https://example.com/projects/computers/laptop/</loc>
        <lastmod>2020-07-25</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.5</priority>
    </url>
    <url>
        <loc>https://example.com/projects/computers/pc/</loc>
        <lastmod>2020-07-25</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.5</priority>
    </url>
    <url>
        <loc>https://example.com/projects/phones/android/</loc>
        <lastmod>2020-07-25</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.5</priority>
    </url>
    <url>
        <loc>https://example.com/projects/phones/ios/</loc>
        <lastmod>2020-07-25</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.5</priority>
    </url>
</urlset>
```

</p>
</details> 

#### With exportPathMap

If you specify `nextConfigPath` prop, then all values indicated in the [exportPathMap](https://nextjs.org/docs/api-reference/next.config.js/exportPathMap) will be automatically added (`pages` folder will be ignored). 
```js
// import { configureSitemap } from '@sergeymyssak/nextjs-sitemap'; // for typescript
const { configureSitemap } = require('@sergeymyssak/nextjs-sitemap');

const Sitemap = configureSitemap({
  baseUrl: 'https://example.com',
  exclude: ['/admin/*'],
  excludeIndex: true,
  pagesConfig: {
    '/projects/*': {
      priority: '0.5',
      changefreq: 'daily',
    },
  },
  isTrailingSlashRequired: true,
  nextConfigPath: __dirname + '/next.config.js',
  targetDirectory: __dirname + '/public',
  pagesDirectory: __dirname + '/src/pages',
});
Sitemap.generateSitemap();
```

<details><summary>Example of the exportPathMap in next.config.js</summary>
<p>
    
```js
module.exports = {
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId },
  ) {
    return {
      '/': { page: '/' },
      '/about': { page: '/about' },
      '/admin': { page: '/admin' },
      '/p/hello-nextjs': { page: '/post', query: { title: 'hello-nextjs' } },
      '/p/learn-nextjs': { page: '/post', query: { title: 'learn-nextjs' } },
      '/p/deploy-nextjs': { page: '/post', query: { title: 'deploy-nextjs' } },
    };
  },
};
```

</p>
</details> 

<details><summary>Look at the generated sitemap.xml</summary>
<p>
    
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<urlset xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 
    http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd" 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xhtml="http://www.w3.org/1999/xhtml">
    <url>
        <loc>https://example.com/</loc>
        <lastmod>2020-07-25</lastmod>
    </url>
    <url>
        <loc>https://example.com/about/</loc>
        <lastmod>2020-07-25</lastmod>
    </url>
    <url>
        <loc>https://example.com/p/hello-nextjs/</loc>
        <lastmod>2020-07-25</lastmod>
    </url>
    <url>
        <loc>https://example.com/p/learn-nextjs/</loc>
        <lastmod>2020-07-25</lastmod>
    </url>
    <url>
        <loc>https://example.com/p/deploy-nextjs/</loc>
        <lastmod>2020-07-25</lastmod>
    </url>
</urlset>
```

</p>
</details> 

#### With dynamic routes

For dynamic routes, you have to declare them with the `include` property.  

Example `src` folder:
```
└── src
    └── pages
        ├── project
        │   └── [id].js
        └── index.js
```

```js
// import { configureSitemap } from '@sergeymyssak/nextjs-sitemap'; // for typescript
const { configureSitemap } = require('@sergeymyssak/nextjs-sitemap');

async function getDynamicPaths() {
  const data = ['house', 'flower', 'table'];
  return data.map((item) => `/project/${item}`);
}

getDynamicPaths().then((paths) => {
  const Sitemap = configureSitemap({
    baseUrl: 'https://example.com',
    include: paths,
    exclude: ['/project/[id]'], // or exclude: ['/project/*']
    excludeIndex: true,
    pagesConfig: {
      '/project/*': {
        priority: '0.5',
        changefreq: 'daily',
      },
    },
    isTrailingSlashRequired: true,
    targetDirectory: __dirname + '/public',
    pagesDirectory: __dirname + '/src/pages',
  });
  Sitemap.generateSitemap();
});
```

<details><summary>Look at the generated sitemap.xml</summary>
<p>
    
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<urlset xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 
    http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd" 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xhtml="http://www.w3.org/1999/xhtml">
    <url>
        <loc>https://example.com/</loc>
        <lastmod>2020-07-25</lastmod>
    </url>
    <url>
        <loc>https://example.com/project/house/</loc>
        <lastmod>2020-07-25</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.5</priority>
    </url>
    <url>
        <loc>https://example.com/project/flower/</loc>
        <lastmod>2020-07-25</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.5</priority>
    </url>
    <url>
        <loc>https://example.com/project/table/</loc>
        <lastmod>2020-07-25</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.5</priority>
    </url>
</urlset>
```

</p>
</details> 

#### With localization

If you have localization, you can use the `lang` prop.
```js
// import { configureSitemap } from '@sergeymyssak/nextjs-sitemap'; // for typescript
const { configureSitemap } = require('@sergeymyssak/nextjs-sitemap');

async function getDynamicPaths() {
  const data = ['house', 'flower', 'table'];
  return data.map((item) => `/project/${item}`);
}

getDynamicPaths().then((paths) => {
  const Sitemap = configureSitemap({
    baseUrl: 'https://example.com',
    include: paths,
    exclude: ['/project/[id]'], // or exclude: ['/project/*']
    excludeIndex: true,
    langs: ['en', 'es', 'ru'],
    pagesConfig: {
      '/project/*': {
        priority: '0.5',
        changefreq: 'daily',
      },
    },
    isTrailingSlashRequired: true,
    targetDirectory: __dirname + '/public',
    pagesDirectory: __dirname + '/src/pages',
  });
  Sitemap.generateSitemap();
});
```

<details><summary>Look at the generated sitemap.xml</summary>
<p>
    
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<urlset xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 
    http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd" 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xhtml="http://www.w3.org/1999/xhtml">
    <url>
        <loc>https://example.com/en/</loc>
        <lastmod>2020-07-25</lastmod>
        <xhtml:link rel="alternate" hreflang="en" href="https://example.com/en/" />
        <xhtml:link rel="alternate" hreflang="es" href="https://example.com/es/" />
        <xhtml:link rel="alternate" hreflang="ru" href="https://example.com/ru/" />
    </url>
    <url>
        <loc>https://example.com/en/project/house/</loc>
        <lastmod>2020-07-25</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.5</priority>
        <xhtml:link rel="alternate" hreflang="en" href="https://example.com/en/project/house/" />
        <xhtml:link rel="alternate" hreflang="es" href="https://example.com/es/project/house/" />
        <xhtml:link rel="alternate" hreflang="ru" href="https://example.com/ru/project/house/" />
    </url>
    <url>
        <loc>https://example.com/en/project/flower/</loc>
        <lastmod>2020-07-25</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.5</priority>
        <xhtml:link rel="alternate" hreflang="en" href="https://example.com/en/project/flower/" />
        <xhtml:link rel="alternate" hreflang="es" href="https://example.com/es/project/flower/" />
        <xhtml:link rel="alternate" hreflang="ru" href="https://example.com/ru/project/flower/" />
    </url>
    <url>
        <loc>https://example.com/en/project/table/</loc>
        <lastmod>2020-07-25</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.5</priority>
        <xhtml:link rel="alternate" hreflang="en" href="https://example.com/en/project/table/" />
        <xhtml:link rel="alternate" hreflang="es" href="https://example.com/es/project/table/" />
        <xhtml:link rel="alternate" hreflang="ru" href="https://example.com/ru/project/table/" />
    </url>
    <url>
        <loc>https://example.com/es/</loc>
        <lastmod>2020-07-25</lastmod>
        <xhtml:link rel="alternate" hreflang="en" href="https://example.com/en/" />
        <xhtml:link rel="alternate" hreflang="es" href="https://example.com/es/" />
        <xhtml:link rel="alternate" hreflang="ru" href="https://example.com/ru/" />
    </url>
    <url>
        <loc>https://example.com/es/project/house/</loc>
        <lastmod>2020-07-25</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.5</priority>
        <xhtml:link rel="alternate" hreflang="en" href="https://example.com/en/project/house/" />
        <xhtml:link rel="alternate" hreflang="es" href="https://example.com/es/project/house/" />
        <xhtml:link rel="alternate" hreflang="ru" href="https://example.com/ru/project/house/" />
    </url>
    <url>
        <loc>https://example.com/es/project/flower/</loc>
        <lastmod>2020-07-25</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.5</priority>
        <xhtml:link rel="alternate" hreflang="en" href="https://example.com/en/project/flower/" />
        <xhtml:link rel="alternate" hreflang="es" href="https://example.com/es/project/flower/" />
        <xhtml:link rel="alternate" hreflang="ru" href="https://example.com/ru/project/flower/" />
    </url>
    <url>
        <loc>https://example.com/es/project/table/</loc>
        <lastmod>2020-07-25</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.5</priority>
        <xhtml:link rel="alternate" hreflang="en" href="https://example.com/en/project/table/" />
        <xhtml:link rel="alternate" hreflang="es" href="https://example.com/es/project/table/" />
        <xhtml:link rel="alternate" hreflang="ru" href="https://example.com/ru/project/table/" />
    </url>
    <url>
        <loc>https://example.com/ru/</loc>
        <lastmod>2020-07-25</lastmod>
        <xhtml:link rel="alternate" hreflang="en" href="https://example.com/en/" />
        <xhtml:link rel="alternate" hreflang="es" href="https://example.com/es/" />
        <xhtml:link rel="alternate" hreflang="ru" href="https://example.com/ru/" />
    </url>
    <url>
        <loc>https://example.com/ru/project/house/</loc>
        <lastmod>2020-07-25</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.5</priority>
        <xhtml:link rel="alternate" hreflang="en" href="https://example.com/en/project/house/" />
        <xhtml:link rel="alternate" hreflang="es" href="https://example.com/es/project/house/" />
        <xhtml:link rel="alternate" hreflang="ru" href="https://example.com/ru/project/house/" />
    </url>
    <url>
        <loc>https://example.com/ru/project/flower/</loc>
        <lastmod>2020-07-25</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.5</priority>
        <xhtml:link rel="alternate" hreflang="en" href="https://example.com/en/project/flower/" />
        <xhtml:link rel="alternate" hreflang="es" href="https://example.com/es/project/flower/" />
        <xhtml:link rel="alternate" hreflang="ru" href="https://example.com/ru/project/flower/" />
    </url>
    <url>
        <loc>https://example.com/ru/project/table/</loc>
        <lastmod>2020-07-25</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.5</priority>
        <xhtml:link rel="alternate" hreflang="en" href="https://example.com/en/project/table/" />
        <xhtml:link rel="alternate" hreflang="es" href="https://example.com/es/project/table/" />
        <xhtml:link rel="alternate" hreflang="ru" href="https://example.com/ru/project/table/" />
    </url>
</urlset>
```

</p>
</details> 

## Sitemap options

##### `baseUrl` (`required`): `string`
The url that it's going to be used at the beginning of each page.

##### `exclude` (`optional`): `string[]`
The exclude parameter is an array of glob patterns to exclude static routes / folders from the generated sitemap.

##### `excludeExtensions` (`optional`): `string[]`
Ignore files by extension.

Example:
```js
// import { configureSitemap } from '@sergeymyssak/nextjs-sitemap'; // for typescript
const { configureSitemap } = require('@sergeymyssak/nextjs-sitemap');

const Sitemap = configureSitemap({
  // ...
  excludeExtensions: ['.ts'],
  // ...
});
Sitemap.generateSitemap();
```

##### `excludeIndex` (`optional`): `boolean`
Remove `index` from URL, directory will be ending with the slash. Defaults to `true`.

##### `include` (`optional`): `string[]`
Array of extra paths to include in the sitemap. If you want to add any route with dynamic parameters, you have to set an array of dynamic routes.

Example:
```js
// import { configureSitemap } from '@sergeymyssak/nextjs-sitemap'; // for typescript
const { configureSitemap } = require('@sergeymyssak/nextjs-sitemap');

const Sitemap = configureSitemap({
  // ...
  include: ['/project/1', '/project/2'],
  exclude: ['/project/[id]'], // or exclude: ['/project/*']
  // ...
});
Sitemap.generateSitemap();
```

##### `isSubdomain` (`optional`): `boolean`
Localization based on the subdomain - `https://en.example.com`. Defaults to `false`.

##### `isTrailingSlashRequired` (`optional`): `boolean`
Add trailing slashes. Defaults to `false`.

##### `langs` (`optional`): `string[]`
Array of languages. Localization based on the subdirectory - `https://example.com/en`.

##### `nextConfigPath` (`optional`): `string`
Use `exportPathMap` from `next.config.js` file.

##### `pagesConfig` (`optional`): `{ [key: string]: { priority: string, changefreq: string } }`
Object configuration of priority and changefreq per route / folder.

Example:
```js
// import { configureSitemap } from '@sergeymyssak/nextjs-sitemap'; // for typescript
const { configureSitemap } = require('@sergeymyssak/nextjs-sitemap');

const Sitemap = configureSitemap({
  // ...
  pagesConfig: {
    '/about': {
      priority: '0.5',
      changefreq: 'daily',
    },
    '/project/*': {
      priority: '0.9',
      changefreq: 'daily',
    },
  },
  // ...
});
Sitemap.generateSitemap();
```

##### `pagesDirectory` (`required`): `string`
The directory where there are Next.js pages.

##### `sitemapStylesheet` (`optional`): `{ type: string; styleFile: string; }[]`
Array of style objects that will be applied to sitemap.

Example:
```js
// import { configureSitemap } from '@sergeymyssak/nextjs-sitemap'; // for typescript
const { configureSitemap } = require('@sergeymyssak/nextjs-sitemap');

const Sitemap = configureSitemap({
  // ...
  sitemapStylesheet: [
    {
      type: "text/css",
      styleFile: "styles/styles.css"
    },
    {
      type: "text/xsl",
      styleFile: "styles/styles.xls"
    }
  ],
  // ...
});
Sitemap.generateSitemap();
```

## Useful information

- The value of the hreflang attribute identifies the language (in [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) format) and optionally a region (in [ISO 3166-1 Alpha 2](https://en.wikipedia.org/wiki/ISO_3166-1)  format) of an alternate URL. 
- You can gzip your sitemap.xml. The .gz extension just means that it's been compressed (using gzip compression), so that it's smaller and served faster. Most search engine bots can read gzip'd compressed content.
    
    <details><summary>Look at code how you can generate sitemap.xml.gz</summary>
    <p>
    
    ```js
    // import zlib from 'zlib';
    // import fs from 'fs';
    // import { configureSitemap } from '@sergeymyssak/nextjs-sitemap';

    const zlib = require('zlib');
    const fs = require('fs');
    const { configureSitemap } = require('@sergeymyssak/nextjs-sitemap');

    async function getDynamicPaths() {
      const data = ['house', 'flower', 'table'];
      return data.map((item) => `/project/${item}`);
    }

    getDynamicPaths().then((paths) => {
      const Sitemap = configureSitemap({
        baseUrl: 'https://example.com',
        include: paths,
        exclude: ['/project/[id]'], // or exclude: ['/project/*']
        excludeIndex: true,
        pagesConfig: {
          '/project/*': {
            priority: '0.5',
            changefreq: 'daily',
          },
        },
        isTrailingSlashRequired: true,
        targetDirectory: __dirname + '/public',
        pagesDirectory: __dirname + '/src/pages',
      });

      Sitemap.generateSitemap().then(() => {
        const inp = fs.createReadStream('public/sitemap.xml');
        const out = fs.createWriteStream('public/sitemap.xml.gz');
        const gzip = zlib.createGzip();
        inp.pipe(gzip).pipe(out);
        fs.unlink('public/sitemap.xml', () =>
          console.log('Sitemap.xml has been deleted!'),
        );
        console.log('Sitemap.xml.gz has been created!');
      });
    });
    ```

    </p>
    </details> 

<!-- badges -->
[version-badge]: https://img.shields.io/npm/v/@sergeymyssak/nextjs-sitemap.svg?style=flat-square
[package]: https://www.npmjs.com/package/@sergeymyssak/nextjs-sitemap
[downloads-badge]: https://img.shields.io/npm/dw/@sergeymyssak/nextjs-sitemap.svg?style=flat-square
[downloads]: https://www.npmjs.com/package/@sergeymyssak/nextjs-sitemap
[license-badge]: https://img.shields.io/npm/l/@sergeymyssak/nextjs-sitemap.svg?style=flat-square
[license]: https://opensource.org/licenses/ISC
