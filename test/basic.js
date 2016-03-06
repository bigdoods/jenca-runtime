var tape = require("tape")
var async = require("async")
var Router = require("../router")
var path = require("path")
var http = require("http")
var from2 = require("from2-string")
var hyperquest = require("hyperquest")
var hyperrequest = require("hyperrequest")
var concat = require("concat-stream")

var testing_port = 8060


/*

  boot a test server for each test so the state from one
  does not affect another test

*/
function createServer(done){

  var router = Router()

  var server = http.createServer(router.handler)
  server.listen(testing_port, function(err){
    done(err, server)
  })
}

/*
  Test that the version of the module returns the correct string
*/
tape("GET /v1/version", function (t) {

  var config = require(path.join(__dirname, '..', "package.json"))
  var server;

  async.series([

    // create the server
    function(next){
      createServer(function(err, s){
        if(err) return next(err)
        server = s
        next()
      })
    },

    // read the version from the API
    function(next){
      var req = hyperquest("http://127.0.0.1:"+testing_port+"/v1/version", {
        method:"GET"
      })

      var destStream = concat(function(result){

        t.equal(result.toString(), config.version.toString(), "the version is correct")

        next()
      })

      req.pipe(destStream)

      req.on("response", function(res){
        t.equal(res.statusCode, 200, "The status code == 200")
      })

      req.on("error", function(err){
        next(err.toString())
      })
    },
  ], function(err){
    if(err){
      t.error(err)
      server.close()
      t.end()
      return
    }
    server.close()
    t.end()
  })

})

