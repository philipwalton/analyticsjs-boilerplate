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

### Custom dimensions & metrics

The boilerplate scripts use several custom dimensions and metrics that you'll need to set up within Google Analytics.

#### Custom dimensions

These can be set up on Google Analytics by going to the `Admin` section, clicking on `Custom Definitions` in the `PROPERTY` column will reveal a link to `Custom Dimensions`.

Make sure the dimension index number in the admin panel matches up with the number appended to `dimension` for the corresponding key in the `dimensions` object in the script you use; i.e. if when you set up the `Hit Source` dimension it ends up with an index of `12`, then the `dimensions` object should include `HIT_SOURCE: 'dimension12'`.

| Name             | Script reference | Scope |
| :-------------   | :-------------   | :---- |
| Tracking Version | TRACKING_VERSION | Hit   |
| Client ID        | CLIENT_ID        | User  |
| Window ID        | WINDOW_ID        | Hit   |
| Hit ID           | HIT_ID           | Hit   |
| Hit Time         | HIT_TIME         | Hit   |
| Hit Type         | HIT_TYPE         | Hit   |
| Hit Source       | HIT_SOURCE       | Hit   |
| Visibility State | VISIBILITY_STATE | Hit   |
| Url Query Params | URL_QUERY_PARAMS | Hit   |

#### Custom metrics

These can be set up on Google Analytics by going to the `Admin` section, clicking on `Custom Definitions` in the `PROPERTY` column will reveal a link to `Custom Metrics`.

Make sure the metric index number in the admin panel matches up with the number appended to `metric` in the `metrics` object in the script you use; i.e. if when you set up the `Max Scroll Percentage` metric it ends up with an index of `9`, then the `metrics` object should include `MAX_SCROLL_PERCENTAGE: 'metric9'`.

| Name                 | Script reference      | Scope | Formatting Type |
| :-------------       | :-------------        | :---- | :-------------- |
| Response End Time    | RESPONSE_END_TIME     | Hit   | Integer         |
| DOM Load Time        | DOM_LOAD_TIME         | Hit   | Integer         |
| Window Load Time     | WINDOW_LOAD_TIME      | Hit   | Integer         |
| Page Visible         | PAGE_VISIBLE          | Hit   | Integer         |
| Max Scroll Percentage| MAX_SCROLL_PERCENTAGE | Hit   | Integer         |
| Page Loads           | PAGE_LOADS            | Hit   | Integer         |
