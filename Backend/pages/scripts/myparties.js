function logout(){
    localStorage.removeItem('userToken');
    window.location.replace('/firstpage.html')
}
       var creation = document.getElementById('creation');
       var partiesAttend = document.getElementById('future');
       future.style.display = 'none';
       var attented = document.getElementById('petreceri');
      
  
       let token = window.localStorage.getItem('userToken');
       function Switch() {
           creation.style.display = "none";
           future.style.display = "block";
           async function getPartiesJoined() {
           let response = await fetch('/party/get-parties', {
               method: 'GET',
               headers: {
                   'Accept': '*/*',
                   'Content-Type': 'application/json',
                   'Authorization': 'Bearer ' + token
               }
           }).catch((error)=>{
               console.log(error);
           })
           let rezultat = await response.json();
           return rezultat;
       }
       getPartiesJoined().then(result => {
           let copy = result.message;
           console.log(result)
           if(result.code==="404"){
                    let spanul=document.getElementById('titluJoined');
                    spanul.innerHTML=result.message
           }
           else{
           for (let i = 0; i < result.message.length; i++) {
               let latitude = result.message[i].latitudine;
               var longitudine = result.message[i].longitudine;
               let request = latitude + "%2C" + longitudine;

               getVals(request).then(resultat => {

                   copy[i].street = resultat;
                   var card = document.createElement('div');
                   card.className = 'card';
                   card.id = copy[i].id_petrecere;
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
                   buttonel.onclick = function () {
                       partyId = copy[i].id_petrecere;
                       var object = {
                           'id_petrecere': partyId
                       }
                       console.log(object);
                       fetch('http://localhost:5000/party/delete-party/' + partyId, {
                           method: 'DELETE',
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
                               alert("Attend canceled ");
                               var element = document.getElementById(partyId);
                               element.parentNode.removeChild(element);
                           })
                   }
                   var span = document.createElement('span');
                   span.innerHTML = "Can't go";
                   buttonel.appendChild(span);
                   button.appendChild(buttonel);
                   container.appendChild(pName);
                   container.appendChild(date);
                   container.appendChild(location);
                   card.appendChild(container);
                   card.appendChild(button);
                   attented.appendChild(card);

               })
           }}
       });

       async function getVals(request) {
           let response = await fetch('https://api.opencagedata.com/geocode/v1/json?q=' + request + '&key=466c09a776ed417b8ace9ad07c6527d9')
           let resp = await response.json();
           return resp.results[0].formatted;
       }
       }

       function SwitchAdd() {
           creation.style.display = "block";
           future.style.display = "none";
       }

       var modal = document.getElementById("createPartyModal");
       var btn = document.getElementById("createParty");
       var span = document.getElementsByClassName("close")[0];
       btn.onclick = function () {
           modal.style.display = "block";
       }
       span.onclick = function () {
           modal.style.display = "none";
       }
       window.onclick = function (event) {
           if (event.target == modal) {
               modal.style.display = "none";
           }
       }

       var today = new Date().toISOString().substr(0, 10);
       document.querySelector("#date").value = today;
       if(token===null){
           window.location.replace('/firstpage.html')
       }
  
   function createPetrecere(){
       
       event.preventDefault();
       let name=document.getElementById('party-name').value;
       let zona=document.getElementById('location').value;
       let date=document.getElementById("date").value;
       let new_date=date.split('-');
       let ok_date = new_date[2]+"-"+new_date[1] + '-' + new_date[0]  ;
       console.log(ok_date)
       let hour=document.getElementById('start-hour').value;
      
       const url = "https://api.opencagedata.com/geocode/v1/json?q="+zona+"&key=466c09a776ed417b8ace9ad07c6527d9";
       let data=ok_date+" " + hour;
       console.log(data)
       fetch(url)
       .then(result=>result.json())
       .then(res=>{
           var lat=res.results[0].geometry.lat;
           var long=res.results[0].geometry.lng;
           let party={
               "latitudine":lat,
               "longitudine":long,
               "nume":name,
               "data":data

           }
           console.log(party);
           fetch("http://localhost:5000/event/add-party",{
               method:"POST",
               headers:{
                   'Accept': '*/*',
                   'Content-Type': 'application/json',
                   'Authorization': 'Bearer ' + token
               },
               body:JSON.stringify(party)
           })
           .then(response=>response.json())
           .then(resp=>{
               if(resp.message==='OK'){
                   alert("Party created succesfully!")
               }
           })
       })
   }

      var created = document.getElementById('created');
      document.addEventListener('DOMContentLoaded',getPartiesCreated);
      
       async function getPartiesCreated() {
           let response = await fetch('http://localhost:5000/event/my-parties', {
               method: 'GET',
               headers: {
                   'Accept': '*/*',
                   'Content-Type': 'application/json',
                   'Authorization': 'Bearer ' + token
               }
           }).catch((error)=>{
               console.log(error)
           })
           let rezultat = await response.json();
           return rezultat;
       }
       getPartiesCreated().then(result => {
           let copy = result.message;
           if(result.code==='404'){
               alert("You don't have any parties created!")
           }
           else{
           for (let i = 0; i < result.message.length; i++) {
               let latitude = result.message[i].latitudine;
               var longitudine = result.message[i].longitudine;
               let request = latitude + "%2C" + longitudine;

               getValori(request).then(resultat => {

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
                   var update_party=document.createElement('button');
                   update_party.className='btn';
                   var delete_party = document.createElement('button');
                   delete_party.className = 'btn';
                   
                   delete_party.onclick = function () {
                       partyId = copy[i].id;
                       var object = {
                           'id_petrecere': partyId
                       }
                       console.log(object);
                       fetch('http://localhost:5000/event/delete-party?id=' + partyId, {
                           method: 'DELETE',
                           headers: {
                               'Accept': '*/*',
                               'Content-Type': 'application/json',
                               'Authorization': 'Bearer ' + token

                           },
                           
                       })
                           .then(resp => resp.json())
                           .then(response => {
                               console.log(response);
                               alert("Party  canceled ");
                               var element = document.getElementById(partyId);
                               element.parentNode.removeChild(element);
                           })
                   }
                   var currentdate = new Date();
                   var datetime =('0' + currentdate.getDate()).slice(-2) +
                   "-"+('0' + (currentdate.getMonth() + 1)).slice(-2) + "-"
                   + currentdate.getFullYear() + " "
                   + currentdate.getHours() + ":"
                   + currentdate.getMinutes() ;
                   currentDateSplit=datetime.split(" ")[0]
                   let dataparty=copy[i].data
                   if(datetime>=dataparty){
                       console.log("Bineees")
                       update_party.style.display="block"
                   }
                   else{
                       update_party.style.display="none"
                   }
                  
                   update_party.onclick=function(){
                     
                       window.localStorage.setItem("id_party",copy[i].id)
                       window.open('http://localhost:5000/player.html');
                   }
                   var span = document.createElement('span');
                   span.innerHTML = "Delete";
                   var update_span=document.createElement('span');
                   update_span.innerHTML="Start";
                   update_party.appendChild(update_span);
                   button.appendChild(update_party);
                   delete_party.appendChild(span);
                   button.appendChild(delete_party);
                   container.appendChild(pName);
                   container.appendChild(date);
                   container.appendChild(location);
                   card.appendChild(container);
                   card.appendChild(button);
                   created.appendChild(card);

               })
           }
       }});

       async function getValori(request) {
           let response = await fetch('https://api.opencagedata.com/geocode/v1/json?q=' + request + '&key=466c09a776ed417b8ace9ad07c6527d9')
           let resp = await response.json();
           return resp.results[0].formatted;
       }