var assert = require('assert');
var phantom = require('x-ray-phantom');
var Xray = require('x-ray');
x = Xray()
    .driver(phantom({
        XSSAuditingEnabled: true,
        loadImages: false,
        webSecurity: false
    }));

x('http://google.com', 'title')(function(err, str) {
  if (err) return done(err);
  assert.equal('Google', str);
  done();
});