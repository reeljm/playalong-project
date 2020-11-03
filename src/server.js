const express = require('express');
const app = express();
app.use(express.static('.'));
const cors = require('cors');
app.use(cors());

app.listen(3001, async () => {
    app.get("/", (req, res) => {
        res.sendFile("index.html", {root: "."});
    });
});
