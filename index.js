const express = require('express');
const path = require('path');
const mysql = require('./dbcon.js'); // mysql object


const app = new express();

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page
app.get('/', async (req, res) => {
    var rows = await mysql.conn.query("select * from events limit 10;");
    console.log(rows);
    res.render('pages/index', {
        events : rows
    });
});

// about page
app.get('/about', function(req, res) {
  res.render('pages/about');
});

app.listen(4000, () => {
    console.log('app listening on port 4000');
});