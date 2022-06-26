const ONDC = require('../ondc-node/dist/index');
const express = require("express");

const app = express();
app.use(express.json());

app.use(ONDC.default.Middleware({"on_search": (req, res) => {
    console.log("Received search results");
    res.status(200).json({});
}}));

app.listen(9000, (err) => {
    if(!err){
        console.log("listening on 9988");
    }
})