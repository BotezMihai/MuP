localStorage.removeItem("id_party");
let token = window.localStorage.getItem('userToken');
if(token===null){
   window.location.replace('/firstpage.html');
}
function logout(){ 
     localStorage.removeItem('userToken');
     window.location.replace('/firstpage.html')
 }        
var currentParty=document.getElementById('petrecereNow');
currentParty.style.display="none";
document.addEventListener('DOMContentLoaded',function(){
function getLocation() {
if (navigator.geolocation) {
navigator.geolocation.getCurrentPosition(showPosition);} 
else {console.log("No navigator")}
}

function showPosition(position) {
  let latitude=position.coords.latitude ;
  let longitude=position.coords.longitude;
  console.log(latitude)
  console.log(longitude);
  fetch("http://localhost:5000/upload/timeLocation/"+latitude+"/"+longitude,{
    method:'GET',
    headers:{
      'Accept': '*/*',
      'Content-Type': 'application/json',
      'Authorization':'Bearer '+token
    }
  })
  .then(response=>response.json())
  .then(resp=>{
    if (resp.status==='OK'){
      let titlu=document.getElementById('titlu');
      titlu.innerHTML="Welcome to the party: "+resp.name_party;
      window.localStorage.setItem('id_party',resp.id_party)
      currentParty.style.display="flex";
    }
    else{
      alert(resp.message);
    }
  })
}
getLocation();
let submit= document.getElementById('uploadForm');
submit.addEventListener('submit',function(){
        event.preventDefault();
        var file = document.getElementById('myFileInput').files[0];
        let formData=new FormData();
        formData.append('melodie',file);
        let id_party=window.localStorage.getItem('id_party')
        formData.append('id_petrecere',id_party);        
        fetch("http://localhost:5000/upload/song",{
          method:"POST",
          headers:{
            'Accept': '*/*',
            'Authorization':'Bearer '+token
          },
          body:formData
        })
        .then(resp=>resp.json())
        .then(resp=>{
          alert("Uploaded succesully!")
        })
      })
let style=document.getElementById('stiluri');
style.addEventListener('submit',function(){
  event.preventDefault();
  var array = []
  var checkboxes = document.querySelectorAll('input[type=checkbox]:checked')
  for (var i = 0; i < checkboxes.length; i++) {
      array.push(checkboxes[i].value)
}
  let id_petrecere=window.localStorage.getItem('id_party')
  let stiluri={
    "style": array,
    "user_party":id_petrecere
  }
  fetch("http://localhost:5000/upload/style",{
    method:"POST",
    headers:{
      'Accept': '*/*',
      'Content-Type': 'application/json',
      'Authorization':'Bearer '+token
    },
    body:JSON.stringify(stiluri)
    })
  .then(resp=>resp.json())
  .then(res=>{
      alert("Styles updated!")
  })
  })
  })
document.addEventListener('DOMContentLoaded',function(){
window.addEventListener("compassneedscalibration", function (event) {
            alert('Your compass needs calibrating! Wave your device in a figure-eight motion');
            event.preventDefault();
        }, true);
let gyroscope = new Gyroscope({ frequency: 1 })
var socket = new WebSocket("ws://localhost:8085?token="+token);   
socket.onmessage= function (msg) {
  setTimeout(()=>{
  let id_party=window.localStorage.getItem('id_party')
  let match="RESET "+ id_party
        
        if(msg.data===match){
          total=0
        }
},1000)
  }
let total=0
 gyroscope.addEventListener('reading', e => {
          
            if (gyroscope.x >= 0.60 || gyroscope.y >= 0.60 || gyroscope.z >= 0.60 || gyroscope.x <= -0.60 || gyroscope.y <= -0.60 || gyroscope.z <= -0.60) {
                total += 1;      
                console.log("Angular velocity along the X-axis " + gyroscope.x);
                console.log("Angular velocity along the Y-axis " + gyroscope.y);
                console.log("Angular velocity along the Z-axis " + gyroscope.z);
              }
        });
    
gyroscope.start();
socket.onopen = function () {
  setInterval(() => {   
        let id_party=window.localStorage.getItem('id_party');
        if(id_party!==null){
            socket.send("ad "+id_party+","+total);
         }
        }, 7000);
    };
socket.onclose = function () {
      socket.close();
    };
socket.onerror = function () {
        console.log('Error!');
    };
  })