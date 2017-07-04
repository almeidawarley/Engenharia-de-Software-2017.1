exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['login-spec.js'],
  capabilities: {
    'browserName': 'chrome'
  },
  allScriptsTimeout: 1200,
  jasmineNodeOpts: {
	defaultTimeoutInterval: 1800000
  }
};