exports.config = {
  directConnect: (process.env.CI !== 'true'),
  specs: ['spec.js']
}
