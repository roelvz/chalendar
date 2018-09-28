'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
var jwt = require('express-jwt');
var jwks = require('jwks-rsa');

var app = module.exports = loopback();

var authCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    // YOUR-AUTH0-DOMAIN name e.g https://prosper.auth0.com
    jwksUri: 'https://chalendar.eu.auth0.com/.well-known/jwks.json',
  }),
  // This is the identifier we set when we created the API
  audience: 'https://chalendar.com/',
  // issuer: 'https://chalendar.eu.auth0.com',
  algorithms: ['RS256'],
});

if (app.settings.env !== 'development') {
  app.use(authCheck);
}

// apply to a path
// app.use('/api/Groups', function(req, res, next) {
//   res.json('It has valid token', req.user);
// });

// catch error
app.use(function(err, req, res, next) {
  console.log(err);
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('Invalid token, or no token supplied!');
  } else {
    res.status(401).send('Unexpected error');
  }
});

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
