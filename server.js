var express = require('express')
var bodyParser = require('body-parser')
var morgan = require('morgan')
var http = require('http')
var EventEmitter = require('events').EventEmitter

// Typical Express 4 setup
var app = express()
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan('dev'))

var messageBus = new EventEmitter()

app.post("/messages", function(req, res) {
  messageBus.emit("message", req.body)
  res.end()
})

app.get("/messages", function(req, res) {
  messageBus.once('message', function(data) {
    res.json(data)
  })
})

// Setup the server
var server = http.createServer(app)
server.listen(3000)
