# analytics.js boilerplate

Best practices for implementing analytics.js on modern websites.

For an in-depth explanation of all the features used in this boilerplate (as well as how to report on them), see my article: [The Google Analytics Setup I Use on All My Websites](https://philipwalton.com/the-google-analytics-setup-i-use-on-all-my-websites)

## Boilerplate versions

### Base

The [base boilerplate](/src/analytics/index.js) extends the [default tracking snippet](https://developers.google.com/analytics/devguides/collection/analyticsjs/#alternative_async_tracking_snippet) and includes the following features:

- Tracks uncaught errors.
- Tracks custom user, session, and hit-level dimensions.
- Sends an initial pageview.
- Sends a pageload performance event.

### Autotrack

The [autotrack boilerplate](/src/analytics/autotrack.js) builds on top the base boilerplate and includes [select autotrack plugins](https://philipwalton.com/the-google-analytics-setup-i-use-on-all-my-websites#autotrack-plugins)

### Multiple trackers

The [multiple-trackers boilerplate](/src/analytics/multiple-tracker.js) builds on the autotrack boilerplate and includes support for using [multiple trackers](https://philipwalton.com/the-google-analytics-setup-i-use-on-all-my-websites#testing-your-implementation-using-multiple-trackers).

## Running the boilerplate locally

analytics.js boilerplate uses [webpack](https://webpack.js.org/) to compile the source and [webpack-dev-server](https://github.com/webpack/webpack-dev-server) to run it locally.

To install the dependencies and load the boilerplate in a brower, run the following commands:

```sh
npm install
npm start
```

Then visit [localhost:8080](http://localhost:8080) in your browser and open the developer console to see the analytics.js debug output.