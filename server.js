const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());

app.listen(3001, async () => {

    app.use(express.static('.'));

    app.get("/", (req, res) => {
        res.sendFile("index.html", {root: "."});
    });
});
