var path = require('path')
var concat = require('concat-stream')

module.exports = function(config){
  var config = require(path.join(__dirname, '..', 'package.json'))
  return function(req, res, opts, cb){
    res.setHeader('content-type', 'application/json')
    req.pipe(concat(function(body){
      body = JSON.parse(body.toString())

      res.statusCode = 200
      res.end({
        k8s:true,
        running:true
      })
    }))
  }
}