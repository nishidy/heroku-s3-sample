var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

var AWS = require('aws-sdk');
AWS.config.region = 'Tokyo';

var s3 = new AWS.S3();
s3.getObject(
	{ Bucket:'nishidy-heroku', Key:'test' },
	function(err,data) {
		app.get(
			'/',
			function(request, response) {
				response.send(data);
			}
		);
	}
);

app.listen(
	app.get('port'),
	function() {
		console.log("Node app is running at localhost:" + app.get('port'))
	}
)

