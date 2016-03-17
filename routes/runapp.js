var path = require('path')
var concat = require('concat-stream')
var request = require('hyperrequest')
var async = require('async')

module.exports = function(body, done){
  var name = body.name
  var id = body.id
  var app = body.app
  var controller = app.controller
  var service = app.service
  var appid = (name + '-' + id).replace(/\W/g, '').toLowerCase().substr(0,24)

  var controllerData, serviceData

  async.series([

    function(next){
      // post the controller to /api/v1/namespaces/default/replicationcontrollers

      // get the id / stuff from it

      console.log('-------------------------------------------');
      console.log('-------------------------------------------');
      console.log('running controller')

      controller.metadata.name = appid
      controller.metadata.labels.name = appid
      controller.spec.selector.app = appid
      controller.spec.template.metadata.name = appid
      controller.spec.template.metadata.labels.app = appid

      console.log(JSON.stringify(controller, null, 4))
      request({
        url: "https://" + process.env.KUBERNETES_SERVICE_HOST + ":443/api/v1/namespaces/default/replicationcontrollers",
        method: "POST",
        headers:{
          'Content-type':'application/json'
        },
        body:JSON.stringify(controller)
      }, function(err, resp){

        if(err) return next(err.toString())

        controllerData = resp.body
        next()
      })

    },

    function(next){
      // post the service to /api/v1/namespaces/default/services

      // get the nodePort / stuff from it

      console.log('-------------------------------------------');
      console.log('-------------------------------------------');
      console.log('running service')

      service.metadata.name = appid
      service.metadata.labels.app = appid
      service.spec.selector.app = appid
      service.spec.Type = 'NodePort'

      request({
        url: "https://" + process.env.KUBERNETES_SERVICE_HOST + ":443/api/v1/namespaces/default/services",
        method: "POST",
        headers:{
          'Content-type':'application/json'
        },
        body:JSON.stringify(service)
      }, function(err, resp){

        if(err) return next(err.toString())

        serviceData = resp.body
        next()
      })

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
      id:appid,
      data:{
        controller:controllerData,
        service:serviceData
      }
    })
  })

}