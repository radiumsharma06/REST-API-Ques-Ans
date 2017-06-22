'use strict';

var express = require("express");
var app = express();
var routes = require("./routes");

var bodyParser = require("body-parser");
var logger = require("morgan");

app.use(logger("dev"));
app.use(bodyParser.json());

var mongoose = require("mongoose");

var mongoDbUrl="mongodb://<dbuser>:<dbpassword>@2323.mlab.com:1523/quesans";
//Make your mongodb URL

mongoose.connect(mongoDbUrl);

var db = mongoose.connection;

db.on("error", function(err){
	console.error("connection error:", err);
});

db.once("open", function(){
	console.log("db connection successful");
});

app.use(function(req, res, next){
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	if(req.method === "OPTIONS") {
		res.header("Access-Control-Allow-Methods", "PUT,POST,DELETE");
		return res.status(200).json({});
	}
	next();
});

app.use("/questions", routes);


app.use(function(req, res, next){
	var err = new Error("Not Found");
	err.status = 404;
	next(err);
});


app.use(function(err, req, res, next){
	res.status(err.status || 500);
	res.json({
		error: {
			message: err.message
		}
	});
});

var port = process.env.PORT || 3000;

app.listen(port, function(){
	console.log("Express server is listening on port", port);
});
