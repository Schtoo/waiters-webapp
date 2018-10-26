'use strict'

const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const waiters = require('./waitersFactory');
const flash = require('express-flash');
const session = require('express-session');

const pg = require('pg');
const Pool = pg.Pool;

// should use a SSL connection
let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
    useSSL = true;
}
// which db connection to use
const connectionString = process.env.DATABASE_URL || 'postgres://coder:pg123@localhost:5432/waiter_availability';

const pool = new Pool({
    connectionString,
    ssl: useSSL
});

//creating instance of factory function
let waitersInstance = waiters(pool);

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.use(flash());

app.use(session({
    secret: "<add a secret string here>",
    resave: false,
    saveUninitialized: true
}));

app.get('/waiters/:username', async function (req, res) {
    const username = req.params.username;

    res.render('home', {
        username
    });
});

app.post('/waiters/:username', async function (req, res, next){
    try{

        let username = req.params.username; 
        let weekdays = req.body.weekdays;
       // console.log(weekdays);
        let currentWaiter = waitersInstance.getWaiter(username);
       let waiterShifts = waitersInstance.days();
        res.render('home', {
            currentWaiter,
            weekdays,
            waiterShifts
        });
    } catch (error){
        next(error)
    }
});

app.post('/town', async function (req, res) {
});

app.post('/town', async function (req, res) {
});

app.get('/reseting', async function (req, res) {
});

let PORT = process.env.PORT || 3030;

app.listen(PORT, function () {
    console.log('App successfully starting on port', PORT);
});
