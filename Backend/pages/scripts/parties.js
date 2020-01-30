var wrapper = document.getElementById('parties');
document.addEventListener("DOMContentLoaded", getData);
let token = window.localStorage.getItem('userToken');
console.log(token)
if (token === null) {
    window.location.replace('/firstpage.html');
}
async function getData() {
    let response = await fetch("http://localhost:5000/event/get-parties", {
        method: 'GET',
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token

        }
    })
    let result = await response.json();
    return result.message;
}
getData().then(result => {
    let copy = result;
    for (let i = 0; i < result.length; i++) {
        let latitude = result[i].latitudine;
        var longitudine = result[i].longitudine;
        let request = latitude + "%2C" + longitudine;

        getVals(request).then(resultat => {

            copy[i].street = resultat;
            var card = document.createElement('div');
            card.className = 'card';
            card.id = copy[i].id;
            var container = document.createElement('div');
            container.className = 'container';
            var pName = document.createElement('p');
            pName.innerText = 'Party : ' + copy[i].nume;
            var date = document.createElement('p');
            date.innerHTML = "Date :  " + copy[i].data;
            var location = document.createElement('p');
            location.innerHTML = "Location :  " + copy[i].street;
            var button = document.createElement('div');
            button.className = 'button_container';
            var buttonel = document.createElement('button');
            buttonel.className = 'btn';
            buttonel.onclick = function() {
                partyId = copy[i].id;
                var object = {
                    'id_petrecere': partyId
                }
                console.log(object);
                fetch('http://localhost:5000/party/join-party', {
                        method: 'POST',
                        headers: {
                            'Accept': '*/*',
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + token

                        },
                        body: JSON.stringify(object)

                    })
                    .then(resp => resp.json())
                    .then(response => {
                        console.log(response);
                        alert("Party attented! ");
                        var attented = document.getElementById(partyId);
                        attented.parentNode.removeChild(attented);
                    })
            }
            var span = document.createElement('span');
            span.innerHTML = 'Attend';
            buttonel.appendChild(span);
            button.appendChild(buttonel);
            container.appendChild(pName);
            container.appendChild(date);
            container.appendChild(location);
            card.appendChild(container);
            card.appendChild(button);
            wrapper.appendChild(card);

        })
    }
});

async function getVals(request) {

    let response = await fetch('https://api.opencagedata.com/geocode/v1/json?q=' + request + '&key=466c09a776ed417b8ace9ad07c6527d9')
    let resp = await response.json();
    return resp.results[0].formatted;
}

function logout() {
    localStorage.removeItem('userToken');
    console.log(token)
}