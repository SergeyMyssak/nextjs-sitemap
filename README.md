# Next.js sitemap generator

[![Version][version-badge]][package]
[![Downloads][downloads-badge]][downloads]
[![ISC License][license-badge]][license]

Generate dynamic `sitemap.xml` for Next.js projects following the [example](https://support.google.com/webmasters/answer/189077#sitemap) of Google! 
- Support for `nextjs.config.js`
- Support for dynamic routes
- Support for localization
- Support for multiple sitemaps

Checkout the [examples](https://github.com/SergeyMyssak/nextjs-sitemap/tree/master/examples) folder for source code.

## Documentation

- [Installation](#installation)
- [Quick start](#quick-start)
    - [With exportPathMap](#with-exportpathmap)
    - [With dynamic routes](#with-dynamic-routes)
    - [With localization](#with-localization)
    - [Multiple sitemaps](#multiple-sitemaps)
- [Sitemap methods](#sitemap-methods)
- [Sitemap options](#sitemap-options)
- [Useful information](#useful-information)
    - [Language localisation](#language-localisation)
    - [Gzip](#gzip)


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
// import { configureSitemap } from '@sergeymyssak/nextjs-sitemap';
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
```
<details><summary>Look at the generated <code>sitemap.xml</code></summary>
<p>
    
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd" 
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xhtml="http://www.w3.org/1999/xhtml">
    <url>
        <loc>http://example.com/</loc>
        <lastmod>2021-09-12</lastmod>
        <xhtml:link rel="alternate" hreflang="en" href="http://example.com/" />
    </url>
    <url>
        <loc>http://example.com/projects/computers/laptop/</loc>
        <lastmod>2021-09-12</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.5</priority>
        <xhtml:link rel="alternate" hreflang="en" href="http://example.com/projects/computers/laptop/" />
    </url>
    <url>
        <loc>http://example.com/projects/computers/pc/</loc>
        <lastmod>2021-09-12</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.5</priority>
        <xhtml:link rel="alternate" hreflang="en" href="http://example.com/projects/computers/pc/" />
    </url>
    <url>
        <loc>http://example.com/projects/phones/android/</loc>
        <lastmod>2021-09-12</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.5</priority>
        <xhtml:link rel="alternate" hreflang="en" href="http://example.com/projects/phones/android/" />
    </url>
    <url>
        <loc>http://example.com/projects/phones/ios/</loc>
        <lastmod>2021-09-12</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.5</priority>
        <xhtml:link rel="alternate" hreflang="en" href="http://example.com/projects/phones/ios/" />
    </url>
</urlset>
```

</p>
</details> 

#### With exportPathMap

If you specify `nextConfigPath` prop, then all values indicated in the [exportPathMap](https://nextjs.org/docs/api-reference/next.config.js/exportPathMap) will be automatically added (`pages` folder will be ignored). 
```js
// import { configureSitemap } from '@sergeymyssak/nextjs-sitemap';
const { configureSitemap } = require('@sergeymyssak/nextjs-sitemap');

const Sitemap = configureSitemap({
  exclude: ['/admin'],
  excludeIndex: true,
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
```

<details><summary>Example of <code>exportPathMap</code> in <code>next.config.js</code></summary>
<p>
    
```js
module.exports = {
  i18n: {
    domains: [
      {
        domain: 'example.com',
        defaultLocale: 'en',
        locales: ['en-US', 'en-CA'],
      },
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
```

</p>
</details> 

<details><summary>Look at the generated <code>sitemap.xml</code></summary>
<p>
    
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd" 
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xhtml="http://www.w3.org/1999/xhtml">
    <url>
        <loc>https://example.com/</loc>
        <lastmod>2021-09-12</lastmod>
        <xhtml:link rel="alternate" hreflang="en" href="https://example.com/" />
        <xhtml:link rel="alternate" hreflang="en-US" href="https://example.com/en-US/" />
        <xhtml:link rel="alternate" hreflang="en-CA" href="https://example.com/en-CA/" />
    </url>
    <url>
        <loc>https://example.com/en-US/</loc>
        <lastmod>2021-09-12</lastmod>
        <xhtml:link rel="alternate" hreflang="en" href="https://example.com/" />
        <xhtml:link rel="alternate" hreflang="en-US" href="https://example.com/en-US/" />
        <xhtml:link rel="alternate" hreflang="en-CA" href="https://example.com/en-CA/" />
    </url>
    <url>
        <loc>https://example.com/en-CA/</loc>
        <lastmod>2021-09-12</lastmod>
        <xhtml:link rel="alternate" hreflang="en" href="https://example.com/" />
        <xhtml:link rel="alternate" hreflang="en-US" href="https://example.com/en-US/" />
        <xhtml:link rel="alternate" hreflang="en-CA" href="https://example.com/en-CA/" />
    </url>
    <url>
        <loc>https://example.com/p/learn-nextjs/</loc>
        <lastmod>2021-09-12</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.5</priority>
        <xhtml:link rel="alternate" hreflang="en" href="https://example.com/p/learn-nextjs/" />
        <xhtml:link rel="alternate" hreflang="en-US" href="https://example.com/en-US/p/learn-nextjs/" />
        <xhtml:link rel="alternate" hreflang="en-CA" href="https://example.com/en-CA/p/learn-nextjs/" />
    </url>
    <url>
        <loc>https://example.com/en-US/p/learn-nextjs/</loc>
        <lastmod>2021-09-12</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.5</priority>
        <xhtml:link rel="alternate" hreflang="en" href="https://example.com/p/learn-nextjs/" />
        <xhtml:link rel="alternate" hreflang="en-US" href="https://example.com/en-US/p/learn-nextjs/" />
        <xhtml:link rel="alternate" hreflang="en-CA" href="https://example.com/en-CA/p/learn-nextjs/" />
    </url>
    <url>
        <loc>https://example.com/en-CA/p/learn-nextjs/</loc>
        <lastmod>2021-09-12</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.5</priority>
        <xhtml:link rel="alternate" hreflang="en" href="https://example.com/p/learn-nextjs/" />
        <xhtml:link rel="alternate" hreflang="en-US" href="https://example.com/en-US/p/learn-nextjs/" />
        <xhtml:link rel="alternate" hreflang="en-CA" href="https://example.com/en-CA/p/learn-nextjs/" />
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
// import { configureSitemap } from '@sergeymyssak/nextjs-sitemap';
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
```

<details><summary>Look at the generated <code>sitemap.xml</code></summary>
<p>
    
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd" 
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xhtml="http://www.w3.org/1999/xhtml">
    <url>
        <loc>https://example.com/</loc>
        <lastmod>2021-09-12</lastmod>
        <xhtml:link rel="alternate" hreflang="en" href="https://example.com/" />
    </url>
    <url>
        <loc>https://example.com/project/house/</loc>
        <lastmod>2021-09-12</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.5</priority>
        <xhtml:link rel="alternate" hreflang="en" href="https://example.com/project/house/" />
    </url>
    <url>
        <loc>https://example.com/project/flower/</loc>
        <lastmod>2021-09-12</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.5</priority>
        <xhtml:link rel="alternate" hreflang="en" href="https://example.com/project/flower/" />
    </url>
    <url>
        <loc>https://example.com/project/table/</loc>
        <lastmod>2021-09-12</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.5</priority>
        <xhtml:link rel="alternate" hreflang="en" href="https://example.com/project/table/" />
    </url>
</urlset>
```

</p>
</details> 

#### With localization

If you have localization, you can use `locales` in `domains` prop.
```js
// import { configureSitemap } from '@sergeymyssak/nextjs-sitemap';
const { configureSitemap } = require('@sergeymyssak/nextjs-sitemap');

const Sitemap = configureSitemap({
  domains: [{ domain: 'example.com', locales: ['en', 'es'] }],
  excludeIndex: true,
  trailingSlash: true,
  targetDirectory: __dirname + '/public',
  pagesDirectory: __dirname + '/src/pages',
});

Sitemap.generateSitemap();
```

<details><summary>Look at the generated <code>sitemap.xml</code></summary>
<p>
    
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd" 
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xhtml="http://www.w3.org/1999/xhtml">
    <url>
        <loc>https://example.com/en/about/</loc>
        <lastmod>2021-09-10</lastmod>
        <xhtml:link rel="alternate" hreflang="en" href="https://example.com/en/about/" />
        <xhtml:link rel="alternate" hreflang="es" href="https://example.com/es/about/" />
    </url>
    <url>
        <loc>https://example.com/es/about/</loc>
        <lastmod>2021-09-10</lastmod>
        <xhtml:link rel="alternate" hreflang="en" href="https://example.com/en/about/" />
        <xhtml:link rel="alternate" hreflang="es" href="https://example.com/es/about/" />
    </url>
    <url>
        <loc>https://example.com/en/</loc>
        <lastmod>2021-09-10</lastmod>
        <xhtml:link rel="alternate" hreflang="en" href="https://example.com/en/" />
        <xhtml:link rel="alternate" hreflang="es" href="https://example.com/es/" />
    </url>
    <url>
        <loc>https://example.com/es/</loc>
        <lastmod>2021-09-10</lastmod>
        <xhtml:link rel="alternate" hreflang="en" href="https://example.com/en/" />
        <xhtml:link rel="alternate" hreflang="es" href="https://example.com/es/" />
    </url>
    <url>
        <loc>https://example.com/en/works/</loc>
        <lastmod>2021-09-10</lastmod>
        <xhtml:link rel="alternate" hreflang="en" href="https://example.com/en/works/" />
        <xhtml:link rel="alternate" hreflang="es" href="https://example.com/es/works/" />
    </url>
    <url>
        <loc>https://example.com/es/works/</loc>
        <lastmod>2021-09-10</lastmod>
        <xhtml:link rel="alternate" hreflang="en" href="https://example.com/en/works/" />
        <xhtml:link rel="alternate" hreflang="es" href="https://example.com/es/works/" />
    </url>
</urlset>
```

</p>
</details> 

#### Multiple sitemaps

If the number of urls is more than 50000, then several sitemaps will be automatically created. You can customize the number of urls using `sitemapSize`
```js
// import { configureSitemap } from '@sergeymyssak/nextjs-sitemap';
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
```

<details><summary>Look at <code>public</code> directory</summary>
<p>
    
```
└── src
    └── public
        ├── sitemap.xml
        ├── sitemap1.xml
        ├── sitemap2.xml
        └── sitemap3.xml
```

</p>
</details> 

## Sitemap methods
##### `generateSitemap`: `() => Promise<ISitemapWriterResultItem[]>`;

Generate sitemap

```
ISitemapWriterResultItem {
  name: string; // sitemap file name
  count: number; // number of urls
}
```
       
##### `regenerateSitemapIndex`: `(sitemapsNames: string[]) => void`;

When there are multiple sitemaps, a `sitemap index` is generated. If we somehow changed our sitemaps externally, then you can use this function to update `sitemap index`

## Sitemap options

##### `domains` (`optional`): `IDomain[]`
Domain list - same as in [next.config.js](https://nextjs.org/docs/advanced-features/i18n-routing).  
```
IDomain {
  domain: string; // domain name
  defaultLocale?: string; // non-routing language
  locales?: string[]; // routing languages
  http?: boolean; // http or https
}
```

##### `exclude` (`optional`): `string[]`
The exclude parameter is an array of glob patterns to exclude static routes / folders from the generated sitemap.

##### `excludeExtensions` (`optional`): `string[]`
Ignore files by extension.

Example:
```js
// import { configureSitemap } from '@sergeymyssak/nextjs-sitemap';
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
// import { configureSitemap } from '@sergeymyssak/nextjs-sitemap';
const { configureSitemap } = require('@sergeymyssak/nextjs-sitemap');

const Sitemap = configureSitemap({
  // ...
  include: ['/project/1', '/project/2'],
  exclude: ['/project/[id]'], // or exclude: ['/project/*']
  // ...
});
Sitemap.generateSitemap();
```

##### `trailingSlash` (`optional`): `boolean`
Add trailing slashes. Defaults to `false`.

##### `nextConfigPath` (`optional`): `string`
Use `exportPathMap` from `next.config.js` file.

##### `pagesConfig` (`optional`): `IPagesConfig[]`
Object configuration of priority and changefreq per route / folder.
```
IPagesConfig {
  [key: string]: { 
    priority: string,
    changefreq: string 
  }
}
```

Example:
```js
// import { configureSitemap } from '@sergeymyssak/nextjs-sitemap';
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

##### `targetDirectory` (`required`): `string`
The path to the public folder.

##### `sitemapUrl` (`optional`): `string`
The url which will be specified in the `sitemap index` file.

##### `sitemapSize` (`optional`): `number`
Maximum number of `url` in one sitemap file. Defaults to `50000`.

##### `sitemapStylesheet` (`optional`): `ISitemapStylesheet[]`
Array of style objects that will be applied to sitemap.
```
ISitemapStylesheet {
  type: string;
  styleFile: string;
}
```

Example:
```js
// import { configureSitemap } from '@sergeymyssak/nextjs-sitemap';
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

#### Language localisation
The value of the hreflang attribute identifies the language (in [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) format) and optionally a region (in [ISO 3166-1 Alpha 2](https://en.wikipedia.org/wiki/ISO_3166-1)  format) of an alternate URL. 

#### Gzip
You can gzip your `sitemap.xml`. The .gz extension just means that it's been compressed (using gzip compression), so that it's smaller and served faster. Most search engine bots can read gzip'd compressed content.
    
<details><summary>Look at code how you can generate <code>sitemap.xml.gz</code></summary>
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
