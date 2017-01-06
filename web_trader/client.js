var zmq = require("zmq");  
var socket = zmq.socket("pull");

// Just a helper function for logging to the console with a timestamp.
function logToConsole (message) {  
    console.log("[" + new Date().toLocaleTimeString() + "] " + message);
}

// Add a callback for the event that is invoked when we receive a message.
socket.on("message", function (message) {  
    // Convert the message into a string and log to the console.
    logToConsole("Received message: " + message.toString("utf8"));
});

// Connect to the server instance.
socket.connect('tcp://10.100.1.119:11102');  
