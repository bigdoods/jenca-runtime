var path = require('path')
var concat = require('concat-stream')
var hyperrequest = require('hyperrequest')
var async = require('async')
var runapp = require('./runapp')

module.exports = function(config){
  var config = require(path.join(__dirname, '..', 'package.json'))
  return function(req, res, opts, cb){
    
    req.pipe(concat(function(body){
      body = JSON.parse(body.toString())

      runapp(body, function(err, data){
        if(err){
          res.statusCode = 500
          res.end(err)
          return
        }
        res.setHeader('content-type', 'application/json')
        res.end(JSON.stringify(data))
      })
      
    }))
  }
}