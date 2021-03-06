// setting up express
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

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

app.use("/api/auth/signin", authLimiter);
app.use("/api/household/member", authLimiter);


// setting up api routes
const authApiRoute = require("./routes/api/auth.js");
app.use(authApiRoute);

const expenseApiRoute = require("./routes/api/expense.js");
app.use(expenseApiRoute);

const summaryApiRoute = require("./routes/api/summary.js");
app.use(summaryApiRoute);

const userApiRoute = require("./routes/api/user.js");
app.use(userApiRoute);

const householdApiRoute = require("./routes/api/household.js");
app.use(householdApiRoute);


// setting up website routes
const authControllerRoute = require("./routes/controller/auth.js");
app.use(authControllerRoute);

const dashboardControllerRoute = require("./routes/controller/dashboard.js");
app.use(dashboardControllerRoute);

const expenseControllerRoute = require("./routes/controller/expenses.js");
app.use(expenseControllerRoute);

const summaryControllerRoute = require("./routes/controller/summaries.js");
app.use(summaryControllerRoute);

const householdControllerRoute = require("./routes/controller/household.js");
app.use(householdControllerRoute);

// setting up service
const summaryService = require("./routes/service/summaryMaker.js");
app.use(summaryService.router);


const webchatApiRoute = require("./routes/api/webchat.js");
app.use(webchatApiRoute);


const chatService = require("./routes/service/chatService.js");
chatService.run(io);


// const reference to method CronJob in package cron
const CronJob = require("cron").CronJob;

// create summaries at 00:05 on the 20th every month
const job = new CronJob('5 0 20 * *', function() {
    summaryService.createSummaries();
});
job.start();


// making sandwich files to use to SSR
const fs = require("fs");

const navbarView = fs.readFileSync("./public/navbar/navbar_default.html", "utf8");
const footerView = fs.readFileSync("./public/footer/footer_default.html", "utf8");

const homeView = fs.readFileSync("./public/frontpage/frontpage.html", "utf8");


// setting up routes
app.get("/", (req, res) => {
    return res.send(navbarView + homeView + footerView);
});


// setting up the port and start to listen
const port = process.env.PORT ? process.env.PORT : 3000;

server.listen(port, (error) => {
    if (error)
    {
        console.log("Not running: " + error);
        return;
    }
    console.log("This server is running on port", port);
});

