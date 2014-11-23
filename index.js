var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

var AWS = require('aws-sdk');
AWS.config.region = 'ap-northeast-1';

var s3bucket = new AWS.S3({ params:{ Bucket:'nishidy-heroku' } });

app.use(express.bodyParser());

app.post(
	'/aws',
	function(req, res) {
		var bdata= { Key:req.body.key, Body:req.body.val, ACL:'public-read', ContentType:'text/plain' };
		s3bucket.putObject(
			bdata,
			function(err, data) {
				if (err) {
					console.log("Error uploading data: ", err);
				} else {
					console.log("Successfully uploaded data to myBucket/myKey");
				}
				res.redirect('/');
			}
		);
	}
);

var tophtml=""+
"<html>"+
"  <head>"+
"    <title>Test</title>"+
"  </head>"+
"  <body>";

var formhtml=""+
"    <form method='POST' action='aws'>"+
"      <textarea name='key' rows=1 cols=10></textarea>"+
"      <textarea name='val' rows=1 cols=20></textarea>"+
"      <input type='submit' value='Submit'>"+
"    </form>";

var bothtml=""+
"  </body>"+
"</html>"+
"";

var showhtml;

function sethtml(err,res,dlist,i,dval,key){

	if(err){
		console.log(err);
		return;
	}

	if(dval!=null){
		if(dval.ContentType.indexOf("text")>-1){
			showhtml+="<p>"+key+":"+dval.Body+"</p>";
		}
	}
	
	if(i<dlist.Contents.length-1){
		k=dlist.Contents[i+1].Key;
		s3bucket.getObject(
			{ 'Key':k },
			function(err,data){ sethtml(err,res,dlist,i+1,data,k); }
		)
	}else{
		res.send(tophtml+formhtml+showhtml+bothtml);
	}
}

app.get(
	'/',
	function(req,res){
		showhtml="";
		s3bucket.listObjects(
			function(err,data1){
				console.log(data1);
				k=data1.Contents[0].Key;
				s3bucket.getObject(
					{ 'Key':k },
					function(err,data2){ sethtml(err,res,data1,0,data2,k); }
				)
			}
		)
	}
)
	
app.listen(
	app.get('port'),
	function() {
		console.log("Node app is running at localhost:" + app.get('port'))
	}
)

