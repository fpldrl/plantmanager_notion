"use strict";
let plantDisplay = document.querySelector(".columns");
let steckbrief = document.querySelector(".profile");
let wasserbedarf = document.querySelector(".waterinfo");
const NAV_TABS = document.querySelectorAll("nav li");
let jsonData;

// Klick-Event auf Navtabs
NAV_TABS.forEach(function(elem) {
    elem.addEventListener("click",findPlant);
});

// Pflanzen-JSON auslesen, DOM-Teilbaum erzeugen & einhängen
let xhr = new XMLHttpRequest();
xhr.onload = function() {
    if (xhr.status !== 200) {
        alert("Ein Datenbankfehler ist aufgetreten. Bitte versuche es später noch einmal");
        return;
    }
    if (xhr.responseType == "json") {
        jsonData = xhr.response;
    } else {
        jsonData = JSON.parse(xhr.responseText);
    }
};
xhr.open("GET","plants.json")    ;
xhr.responseType = "json";
xhr.setRequestHeader("Accept","application/json");
xhr.send();

function findPlant(event) {
    let selectedPlant = jsonData.plants.filter(function(element) {
        return element.room == event.target.textContent; 
    });
    if (selectedPlant !== undefined) {
        createDom(selectedPlant);
        showImage(selectedPlant);
        showProfile(selectedPlant);
        calculateWaterneed(selectedPlant);
    } else {
        alert("Es konnte keine Pflanze gefunden werden");
    }
}

// ausgelagerte Funktionen 
function createDom(plants) {
    if (plants.length > 1) {
        for (let i = 1; i < plants.length; i++) {
            let row = plantDisplay.cloneNode(true);
            document.querySelector("main").appendChild(row);
        }    
    }
};
function showImage(plants) {
    console.log(plants); // zeigt Array mit gefundenen Pflanzen
    console.log(plants[0].image); // zeigt String mit Pfad des ersten Fundes
    plants.forEach(function() {
        let path = plants.image;
        document.querySelectorAll(".columns img").setAttribute("src",path)
    })   
};



    // element.setAttribute('src',stringImgPath); 





// Button-Ereignis registrieren & berechnen
// Tag x + Wasser-Intervall --> aus JSON auslesen

