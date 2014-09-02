var express = require('express')
var bodyParser = require('body-parser')
var morgan = require('morgan')
var http = require('http')

// Typical Express 4 setup
var app = express()
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan('dev'))

// Setup the server
var server = http.createServer(app)
server.listen(3000)
