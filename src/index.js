const main = () => {
  // Load and initialize all analytics code lazily, so its non-blocking.
  import('./analytics').then((analytics) => analytics.init());

  // Initate all other code paths here...
};

// Start the app through its main entry point.
main();
