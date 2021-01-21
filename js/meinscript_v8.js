"use strict";
if (!("remove" in Element.prototype)) {
    Element.prototype.remove = function () {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
    };
}

let plantDisplay = document.querySelector(".columns");
let steckbrief = document.querySelector(".profile");
let wasserbedarf = document.querySelector(".waterinfo");
const NAV_TABS = document.querySelectorAll("nav li");
let jsonData;

// Klick-Event auf Navtabs
NAV_TABS.forEach(function(elem) {
    elem.addEventListener("click",function() {
        let clickCounter = 0;
        clickCounter += 1;
        console.log(clickCounter);
        if (clickCounter > 1) return;
        findPlant(event);
    });
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
            getClickDate(selectedPlant);
        } else {
            alert("Es konnte keine Pflanze gefunden werden");
        }
}

// ausgelagerte Funktionen

function createDom(plants) {
    // Steckbrief erstellen
    let profileTitle = document.createElement("h2");
    profileTitle.textContent = "Steckbrief";
    let entry1 = document.createElement("p");
    let entry2 = document.createElement("p");
    let entry3 = document.createElement("p");
    let entry4 = document.createElement("p");
    let entryTitle1 = document.createElement("h3");
    entryTitle1.textContent = "Name: ";
    let entryTitle2 = document.createElement("h3");
    entryTitle2.textContent = "Pflanzenfamilie: ";
    let entryTitle3 = document.createElement("h3");
    entryTitle3.textContent = "Raum: ";
    let entryTitle4 = document.createElement("h3");
    entryTitle4.textContent = "Wasserbedarf (Intervall): ";
    let span1 = document.createElement("span");
    let span2 = document.createElement("span");
    let span3 = document.createElement("span");
    let span4 = document.createElement("span");
    entry1.appendChild(entryTitle1).appendChild(span1);
    entry2.appendChild(entryTitle2).appendChild(span2);
    entry3.appendChild(entryTitle3).appendChild(span3);
    entry4.appendChild(entryTitle4).appendChild(span4);
    steckbrief.appendChild(profileTitle);
    steckbrief.appendChild(entry1);
    steckbrief.appendChild(entry2);
    steckbrief.appendChild(entry3);
    steckbrief.appendChild(entry4);

    // Wasserkasten erstellen
    let text = document.createElement("p");
    let speech1 = document.createElement("span");
    let speech2 = document.createElement("span");
    let speech3 = document.createElement("span");
    speech1.textContent = "\"Ich wurde das letzte mal am ";
    speech2.classList.add("date");
    speech3.textContent = " gegossen\"";
    text.appendChild(speech1);
    text.appendChild(speech2);
    text.appendChild(speech3);
    let buttonContainer = document.createElement("div");
    let button = document.createElement("button");
    button.textContent = "Jetzt gießen!";
    buttonContainer.appendChild(button);
    wasserbedarf.appendChild(text);
    wasserbedarf.appendChild(buttonContainer);

    // Bei mehr als einer Pflanze den neu kreierten DOM klonen und anhängen:
    if (plants.length > 1) {
        for (let i = 1; i < plants.length; i++) {
            let row = plantDisplay.cloneNode(true);
            document.querySelector("main").appendChild(row);
        }    
    }
};



function showImage(plants) {
    let imgBox = document.querySelectorAll(".columns .passpic"); // Alle img-Tags in NodeList
    //// Pfade im img-Tag für jede Pflanze austauschen ////
    let imgPathJson = [];
    for (let i = 0; i < plants.length; i++) {
        // Pfade extrahieren:
        imgPathJson[i] = plants[i].image;
        // für jeden Platzhalter den Pfad-String in Array splitten:
        let imgArray = imgBox[i].src.split("\/");
        // console.log(imgArray);
        // Neues Array mit allen Pfadfragmenten außer dem letzten (das letzte Element (alter Pfad) soll ersetzt werden):
        let newImgArray = [];
        imgArray.forEach((imgArrEl,ix) => {
            if (ix !== imgArray.length -1) {
                newImgArray.push(imgArrEl);
            }
        });
        newImgArray.push(imgPathJson);
        console.log(newImgArray);
         // und die extrahierten Pfad-Strings in den Array an letzte Position pushen kann:
        let imgString = newImgArray.join("\/");
        
        console.log(imgString);
        imgBox.forEach((imgBoxEl) => {
            imgBox[i].src = imgPathJason[i];
        }) // WIESO WIRD DAS ERSTE BILD ÜBERSCHRIEBEN?        
    }
    console.log(imgPathJson);
};

function showProfile(plants) {
    // console.log(plants);
    let allProfiles = document.querySelectorAll(".profile");      
    for (let i = 0; i < plants.length; i++) {
        allProfiles[i].querySelectorAll("span")[0].textContent = plants[i].name;
        allProfiles[i].querySelectorAll("span")[1].textContent = plants[i].family;
        allProfiles[i].querySelectorAll("span")[2].textContent = plants[i].room;
        allProfiles[i].querySelectorAll("span")[3].textContent = plants[i].waterneedinterval;        
    }
};
function getClickDate() { // TBD!
    let waterneed = document.querySelectorAll(".waterinfo .date");
    let waterbutton = document.querySelectorAll(".waterinfo button");
    let waterInfo = localStorage.getItem("waterDate");
    if (waterInfo !== null) {
        document.querySelector(".date").textContent = waterInfo;
    }
    // console.log(waterneed); // Pro Pflanze NodeList mit den Spans Wasserinfobox
    waterbutton.forEach(function(elem) {
        elem.addEventListener("click",function() {
            let today = new Date();
            let day = today.getDate();
            let month = today.getMonth();
            let year = today.getFullYear();
            let date = day + "." + month + "." + year;
            // console.log(event.currentTarget.parentNode);
            event.currentTarget.parentNode.parentNode.querySelector(".date").textContent = date;
            if(typeof(Storage) !== 'undefined') {
                localStorage.setItem("waterDate",date);
              }
        });
    });
    
}




// Button-Ereignis registrieren & berechnen
// Tag x + Wasser-Intervall --> aus JSON auslesen

