var express = require('express');

var app = module.exports = express();

var bodyParser = require('body-parser');

var allowCors = function(req, res, next) {

	res.header('Access-Control-Allow-Origin', '127.0.0.1:5000');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true');

	next();
}

var PORT = 5000;

app.listen(PORT, () => console.log("Server listening on port: " + PORT));

app.use(allowCors);

app.use(bodyParser.json());

app.use(express.static(__dirname + '/views'));

app.use(bodyParser.urlencoded({

	extended: true
}));

app.use(require("express-session")({
  secret : "super secret string",
  resave : false,
  saveUninitialized : false
}));
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
});
