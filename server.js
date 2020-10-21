const express = require('express');
const app = express();
const cors = require('cors');
var bodyParser = require('body-parser')
app.use(cors());

app.listen(3000, async () => {
    res.sendfile("index.html", {root: "."});
});
