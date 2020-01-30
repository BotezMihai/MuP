var modalL = document.getElementById("loginModal");
var btnL = document.getElementById("myBtn");
var span = document.getElementsByClassName("close")[0];
btnL.onclick = function() {
  modalL.style.display = "block";
}
span.onclick = function() {
  modalL.style.display = "none";
}
window.onclick = function(event) {
  if (event.target == modalL) {
    modalL.style.display = "none";
  }
}
var modalR=document.getElementById('registerModal');
var btnR = document.getElementById("myBtnr");
var span = document.getElementsByClassName("closer")[0];
btnR.onclick = function() {
  modalR.style.display = "block";
}
span.onclick = function() {
  modalR.style.display = "none";
}
window.onclick = function(event) {
  if (event.target == modalR) {
    modalR.style.display = "none";
  }
}

var loginBtn=document.getElementById("log");
var register=document.getElementById('registration');

loginBtn.addEventListener('click',function(){
    let name=document.getElementById("username").value
    let pass=document.getElementById("password").value;
    var data={
        "email":name,
        "parola":pass
    }
    console.log(data)
    fetch("http://localhost:5000/user/login",{
        method:"POST",
        headers: {
            'Accept': 'application/json, text/plain',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        }).then((res)=>res.json())
          .then(Respjson => {
            if(Respjson.message==='OK')
            {let token=Respjson.token;
             window.localStorage.setItem('userToken',token);
             window.location.replace("http://localhost:5000/homepage.html")
            }
          })
})
let token = window.localStorage.getItem('userToken');
document.addEventListener('DOMContentLoaded',function(){
  if(token!==null)
{
  window.location.replace('/homepage.html')
}
})
register.addEventListener('click',function(){
  let formular=document.getElementById('register');
  let name=formular.nume.value;
  let prenume=formular.prenume.value;
  let email=formular.email.value;
  let parola=formular.parola.value;
  let data={
    "email":email,
    "nume":name,
    "prenume":prenume,
    "parola":parola
  }
fetch("http://localhost:5000/user/register",{
  method:"POST",
  headers: {
            'Accept': 'application/json, text/plain',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        }).then((res)=>res.json())
          .then(Respjson => {
            if (Respjson.status ==='OK'){
              modalR.style.display = "none";
              alert("The account has been created")

            }
})
})