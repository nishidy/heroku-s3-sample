var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

var AWS = require('aws-sdk');
AWS.config.region = 'ap-northeast-1';

var s3 = new AWS.S3();
s3.getObject(
	{ Bucket:'nishidy-heroku', Key:'test' },
	function(err,data) {
		app.get(
			'/',
			function(request, response) {
				if(data==null){
					response.send("No data...");
					console.log(err);
				}else{
					response.send("<html><head><title>test</title></head><body>"+String(data.Body)+"</body></html>");
				}
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

