const express = require('express');
const app = express();
app.use(express.static('./dist'));
const cors = require('cors');
app.use(cors());
const fs = require('fs');
const https = require('https');

var privateKey = fs.readFileSync('./keys/key.pem');
var certificate = fs.readFileSync('./keys/cert.pem');


https.createServer({
    key: privateKey,
    cert: certificate
}, app).listen(3001);


app.get("/", (req, res) => {
    res.sendFile("./dist/index.html", {root: "."});
});

