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
    console.log(plants); // zeigt Pflanzen-Objekte
    let imgBox = document.querySelectorAll(".columns .passpic"); // img-Tags in NodeList
    //// Pfade im img-Tag für jede Pflanze austauschen ////
    for (let i = 0; i < plants.length; i++) {
        // Pfade extrahieren:
        let imgPathJson = plants[i].image;
        console.log(imgPathJson); // Warum nur ein Pfad??
        // für jeden Platzhalter den Pfad-String in Array splitten:
        let imgArray = imgBox[i].src.split("\/");
        console.log(imgArray); // Warum nur ein Array??
        // Neues Array mit allen Pfadfragmenten außer dem letzten (das letzte Element (alter Pfad) soll ersetzt werden):
        let newImgArray = [];
        imgArray.forEach((imgArrEl,ix) => {
            if (ix !== imgArray.length -1) {
                newImgArray.push(imgArrEl);
                console.log(newImgArray);
            }
        });
        console.log(newImgArray);
         // und die extrahierten Pfad-Strings in den Array an letzte Position pushen kann:
        newImgArray.push(imgPathJson[i]);
        let imgString = newImgArray[i].join("\/");
        console.log(imgString);
        imgBox.src
    }
};
function showProfile(plants) {
    let profileBox = document.querySelectorAll(".profile"); // div-Profil-Tags in NodeList
    for (let a = 0; a < plants.length; a++) {
        
    }
}



    // element.setAttribute('src',stringImgPath); 





// Button-Ereignis registrieren & berechnen
// Tag x + Wasser-Intervall --> aus JSON auslesen

