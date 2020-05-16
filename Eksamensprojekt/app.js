// setting up express
const express = require("express");
const app = express();

// setting up parsing of json and form-data
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// setting up static folders for js and css
app.use(express.static('public'));


// setting up the ORM
const { Model } = require("objection");

// the library Knex
const Knex = require("knex");

// the config file for the connection
const knexfile = require("./knexfile.js");

// the connection knex, based on the config file
const knex = Knex(knexfile.development);

// connecting the models to the db
Model.knex(knex);


const fs = require("fs");

const navbar = fs.readFileSync("./public/navbar/navbar.html", "utf8");
const footer = fs.readFileSync("./public/footer/footer.html", "utf8");

const frontpage = fs.readFileSync("./public/frontpage/frontpage.html", "utf8");

app.get("/", (req, res) => {
    return res.sendFile(__dirname + "/public/frontpage/frontpage.html");
   //return res.send(navbar + frontpage + footer);
});

app.get("/ny", (req, res) => {
    return res.send({response: "noget"});
});


// setting up the port and start to listen
const port = process.env.PORT ? process.env.PORT : 3000;

const server = app.listen(port, (error) => {
    if (error)
    {
        console.log("Not running: " + error);
    }
    else {
        console.log("This server is running on port", server.address().port);
    }
});

