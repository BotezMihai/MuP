let body = document.getElementsByTagName('body');
let partyId = window.localStorage.getItem('id_party');
let token = window.localStorage.getItem('userToken');
document.addEventListener("DOMContentLoaded", function() {
    var socket = new WebSocket("ws://localhost:8085?token=" + token);

    socket.onopen = function() {
        socket.send("ns " + partyId);

    };

    socket.onmessage = function(event) {
        let message = "RESET " + partyId;

        if (event.data !== message) {
            let resp = JSON.parse(event.data);
            console.log(resp.message)
            if (resp.message === "No more songs") {
                let p = document.createElement('p');
                p.innerHTML = resp.message;
                document.body.appendChild(p)
            }
            let path = resp.message.path.split("\\");
            let audio = document.createElement("audio");
            audio.id = "song";

            let source = document.createElement('source');
            source.type = "audio/mpeg";
            source.src = "/uploads/" + path[path.length - 1];
            audio.controls = "controls";
            audio.autoplay = true;
            audio.load();
            audio.appendChild(source);
            document.body.appendChild(audio);

            audio.addEventListener('ended', function() {
                let element = document.getElementById('song');
                element.parentNode.removeChild(element);
                socket.send("ns " + partyId)

            })
        }
    }
    socket.onclose = function() {
        console.log("Connection is closing...");
    };
    socket.onerror = function() {
        console.log('Error!');
    };
})