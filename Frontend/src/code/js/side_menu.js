function myFunction() {
    var menu = document.getElementById("mySidenav");
    var unu = document.getElementsByClassName("unu")[0];
    var doi = document.getElementsByClassName("doi")[0];
    var trei = document.getElementsByClassName("trei")[0];
    if (menu.style.width === "80%") {
        menu.style.width = "0%";
        unu.style.transform = "none";
        doi.style.transform = "none";
        trei.style.transform = "none";
    } else {
        menu.style.width = "80%";
        menu.style.transition = "all 0.5s ease";
        unu.style.transform = "rotate(45deg) translate(-2px, -1px)";
        doi.style.transform = "rotate(0deg) scale(0, 0)";
        trei.style.transform = "rotate(-45deg) translate(0, -1px)";
    }
}

function myFunction1() {
    var menu = document.getElementById("mySidenav");
    var unu = document.getElementsByClassName("unu")[1];
    var doi = document.getElementsByClassName("doi")[1];
    var trei = document.getElementsByClassName("trei")[1];
    if (menu.style.width === "80%") {
        menu.style.width = "0%";
        unu.style.transform = "none";
        doi.style.transform = "none";
        trei.style.transform = "none";
    } else {
        menu.style.width = "80%";
        menu.style.transition = "all 0.5s ease";
        unu.style.transform = "rotate(45deg) translate(-2px, -1px)";
        doi.style.transform = "rotate(0deg) scale(0, 0)";
        trei.style.transform = "rotate(-45deg) translate(0, -1px)";
    }
}