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

var WebSocketServer = require('ws').Server
var wss = new WebSocketServer({ server: server })

wss.on('connection', function(ws) {
  ws.on('message', function(data) {
    messageBus.emit('message', data)
  })

  var callback = function(data) {
    ws.send(data)
  }
  messageBus.on('message', callback)

  ws.on('close', function() {
    messageBus.removeListener('message', callback)
  })
})
