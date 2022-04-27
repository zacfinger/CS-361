const express = require('express');
const path = require('path');
const mysql = require('./dbcon.js'); // mysql object


const app = new express();

app.use(express.static('pages'));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'));
});

app.listen(4000, () => {
    console.log('app listening on port 4000');
});