/* global ga */


/**
 * The tracking ID for your Google Analytics property.
 * https://support.google.com/analytics/answer/1032385
 */
const TRACKING_ID = 'UA-12345-1';


/**
 * Bump this when making backwards incompatible changes to the tracking
 * implementation. This allows you to create a segment or view filter
 * that isolates only data captured with the most recent tracking changes.
 */
const TRACKING_VERSION = '1';


/**
 * A default value for dimensions so unset values always are reported as
 * something. This is needed since Google Analytics will drop empty dimension
 * values in reports.
 */
const NULL_VALUE = '(not set)';


/**
 * A maping between custom dimension names and their indexes.
 */
const dimensions = {
  TRACKING_VERSION: 'dimension1',
  CLIENT_ID: 'dimension2',
  WINDOW_ID: 'dimension3',
  HIT_ID: 'dimension4',
  HIT_TIME: 'dimension5',
  HIT_TYPE: 'dimension6',
  HIT_SOURCE: 'dimension7',
  PAGE_PATH: 'dimension8',
  VISIBILITY_STATE: 'dimension9',
};


/**
 * A maping between custom dimension names and their indexes.
 */
const metrics = {
  DOM_LOAD_TIME: 'metric1',
  WINDOW_LOAD_TIME: 'metric2',
};


/**
 * Initializes all the analytics setup. Creates trackers and sets initial
 * values on the trackers.
 */
export const init = () => {
  createTracker();
  trackErrors();
  trackCustomDimensions();
  sendInitialPageview();
  sendPageloadMetrics();
};


/**
 * Creates the trackers and sets the default transport and tracking
 * version fields. In non-production environments it also logs hits.
 */
const createTracker = () => {
  ga('create', TRACKING_ID, 'auto');

  // Ensures all hits are sent via `navigator.sendBeacon()`.
  ga('set', 'transport', 'beacon');
};


/**
 * Tracks any errors that may have occured on the page prior to analytics being
 * initialized, then adds an event handler to track future errors.
 */
const trackErrors = () => {
  // Errors that have occurred prior to this script running are stored on
  // `window.__e.q`, as specified in `index.html`.
  const loadErrorEvents = window.__e && window.__e.q || [];

  /**
   * @param {!ErrorEvent} event
   */
  const trackErrorEvent = (event) => {
    ga('send', 'event', {
      eventCategory: 'Script',
      eventAction: 'uncaught error',
      eventLabel: (event.error && event.error.stack) || NULL_VALUE,
      nonInteraction: true,
    });
  };

  // Replay any stored load error events.
  for (let event of loadErrorEvents) {
    trackErrorEvent(event);
  }

  // Add a new listener to track event immediately.
  window.addEventListener('error', trackErrorEvent);
};


/**
 * Sets a default dimension value for all custom dimensions on all trackers.
 */
const trackCustomDimensions = () => {
  // Sets a default dimension value for all custom dimensions to ensure
  // that every dimension in every hit has *some* value. This is necessary
  // because Google Analytics will drop rows with empty dimension values
  // in your reports.
  Object.keys(dimensions).forEach((key) => {
    ga('set', dimensions[key], NULL_VALUE);
  });

  // Adds tracking of dimensions known at page load time.
  ga((tracker) => {
    tracker.set({
      [dimensions.TRACKING_VERSION]: TRACKING_VERSION,
      [dimensions.CLIENT_ID]: tracker.get('clientId'),
      [dimensions.WINDOW_ID]: uuid(),
    });
  });

  // Adds tracking to record each the type, time, uuid, and visibility state
  // of each hit immediately before it's sent.
  ga((tracker) => {
    const originalBuildHitTask = tracker.get('buildHitTask');
    tracker.set('buildHitTask', (model) => {
      model.set(dimensions.HIT_ID, uuid(), true);
      model.set(dimensions.HIT_TIME, String(+new Date), true);
      model.set(dimensions.HIT_TYPE, model.get('hitType'), true);
      model.set(dimensions.VISIBILITY_STATE, document.visibilityState, true);

      const page = model.get('page') || (location.pathname + location.search);
      model.set(dimensions.PAGE_PATH, page, true),

      originalBuildHitTask(model);
    });
  });
};


/**
 * Sends the initial pageview to Google Analytics.
 */
const sendInitialPageview = () => {
  ga('send', 'pageview', {[dimensions.HIT_SOURCE]: 'pageload'});
};


/**
 * Gets the DOM and window load times and sends them as custom metrics to
 * Google Analytics via an event hit.
 */
const sendPageloadMetrics = () => {
  // Only track performance in supporting browsers.
  if (!(window.performance && window.performance.timing)) return;

  whenWindowLoaded(() => {
    const nt = performance.timing;
    const navStart = nt.navigationStart;

    // Ignore cases where navStart is 0
    // https://www.w3.org/2010/webperf/track/actions/23
    if (!navStart) return;

    const domLoaded = nt.domContentLoadedEventStart - navStart;
    const windowLoaded = nt.loadEventStart - navStart;

    ga('send', 'event', {
      eventCategory: 'Performance',
      eventAction: 'track',
      eventLabel: 'pageload',
      nonInteraction: true,
      [metrics.DOM_LOAD_TIME]: domLoaded,
      [metrics.WINDOW_LOAD_TIME]: windowLoaded,
    });
  });
};


/**
 * Runs a callback when the load event fires (or immediately if the window
 * is already loaded).
 * @param {Function} callback
 */
const whenWindowLoaded = (callback) => {
  if (document.readyState == 'complete') {
    callback();
  } else {
    window.addEventListener('load', function f() {
      window.removeEventListener('load', f);
      callback();
    });
  }
};


/**
 * Generates a UUID.
 * https://gist.github.com/jed/982883
 * @param {string|undefined=} a
 * @return {string}
 */
const uuid = function b(a) {
  return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) :
      ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, b);
};
