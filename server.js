const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.static("public"));

app.get("/shelters", (req, res) => {
    fs.readFile("shelters.json", "utf8", (err, data) => {
        if (err) {
            res.status(500).send("Error reading shelters data");
        } else {
            res.json(JSON.parse(data));
        }
    });
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});