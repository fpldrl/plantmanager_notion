"use strict";

let plantDisplay, steckbrief, wasserbedarf;
const NAV_TABS = document.querySelectorAll("nav li");
let jsonData;
let clickCounter = "";

// Klick-Event auf Navtabs
NAV_TABS.forEach(function (elem) {
    elem.addEventListener("click", function (event) {
    if (clickCounter != event.target.textContent) { // ClickCounter nicht der bereits geklickte Raum ist...  
        // ... dann führe Funktion findPlant aus
        findPlant(event);
        clickCounter = event.target.textContent; // Und merke dir den geklickten Raum
    } else { // wenn dieser bereits geklickt wurde, dann führe keine Funktion aus
        return;
    }
    });
});

// Pflanzen-JSON auslesen, DOM-Teilbaum erzeugen & einhängen
let xhr = new XMLHttpRequest();
xhr.onload = function () {
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
xhr.open("GET", "plants.json");
xhr.responseType = "json";
xhr.setRequestHeader("Accept", "application/json");
xhr.send();

// findPlant erstellt einen neuen DOM-Teilbaum mit leeren Platzhaltern für Bild, Steckbrief und Wasserinfo und hängt ihn in <main> ein
function findPlant(event) {

    // Bei Klick Main leeren:
    let main = document.querySelector("main"); 
    main.innerHTML = "";

    // Neue Section mit class="columns"
    let plants = document.createElement("section");
    plants.className = "columns";
    // in main einhängen:
    main.appendChild(plants);

    // die neue Section nehmen, um später alle Platzhalter einzuhängen
    plantDisplay = document.querySelector(".columns");

    // Neues <img> als Platzhalter für die Pflanzenbilder...
    let img = document.createElement("img");
    // ... mit Dummy-Attributen...
    img.alt = "test";
    img.className = "passpic";
    img.src = "img/IMG_5036.jpg"
    // ... und alles in die Section hängen
    plantDisplay.appendChild(img);

    // Neues <div> als Platzhalter für den Steckbrief...
    let profile = document.createElement("div");
    profile.className = "profile";
    // ... in Section hängen
    plantDisplay.appendChild(profile);

    // Neues <div> als Platzhalter für die Wasserinfobox...
    let waterinfo = document.createElement("div");
    waterinfo.className = "waterinfo";
    // ... in Section hängen
    plantDisplay.appendChild(waterinfo);

    // Kreierte Elemente nehmen & speichern, damit dort die Informationen später rein gespeichert werden können
    steckbrief = document.querySelector(".profile");
    wasserbedarf = document.querySelector(".waterinfo");

    // Die Pflanzen filtern, indem Raumname in JSON & Raumname Link abgeglichen werden; zurückgeben an selectedPlant
    let selectedPlant = jsonData.plants.filter(function (element) {
        return element.room == event.target.textContent;
    });

    // wenn keine Pflanze für den Raum angelegt ist, Meldung ausgeben
    if (selectedPlant == "") {
        alert("In diesem Raum steht keine Pflanze. Bitte wähle einen anderen Raum aus.");
    } else {
        // ansonsten Platzhalter mit den selectedPlants füllen
        createDom(selectedPlant);
        showImage(selectedPlant);
        showProfile(selectedPlant);
        getClickDate(selectedPlant);
    }
}


function createDom(plants) {
    // Platzhalter für die key-value-pairs im Steckbrief füllen:
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
    steckbrief.innerHTML = "";
    steckbrief.appendChild(profileTitle);
    steckbrief.appendChild(entry1);
    steckbrief.appendChild(entry2);
    steckbrief.appendChild(entry3);
    steckbrief.appendChild(entry4);

    // Platzhalter für die key-value-pairs in der Wasserinfobox füllen:
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
    wasserbedarf.innerHTML = "";
    wasserbedarf.appendChild(text);
    wasserbedarf.appendChild(buttonContainer);

    // Bei mehr als einer Pflanze den neu kreierten DOM klonen und so oft anhängen, wie Pflanzen gefunden wurden:
    if (plants.length > 1) {
        for (let i = 1; i < plants.length; i++) {
            let row = plantDisplay.cloneNode(true);
            document.querySelector("main").appendChild(row);
        }    
    }
};

function showImage(plants) {
    // Alle img-Tags holen
    let imgBox = document.querySelectorAll(".columns .passpic");

    // und bei jedem das src-Attribut ändern:
    for (let i = 0; i < plants.length; i++) {
        // src-Pfad ohne Dummy-Bildpfad nehmen...
        let path1 = imgBox[i].src.substring(0,26);
        let path2 = plants[i].image;
        // ...und den Bildpfad der jeweiligen Pflanze aus JSON anhängen
        imgBox[i].src = path1 + path2;
    }
};

function showProfile(plants) {
    // Alle Steckbrief-Platzhalter holen
    let allProfiles = document.querySelectorAll(".profile");      
    for (let i = 0; i < plants.length; i++) {
        // und die erstellten Spans darin jeweils mit den values zu den entsprechenden keys füllen
        allProfiles[i].querySelectorAll("span")[0].textContent = plants[i].name;
        allProfiles[i].querySelectorAll("span")[1].textContent = plants[i].family;
        allProfiles[i].querySelectorAll("span")[2].textContent = plants[i].room;
        allProfiles[i].querySelectorAll("span")[3].textContent = plants[i].waterneedinterval;        
    }
};


function getClickDate(plants) {
    for (let i = 0; i < plants.length; i++) {
        // Für jede Pflanze im Webstorage gespeichertes Datum auslesen:
        let waterdatePlant = localStorage.getItem(`waterDate ${plants[i].name}`);
        
        // Dieses Datum in den span an der Stelle der Pflanze (i) schreiben:
        document.querySelectorAll(".date")[i].textContent = waterdatePlant;
    }
    // Wenn kein Datum für die Pflanze vorhanden
    if (document.querySelectorAll(".date").textContent == null) {
        console.log(plants + " im Webstorage ist für diese Pflanze kein Gießdatum eingetragen");
        // dann warte auf Buttonklick
        let button = document.querySelectorAll("button");
        button.forEach(function(btn) {
            // und führe eine Funktion aus:
            btn.addEventListener("click",function(event) {
                // bei Klick auf Button
                // erstelle heutiges Datum
                let today = new Date();
                let day = today.getDate();
                let month = today.getMonth();
                let year = today.getFullYear();
                let date = day + "." + month + "." + year;
                // finde raus, an welchem Button der Klick getätigt wurde (Indexposition)
                console.log(event.target);
                console.log(this.indexOf(event.target));
                // nehme die Pflanze an dieser Indexposition
                // und schreibe das Datum + Pflanze an Indexposition in den Webstorage
                // localStorage.setItem(`waterDate ${plants[i].name}`,date);
                // und in den span der Pflanze mit Indexposition
                // document.querySelectorAll(".date")[i].textContent = date;
            });
        });
        // für Pflanze an der Stelle des Buttons
    }
    

        
    /* console.log(plants[0].name);
    console.log(plants[1].name);
    console.log(localStorage.getItem(`waterDate ${plants[0].name}`));
    localStorage.getItem("waterDate Zierbanane");
    for (let i = 0; i < plants.length; i++) {
        console.log(localStorage.getItem("waterDate Zierbanane"));
    } */
};