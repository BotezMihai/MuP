function openNav() {
  var w = window.innerWidth;
  if(w<450){
      document.getElementById("mySidenav").style.width="100%";
  }
  else{
      document.getElementById("mySidenav").style.width="350px";
  }}
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}