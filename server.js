var express = require('express');
var mysql = require('./dbcon.js');
var CORS = require('cors');

// Instantiate app
var app = express();
app.set('port', 9000);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(CORS());

app.get('/api/events', function(req, res, next) {
	mysql.pool.query('select * from events limit 20;', (err, rows, fields) => {
		if (err) {
			next(err);
			return;
		}
		res.json(rows);
	});
});

app.listen(app.get('port'), function(){
	console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});