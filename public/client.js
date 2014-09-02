function Client() {

}

Client.prototype.publish = function(data) {
  $.post("/messages", data)
}

Client.prototype.subscribe = function(callback) {
  function longPoll() {
    $.getJSON("/messages", function(data) {
      callback(data)
      longPoll()
    })
  }
  longPoll()
}
