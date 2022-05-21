const express = require('express');
const path = require('path');
const mysql = require('./dbcon.js'); // mysql object
const bodyParser = require('body-parser');
//const calendar = require('./calendar.js');  // get the calendar functions

const app = new express();

// set the view engine to ejs
app.set('view engine', 'ejs');

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// use res.render to load up an ejs view file

// weekly view
app.get('/:year/:month/:day', async (req, res) => {

    var year = Number(req.params.year);
    var month = Number(req.params.month);
    var day = Number(req.params.day);

    console.log(day);

    day += 1;
    console.log(day);

    var rows = await mysql.conn.query("select * from events;");

    // retrieve start date
    // send to view object with all events for a given week

    week = {
        6: [],
        7: [],
        8: [],
        9: [],
        10: []
    };
    
    rows.forEach(row => {
        if(!(row.start_republic_day in week))
        {
            week[row.start_republic_day] = [];
        }
        week[row.start_republic_day].push(row);
    });

    //console.log(week);

    res.render('pages/index', {
        events : week
    });
});

// index page
app.get('/', async (req, res) => {
    // test out rendering the page
    var year = 230;
    var month = 9;
    var day = 1;
    res.redirect('/' + 230 + '/' + month + '/' + day);
});

// POST /add-event gets urlencoded bodies
app.post('/add-event', urlencodedParser, async (req, res) => {
    console.log(req.body.starthour);

    // get all start values for event
    var startday = req.body.startday;
    var startmonth = req.body.startmonth;
    var startyear = req.body.startyear;

    var starthour = req.body.starthour;
    var startminute = req.body.startminute;

    // get all end values for event
    var endday = req.body.endday;
    var endmonth = req.body.endmonth;
    var endyear = req.body.endyear;

    var endhour = req.body.endhour;
    var endminute = req.body.endminute;

    var title = req.body.eventname;
    var description = req.body.description;

    let insertStmt = 'insert into events (`title`, `start_republic_year`, `start_republic_month`, `start_republic_day`, `start_republic_hour`, ';
    insertStmt += '`start_republic_minute`, `end_republic_year`, `end_republic_month`, `end_republic_day`, `end_republic_hour`, `end_republic_minute`, `description`) ';
    insertStmt += 'values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'

    let result = await mysql.conn.query(insertStmt, [title, startyear, startmonth, startday, starthour, startminute, endyear, endmonth, endday, endhour, endminute, description]);

    res.redirect('/');
});

app.listen(4000, () => {
    console.log('app listening on port 3000');
});