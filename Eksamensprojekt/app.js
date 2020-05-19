// setting up express
const express = require("express");
const app = express();

// setting up parsing of json and form-data
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// setting up static folders for js and css
app.use(express.static('public'));


// setting up the ORM and Knex for migration
const { Model } = require("objection");
const Knex = require("knex");

// setting up the connection based on a config file
const knexfile = require("./knexfile.js");
const knex = Knex(knexfile.development);

// connecting the models to the db
Model.knex(knex);

// setting up session
const session = require("express-session");
const config = require("./config/config.json");

app.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true,
}));


// setting up rate limit for security
const rateLimit = require("express-rate-limit");

// a general limiter
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

app.use(generalLimiter);

// a auth limiter used for auth routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 4
});

/* TODO: set the correct routes for the auth limiter!
app.use("/", authLimiter);
app.use("/", authLimiter);
*/

// setting up middleware
/*app.use((req, res, next) => {
    //TODO: write middleware, maybe move based on the other routes!
    next();
});*/


// setting up routers
const authRoutes = require("./routes/api/auth.js");
app.use(authRoutes);

const expenseRoutes = require("./routes/api/expense.js");
app.use(expenseRoutes);

const summaryRoutes = require("./routes/api/summary.js");
app.use(summaryRoutes);

const userRoutes = require("./routes/api/user.js");
app.use(userRoutes);


// making sandwich files to use to SSR
const fs = require("fs");

const navbar = fs.readFileSync("./public/navbar/navbar.html", "utf8");
const footer = fs.readFileSync("./public/footer/footer.html", "utf8");

const summary = fs.readFileSync("./public/summary/summary.html", "utf8");

// setting up routes
app.get("/", (req, res) => {
    return res.sendFile(__dirname + "/public/frontpage/frontpage.html");
});

app.get("/ny/1", (req, res) => {
    return res.send(navbar + summary + footer);
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

