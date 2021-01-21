"use strict";
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
    let selectedPlant = jsonData.plants.find(function(element) {
        return element.room == event.target.textContent; 
    });
    if (selectedPlant !== undefined) {
        showImage(selectedPlant);
        showProfile(selectedPlant);
        calculateWaterneed(selectedPlant);
    } else {
        alert("Es konnte keine Pflanze gefunden werden");
    }
}

// ausgelagerte Funktionen 
function showImage(plant) {
    // plant ist object
        
    };

    // element.setAttribute('src',stringImgPath); 





// Button-Ereignis registrieren & berechnen
// Tag x + Wasser-Intervall --> aus JSON auslesen

