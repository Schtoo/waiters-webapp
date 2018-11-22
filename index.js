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

app.get('/', async function (req, res) {
    let getWaiterShift = await waitersInstance.getDays();
    res.render('home', {
        getWaiterShift
    });
});

app.get('/waiters/:username', async function (req, res) {
    const username = req.params.username;
    let getAllDays = await waitersInstance.checkedDays(username);
    res.render('home', {
        username,
        getAllDays
    });
});

app.get('/reset', async function (req, res, next) {
    try {
        await waitersInstance.resetDb();
        res.render('waiterDays');
    } catch (error) {
        next(error)
    }
});

app.post('/waiters/:username', async function (req, res, next) {
    try {
        let {username} = req.params;
        username = username.charAt(0).toUpperCase() + username.slice(1).toLowerCase();
        let weekdays = [];
        if (req.body.weekdays) {
            weekdays = Array.isArray(req.body.weekdays) ? req.body.weekdays : [req.body.weekdays];
        }
       await waitersInstance.removingShifts(weekdays);
        if (weekdays === [undefined] || weekdays == '' || weekdays === []) {
            req.flash('info', `Welcome ${username} please select your shifts for the week`);
        } else {
            await waitersInstance.checkedDays(username);
            await waitersInstance.assignShift(username, weekdays);
            req.flash('info', `Thank you! Your submission is successful ${username}`);
        }
        res.redirect(`/waiters/${username}`);
    } catch (error) {
        next(error)
    }
});

app.get('/admin', async function (req, res, next) {
    try {
        let getWaiterShift = await waitersInstance.getDays();
        let waiterShifts = await waitersInstance.adminCheck();
        //console.log(waiterShifts);

        res.render('waiterDays', {
            getWaiterShift,
            waiterShifts
        });
    } catch (error) {
        next(error)
    }
});

let PORT = process.env.PORT || 3030;

app.listen(PORT, function () {
    console.log('App successfully starting on port', PORT);
});