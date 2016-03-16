var path = require('path')
var concat = require('concat-stream')
var hyperrequest = require('hyperrequest')
var async = require('async')

module.exports = function(body, done){
  var name = body.name
  var id = body.id
  var app = body.app
  var controller = app.controller
  var service = app.service

  async.series([

    function(next){
      // post the controller to /api/v1/namespaces/default/replicationcontrollers

      // get the id / stuff from it

      console.log('-------------------------------------------');
      console.log('-------------------------------------------');
      console.log('running controller')
      console.log(JSON.stringify(controller, null, 4))
      next()
    },

    function(next){
      // post the service to /api/v1/namespaces/default/services

      // get the nodePort / stuff from it

      console.log('-------------------------------------------');
      console.log('-------------------------------------------');
      console.log('running service')
      console.log(JSON.stringify(service, null, 4))
      next()
    },

    function(next){
      // poll the api for the pod status - block until ready

      console.log('-------------------------------------------');
      console.log('-------------------------------------------');
      console.log('polling app')
      next()
    }

  ], function(err){
    if(err) return done(err)
    done(null, {
      k8s:true
    })
  })

}