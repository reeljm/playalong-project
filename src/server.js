const express = require('express');
const app = express();
app.use(express.static('./dist'));
const cors = require('cors');
app.use(cors());

app.listen(3001, async () => {
    app.get("/", (req, res) => {
        res.sendFile("./dist/index.html", {root: "."});
    });
});

