'use strict';

let express = require('express');
let server = express();
const fs = require('fs');
// const cors = require('cors');

// Middleware zum Bereitstellen von statischen Dateien
server.use(express.static('public'));
server.use(express.json());
// server.use(cors());

// Auf den Port 80 horchen
server.listen(80, err => {
    if (err) console.log(err);
    else console.log('Server läuft');
})

// CPS Header senden, um Ressourcen auf http://localhost/favicon.ico zu laden
server.head('/cps', (req,res) => {
    console.log('Response: ' + res);
    console.log('Request: ' + req);
    res.set("Content-Security-Policy", "default-src http://localhost/favicon.ico");
    // res.send();
})

server.get('/plants', (req,res) => {
        if (err) console.log(err);
        else {
            fs.readFile('plants.json', (err, jsonString) => {
                if (err) console.log(err);
                else res.send(JSON.parse(jsonString))
            })
        }
})