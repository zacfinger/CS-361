const express = require('express');
const path = require('path');
const mysql = require('./dbcon.js'); // mysql object
const bodyParser = require('body-parser');
//const calendar = require('./calendar.js');  // get the calendar functions
const fs = require('fs');

const app = new express();

// set the view engine to ejs
app.set('view engine', 'ejs');
app.set('port', 4000);

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

const month_enum = 
{
    1: "Vendémiaire",
    2: "Brumaire",
    3: "Frimaire",
    4: "Nivôse",
    5: "Pluviôse",
    6: "Ventôse",
    7: "Germinal",
    8: "Floréal",
    9: "Prairial",
    10: "Messidor",
    11: "Thermidor",
    12: "Fructidor",
    13: "Sansculottides"
}

// use res.render to load up an ejs view file

// weekly view
app.get('/:year/:month/:day', async (req, res) => {

    // retrieve start date
    let year = Number(req.params.year);
    let month = Number(req.params.month);
    let day = Number(req.params.day);
    let month_name = month_enum[month];

    let isLeapYear = (year % 4 == 0 && month == 13) ? 1 : 0;

    // Build the weekly view
    // day represents in (Republican, not Gregorian) the first day to display in
    // the five-day "weekly" view
    if(day % 5 == 0)
    {
        day = day - 4;
    }
    else 
    {
        day = 5 * Math.floor(day/5) + 1;
    }

    // Determine parameters to display previous week
    // Generally prev_day will be the first day minus 1, except on the first 
    // week of the month.
    let prev_day = day - 1;
    let prev_month = month;
    let prev_year = year;

    // Determine parameters to display next week
    // Generally next_day will be the first day plus 5, except on the last 
    // week of the month.
    let next_day = day + 5;
    let next_month = month;
    let next_year = year;

    // Check for end of year boundary scenarios
    if(month == 1 && day == 1)
    {
        prev_month = 13;
        prev_day = 1;
        prev_year = year - 1;
    }
    else if (month == 13)
    {
        prev_month = 12;
        prev_day = 30;
        
        next_month = 1;
        next_day = 1;
        next_year = year + 1;
    }
    // handle generic case, middle of year and no leap years
    else
    {
        if(prev_day < 1) {
            prev_day = 30;
            prev_month = prev_month - 1;
        }
    
        if(next_day > 30){
            next_day = 1;
            next_month = next_month + 1;
        }
    }
    
    
    // send to view object with all events for a given week
    var rows = await mysql.conn.query("select * from events where start_republic_year = ? and start_republic_month = ? and start_republic_day >= ? and start_republic_day <= ?;", [year, month, day, day + 4]);

    week = {};

    for(var i = 0; i < (5 + isLeapYear); i++)
    {
        week[day + i] = [];
    }
    
    rows.forEach(row => {
        
        week[row.start_republic_day].push(row);
    });

    res.render('pages/index', {
        events      : week,
        prev_week   : { "prev_day": prev_day, "prev_month": prev_month, "prev_year": prev_year },
        next_week   : { "next_day": next_day, "next_month": next_month, "next_year": next_year },
        month_name  : month_name
    });
});

// index page
app.get('/', async (req, res) => {

    // Test to read file from Ross' project
    fs.readFile('/home/zac/Developer/Project---Microservice/isLeapYearInput.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(data);
    });

    // test out rendering the page
    // replace with current date in next release
    let year = 230;
    let month = 9;
    let day = 1;

    res.redirect('/' + year + '/' + month + '/' + day);
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

app.listen(app.get('port'), () => {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});