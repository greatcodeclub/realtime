function Client() {
  if (window.WebSocket) {
    var transport = Client.WebSocket
    console.log("Using WebSocket transport")
  } else {
    var transport = Client.LongPoll
    console.log("Using long polling transport")
  }

  transport.setup.call(this)

  this.subscribe = transport.subscribe
  this.publish = transport.publish
}

Client.LongPoll = {
  setup: function() {

  },

  publish: function(data) {
    $.post("/messages", data)
  },

  subscribe: function(callback) {
    function longPoll() {
      $.getJSON("/messages", function(data) {
        callback(data)
        longPoll()
      })
    }
    longPoll()
  }
}

Client.WebSocket = {
  setup: function() {
    this.socket = new WebSocket('ws://localhost:3000/')
  },

  publish: function(data) {
    this.socket.send(JSON.stringify(data))
  },

  subscribe: function(callback) {
    this.socket.onmessage = function(event) {
      var data = JSON.parse(event.data)
      callback(data)
    }
  }
}
