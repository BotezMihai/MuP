self.addEventListener('message', (e) => {
    console.log(e.data);

    var i = 0;
    var socket = new WebSocket("ws://localhost:8081?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImdpZ2VsQHlhaG9vLnJvIiwidXNlcklEIjoxLCJpYXQiOjE1NzgwNjg0NjksImV4cCI6MTU3ODEwNDQ2OX0.lk38WFIvWh2F3hmX51xJTWEwB1D-PZkXudGoZcpDpb0");
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