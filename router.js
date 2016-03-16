var HttpHashRouter = require('http-hash-router')

var Version = require('./routes/version')
var Start = require('./routes/start')
var Stop = require('./routes/stop')

module.exports = function(config){

  var router = HttpHashRouter();

  router.set('/v1/version', {
    GET:Version(config)
  })

  router.set('/v1/start', {
    POST:Start(config)
  })

  router.set('/v1/stop', {
    POST:Stop(config)
  })

  function handler(req, res) {
    router(req, res, {}, onError);

    function onError(err) {
      if (err) {
        res.statusCode = err.statusCode || 500;
        res.end(err.message);
      }
    }
  }

  return {
    handler:handler
  }
}