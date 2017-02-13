# analytics.js boilerplate

Best practices for implementing analytics.js on modern websites.

For an in-depth explanation of all the features used in this boilerplate (as well as how to report on them), see my article:

[**The Google Analytics Setup I Use on Every Site I Build**](https://philipwalton.com/articles/the-google-analytics-setup-i-use-on-every-site-i-build/) &#8594;

## Boilerplate versions

### [`analytics/base.js`](/src/analytics/base.js)

The base boilerplate extends the [default tracking snippet](https://developers.google.com/analytics/devguides/collection/analyticsjs/#alternative_async_tracking_snippet) and includes the following features:

- Tracks uncaught errors.
- Tracks custom user, session, and hit-level dimensions.
- Sends an initial pageview.
- Sends a pageload performance event.

### [`analytics/autotrack.js`](/src/analytics/autotrack.js)

The autotrack boilerplate builds on top the base boilerplate and includes [select autotrack plugins](https://philipwalton.com/articles/the-google-analytics-setup-i-use-on-every-site-i-build/#using-autotrack-plugins)

### [`analytics/multiple-trackers.js`](/src/analytics/multiple-trackers.js)

The multiple-trackers boilerplate builds on the autotrack boilerplate and includes support for using [multiple trackers](https://philipwalton.com/articles/the-google-analytics-setup-i-use-on-every-site-i-build/#testing-your-implementation).

## Running the boilerplate locally

analytics.js boilerplate uses [webpack](https://webpack.js.org/) to compile the source and [webpack-dev-server](https://github.com/webpack/webpack-dev-server) to run it locally.

To install the dependencies and load the boilerplate in a browser, run the following commands:

```sh
npm install
npm start
```

Then visit [localhost:8080](http://localhost:8080) in your browser and open the developer console to see the analytics.js debug output.

### Running different boilerplate versions

The boilerplate [`index.js`](/src/index.js#L7) JavaScript file imports the base boilerplate by default. To run a different version, replace the URL imported via `import('./analytics/base.js')` with the version you want to load.
