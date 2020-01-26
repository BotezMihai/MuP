var loginBtn=document.getElementById("log");
var form =document.getElementsByClassName("login-form");
function handler(event){
    event.preventDefault();
    var data={
        "username":form.username.value,
        "password":form.password.value
    }
    console.log(data)
    fetch("/user/login",{
        method:"POST",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        }).then(res=>res.json())
          .then(res => console.log(res));
    
}
loginBtn.addEventListener("click",handler);



