var express = require('express');
var mysql = require('./dbcon.js');
var CORS = require('cors');
const axios = require("axios");
const cheerio = require("cheerio");

// Instantiate app
var app = express();
app.set('port', 9000);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(CORS());

const fetchData = async (siteUrl) => {
    const result = await axios.get(siteUrl);
    return cheerio.load(result.data);
};

const getResults = async (elementType, siteUrl) => {
    var sites = [];
    const $ = await fetchData(siteUrl);
    $('.' + elementType).each((index, element) => {
        //sites.push($(element))
		var e = $(element)[0];

        delete e.children;
        delete e.parent;
        delete e.prev;
        delete e.next;
        //delete e._root;

        sites.push(e);
        
    });

    return sites;
};

app.get('/api/scraper', async (req, res, next) => {

    try {
        let elementType = req.query.elementType;
        let siteURL = req.query.siteURL;
        console.log(elementType);
        console.log(siteURL);
        let results = await getResults(elementType, siteURL)
        res.json(results);
    } catch (error)
    {
        res.send(error)
    }
	
});

app.listen(app.get('port'), function(){
	console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
