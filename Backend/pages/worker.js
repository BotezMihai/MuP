self.addEventListener('message', (e) => {
    console.log(e.data);

    var i = 0;
    var socket = new WebSocket("ws://localhost:8081");
    socket.onopen = function () {
        socket.send(i);
        i++;

    };

    socket.onmessage = function (event) {
        console.log('Received data: ' + event.data);
        socket.send(i);
        i = i + 1;
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