# Next.js sitemap generator

[![Version][version-badge]][package]
[![Downloads][downloads-badge]][downloads]
[![ISC License][license-badge]][license]

Generate dynamic sitemap.xml for Next.js projects!  
Checkout the [examples](https://github.com/SergeyMyssak/nextjs-sitemap/tree/master/examples) folder for source code.

## Installation

Open a Terminal in the project root and run:

```sh
npm install @sergeymyssak/nextjs-sitemap
```
or

```shell
yarn add @sergeymyssak/nextjs-sitemap
```

## Usage

### Sample generated sitemap
Checkout the [Google sitemap example](https://support.google.com/webmasters/answer/189077#sitemap).

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<urlset xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 
    http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd" 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xhtml="http://www.w3.org/1999/xhtml">
    <url>
        <loc>https://example.com/en/about</loc>
        <lastmod>2020-06-28</lastmod>
        <xhtml:link rel="alternate" hreflang="en" href="https://example.com/en/about" />
        <xhtml:link rel="alternate" hreflang="es" href="https://example.com/es/about" />
        <xhtml:link rel="alternate" hreflang="ru" href="https://example.com/ru/about" />
    </url>
    <url>
        <loc>https://example.com/es/about</loc>
        <lastmod>2020-06-28</lastmod>
        <xhtml:link rel="alternate" hreflang="en" href="https://example.com/en/about" />
        <xhtml:link rel="alternate" hreflang="es" href="https://example.com/es/about" />
        <xhtml:link rel="alternate" hreflang="ru" href="https://example.com/ru/about" />
    </url>
    <url>
        <loc>https://example.com/ru/about</loc>
        <lastmod>2020-06-28</lastmod>
        <xhtml:link rel="alternate" hreflang="en" href="https://example.com/en/about" />
        <xhtml:link rel="alternate" hreflang="es" href="https://example.com/es/about" />
        <xhtml:link rel="alternate" hreflang="ru" href="https://example.com/ru/about" />
    </url>
</urlset>
```

### Setup a sitemap

All static routes (eg. `/pages/about.*`) are automatically add to the sitemap. 
```js
// See typescript version in examples
const { configureSitemap } = require('@sergeymyssak/nextjs-sitemap');

const Sitemap = configureSitemap({
  baseUrl: 'https://example.com',
  pagesConfig: {
    '/about': {
      priority: '0.5',
      changefreq: 'daily',
    },
  },
  targetDirectory: __dirname + '/public',
  pagesDirectory: __dirname + '/src/pages',
});
Sitemap.generateSitemap();
```

For dynamic routes (eg. `/pages/project/[id].*`), you have to declare them with the `include` property.  
```js
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
```

You can exclude any path with the `exclude` property.
```js
const { configureSitemap } = require('@sergeymyssak/nextjs-sitemap');

const Sitemap = configureSitemap({
  baseUrl: 'https://example.com',
  exclude: ['/about'],
  targetDirectory: __dirname + '/public',
  pagesDirectory: __dirname + '/src/pages',
});
Sitemap.generateSitemap();
```

### Sitemap options

##### `baseUrl` (`required`): `string`
The url that it's going to be used at the beginning of each page.

##### `exclude` (`optional`): `string[]`
The exclude parameter is an array of glob patterns to exclude static routes from the generated sitemap.

##### `excludeExtensions` (`optional`): `string[]`
Ignore files by extension.

Example:
```js
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
const { configureSitemap } = require('@sergeymyssak/nextjs-sitemap');

const Sitemap = configureSitemap({
  // ...
  include: ['/project/1', '/project/2'],
  exclude: ['/project/[id]'],
  // ...
});
Sitemap.generateSitemap();
```

##### `isSubdomain` (`optional`): `boolean`
Localization based on the subdomain - `https://en.example.com`. Defaults to `false`.

##### `langs` (`optional`): `string[]`
Array of languages. Localization based on the subdirectory - `https://example.com/en`.

##### `nextConfigPath` (`optional`): `string`
Use `exportPathMap` from `next.config.js` file.

##### `pagesConfig` (`optional`): `{ [key: string]: { priority: string, changefreq: string } }`
Object configuration of priority and changefreq per route.

Example:
```js
const { configureSitemap } = require('@sergeymyssak/nextjs-sitemap');

const Sitemap = configureSitemap({
  // ...
  pagesConfig: {
    '/about': {
      priority: '0.5',
      changefreq: 'daily',
    },
    '/works': {
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

- [Google sitemap example](https://support.google.com/webmasters/answer/189077#sitemap)  
- The value of the hreflang attribute identifies the language (in [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) format) and optionally a region (in [ISO 3166-1 Alpha 2](https://en.wikipedia.org/wiki/ISO_3166-1)  format) of an alternate URL. 

<!-- badges -->
[version-badge]: https://img.shields.io/npm/v/@sergeymyssak/nextjs-sitemap.svg?style=flat-square
[package]: https://www.npmjs.com/package/@sergeymyssak/nextjs-sitemap
[downloads-badge]: https://img.shields.io/npm/dw/@sergeymyssak/nextjs-sitemap.svg?style=flat-square
[downloads]: https://www.npmjs.com/package/@sergeymyssak/nextjs-sitemap
[license-badge]: https://img.shields.io/npm/l/@sergeymyssak/nextjs-sitemap.svg?style=flat-square
[license]: https://opensource.org/licenses/ISC
