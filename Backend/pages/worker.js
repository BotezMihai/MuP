self.addEventListener('message', (e) => {
    console.log(e.data);

    var i = 0;
    var socket = new WebSocket("ws://localhost:8081?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImdpZ2VsQHlhaG9vLnJvIiwidXNlcklEIjoxLCJpYXQiOjE1Nzc3MTYyNjksImV4cCI6MTU3Nzc1MjI2OX0.viaSeXu1pPpuX8nXtn7yzN4vqOAbimjrH2xXkyueaXk");
    socket.onopen = function () {
        setInterval(() => {
            socket.send("3,11,100");
         
        }, 5000);

    };

    socket.onmessage = function (event) {
        console.log('Received data: ' + event.data);
        // socket.close();
    };
    socket.onclose = function () {
        console.log('Lost connection!');

    };
    socket.onerror = function () {
        console.log('Error!');
    };

    // socket.send('hello, world!');


})