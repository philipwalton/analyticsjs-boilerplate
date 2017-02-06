import assert from 'assert';
import sinon from 'sinon';
import qs from 'querystring';
import * as analytics from '../../src/analytics/multiple-trackers';


const CLIENT_ID_PATTERN = /^\d+\.\d+$/;


const UUID_PATTERN =
    /^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[8-9a-b][\da-f]{3}-[\da-f]{12}$/;


describe('analytics/multiple-trackers', () => {
  describe('init', () => {
    beforeEach(() => {
      // Ensure sendBeacon exists so that transport mechanism is always used.
      if (!navigator.sendBeacon) navigator.sendBeacon = () => true;

      localStorage.clear();
      sinon.stub(navigator, 'sendBeacon', () => true);
    });

    afterEach(() => {
      ga('prod.remove');
      ga('test.remove');
      navigator.sendBeacon.restore();
    });

    it('creates a new tracker with the proper default fields', (done) => {
      analytics.init();

      // Wait for two pageviews and a single perf event.
      waitForHits(3).then(() => {
        ga((tracker) => {
          const prodTracker = ga.getByName('prod');
          const testTracker = ga.getByName('test');

          assert.strictEqual(prodTracker.get('transport'), 'beacon');
          assert.strictEqual(testTracker.get('transport'), 'beacon');
          done();
        });
      });
    });


    it('reports any errors that occured before tracker creation', () => {
      // Creates two fake error events, one with an error object like would
      // appear in most browsers, and one without, like would appear in IE9.
      window.__e.q = [{error: new Error('foo')}, {}];

      analytics.init();

      // Waits for two pageviews, four script errors, and a single perf event.
      return waitForHits(7).then(() => {
        // Just get the events.
        const hits = getHits((params) => params.ec == 'Script');

        assert.equal(hits[0].tid, 'UA-XXXXX-Y');
        assert.equal(hits[0].ec, 'Script');
        assert.equal(hits[0].ea, 'uncaught error');
        assert(hits[0].el.length);

        assert.equal(hits[1].tid, 'UA-XXXXX-Z');
        assert.equal(hits[1].ec, 'Script');
        assert.equal(hits[1].ea, 'uncaught error');
        assert(hits[1].el.length);

        assert.equal(hits[2].tid, 'UA-XXXXX-Y');
        assert.equal(hits[2].ec, 'Script');
        assert.equal(hits[2].ea, 'uncaught error');
        assert(hits[2].el === '(not set)');

        assert.equal(hits[3].tid, 'UA-XXXXX-Z');
        assert.equal(hits[3].ec, 'Script');
        assert.equal(hits[3].ea, 'uncaught error');
        assert(hits[3].el === '(not set)');

        window.__e.q = null;
      });
    });


    it('sends custom dimensions with every hit', () => {
      analytics.init();

      // Wait for two pageviews and a single perf event.
      return waitForHits(3).then(() => {
        const hits = getHits();

        assert.strictEqual(hits[0].tid, 'UA-XXXXX-Y');
        assert.strictEqual(hits[0].cd1, '1');
        assert(CLIENT_ID_PATTERN.test(hits[0].cd2));
        assert(UUID_PATTERN.test(hits[0].cd3));
        assert(UUID_PATTERN.test(hits[0].cd4));
        assert(hits[0].cd5 > (new Date - 1000));
        assert(hits[0].cd6 === 'pageview');
        assert(hits[0].cd7 === 'pageload');
        assert.strictEqual(hits[0].cd8, document.visibilityState);
        assert.strictEqual(hits[0].cd9, '(not set)');

        assert.strictEqual(hits[1].tid, 'UA-XXXXX-Z');
        assert(CLIENT_ID_PATTERN.test(hits[1].cd2));
        assert(UUID_PATTERN.test(hits[1].cd3));
        assert(UUID_PATTERN.test(hits[1].cd4));
        assert(hits[1].cd5 > (new Date - 1000));
        assert(hits[1].cd6 === 'pageview');
        assert(hits[1].cd7 === 'pageload');
        assert.strictEqual(hits[1].cd8, document.visibilityState);
        assert.strictEqual(hits[1].cd9, '(not set)');

        assert.strictEqual(hits[2].tid, 'UA-XXXXX-Z');
        assert.strictEqual(hits[2].cd1, '1');
        assert(CLIENT_ID_PATTERN.test(hits[2].cd2));
        assert(UUID_PATTERN.test(hits[2].cd3));
        assert(UUID_PATTERN.test(hits[2].cd4));
        assert(hits[2].cd5 > (new Date - 1000));
        assert(hits[2].cd6 == 'event');
        assert(hits[2].cd7 == '(not set)');
        assert.strictEqual(hits[2].cd8, document.visibilityState);
        assert.strictEqual(hits[2].cd9, '(not set)');

        // Assert window IDs are the same.
        assert.strictEqual(hits[1].cd3, hits[2].cd3);

        // Assert hit IDs are *not* the same.
        assert.notStrictEqual(hits[1].cd4, hits[2].cd4);
      });
    });

    it('includes select autotrack plugins', () => {
      const originalLocation = location.href;
      history.replaceState({}, null, '/test/?foo=bar');
      analytics.init();

      assert(window.gaplugins.CleanUrlTracker);
      assert(window.gaplugins.MaxScrollTracker);
      assert(window.gaplugins.OutboundLinkTracker);
      assert(window.gaplugins.PageVisibilityTracker);
      assert(window.gaplugins.UrlChangeTracker);

      // Wait for two pageviews and a single perf event.
      return waitForHits(3).then(() => {
        const hits = getHits();

        assert.strictEqual(hits[0].tid, 'UA-XXXXX-Y');
        assert.strictEqual(hits[0].dp, '/test');
        assert.strictEqual(hits[0].cd9, 'foo=bar');
        assert.strictEqual(hits[0]._au, '121'); // 100100001

        assert.strictEqual(hits[1].tid, 'UA-XXXXX-Z');
        assert.strictEqual(hits[1].dp, '/test');
        assert.strictEqual(hits[1].cd9, 'foo=bar');
        assert.strictEqual(hits[1]._au, '361'); // 1101100001

        assert.strictEqual(hits[2].tid, 'UA-XXXXX-Z');
        assert.strictEqual(hits[2].dp, '/test');
        assert.strictEqual(hits[2].cd9, 'foo=bar');
        assert.strictEqual(hits[2]._au, '361'); // 1101100001

        history.replaceState({}, null, originalLocation);
      });
    });

    it('sends an initial pageview with the hit source', () => {
      analytics.init();

      // Wait for two pageviews and a single perf event.
      return waitForHits(3).then(() => {
        const hits = getHits();

        assert.strictEqual(hits[0].tid, 'UA-XXXXX-Y');
        assert.strictEqual(hits[0].t, 'pageview');
        assert.strictEqual(hits[0].cd7, 'pageload');

        assert.strictEqual(hits[1].tid, 'UA-XXXXX-Z');
        assert.strictEqual(hits[1].t, 'pageview');
        assert.strictEqual(hits[1].cd7, 'pageload');
      });
    });

    it('sends a performance event with navigation timing data', () => {
      analytics.init();

      // Wait for two pageviews and a single perf event.
      return waitForHits(3).then(() => {
        const hits = getHits();

        assert.strictEqual(hits[2].tid, 'UA-XXXXX-Z');
        assert(/^\d+$/.test(hits[2].cm1));
        assert(/^\d+$/.test(hits[2].cm2));
        assert(/^\d+$/.test(hits[2].cm3));
        assert(parseInt(hits[2].cm2) >= parseInt(hits[2].cm1));
        assert(parseInt(hits[2].cm3) >= parseInt(hits[2].cm2));

        // Assert custom metrics aren't set on the pageview.
        assert.strictEqual(hits[0].cm1, undefined);
        assert.strictEqual(hits[0].cm2, undefined);
        assert.strictEqual(hits[0].cm3, undefined);
        assert.strictEqual(hits[1].cm1, undefined);
        assert.strictEqual(hits[1].cm2, undefined);
        assert.strictEqual(hits[1].cm3, undefined);
      });
    });

    it('sends the performance hit as a non-interaction event', () => {
      analytics.init();

      // Wait for two pageviews and a single perf event.
      return waitForHits(3).then(() => {
        const hits = getHits();

        assert.strictEqual(hits[2].tid, 'UA-XXXXX-Z');
        assert.strictEqual(hits[2].t, 'event');
        assert.strictEqual(hits[2].ni, '1');
      });
    });
  });
});


const getHits = (filter) => {
  const hits = navigator.sendBeacon.args.map((args) => qs.parse(args[1]));
  return filter ? hits.filter(filter) : hits;
};


const waitForHits = (count) => {
  const startTime = +new Date;
  return new Promise((resolve, reject) => {
    (function f() {
      if (navigator.sendBeacon.callCount === count) {
        resolve();
      } else if (new Date - startTime > 2000) {
        console.log(getHits());
        reject(new Error(`Timed out waiting for ${count} hits ` +
            `(${navigator.sendBeacon.callCount} hits received).`));
      } else {
        setTimeout(() => f(count), 100);
      }
    }());
  });
};
