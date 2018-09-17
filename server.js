//Dependencies
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");

//Scrapping
var cheerio = require("cheerio");
var request = require("request");

//Article and Comment models for mongodb
var Comment = require("./models/Comment.js");
var Article = require("./models/Article.js");

// Routing controllers
var htmlController = require("./controllers/html-routes.js");
var articleController = require("./controllers/article-routes.js");


//Initialize express
var port = process.env.PORT || 3000;
var app = express();

app.use(express.static("public"));

//Use body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// Routing
app.use("/", htmlController);
app.use("/", articleController);

//DB config
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/mongoHeadlines";
mongoose.connect(MONGODB_URI);
mongoose.Promise = Promise;
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once("open", function () {
    console.log("Mongoose connection successful.");
});

//Listen on port 3000
app.listen(port, function () {
    console.log("App running on port 3000!");
});