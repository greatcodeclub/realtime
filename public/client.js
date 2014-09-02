function Client() {
  var transport

  if (window.WebSocket) {
    transport = Client.WebSocket
  } else {
    transport = Client.LongPoll
  }

  this.subscribe = transport.subscribe
  this.send = transport.send
}


Client.LongPoll = {
  subscribe: function(callback) {
    function longPoll() {
      $.getJSON('/messages', function(data) {
        callback(data)
        longPoll()
      })
    }
    longPoll()
  },

  send: function(data) {
    $.post("/messages", data)
  }
}

Client.WebSocket = {
  subscribe: function(callback) {
    this.socket = new WebSocket('ws://' + location.host)

    this.socket.onmessage = function(event) {
      var data = JSON.parse(event.data)
      callback(data)
    }
  },

  send: function(data) {
    this.socket.send(JSON.stringify(data))
  }
}
