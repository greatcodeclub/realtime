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

// Create a message bus to which we publish messages.
var messageBus = new EventEmitter()

// Long polling route
app.get('/messages', function(req, res) {
  messageBus.once('message', function (message) {
    res.json(message)
  })
})

// Sending a message bus
app.post('/messages', function(req, res) {
  messageBus.emit('message', req.body)
  res.end()
})

// Setup the server
var server = http.createServer(app)
server.listen(3000)

// Setup a WebSocket server
var WebSocketServer = require('ws').Server
var wss = new WebSocketServer({ server: server })

wss.on('connection', function(ws) {
  var callback = function(message) {
    ws.send(message)
  }

  messageBus.on('message', callback)
  
  ws.on('close', function () {
    messageBus.removeListener('message', callback)
  })

  ws.on('message', function(message) {
    messageBus.emit('message', message)
  })
})
