//Dependencies
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");

//Initialize express
var port = process.env.PORT || 3000;
var app = express();

//Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static("public"));

// Routes
var routes = require("./routes/article-routes.js");
app.use("/", routes);


// Handlebars
app.engine(
    "handlebars",
    exphbs({
        defaultLayout: "main"
    })
);
app.set("view engine", "handlebars");

//DB config
var dbURI = "mongodb://127.0.0.1:27017/mongoHeadlines";

if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI);
}
else {
    mongoose.connect(dbURI)
}

//Grab mongoose db
var db = mongoose.connection;

//Shows errors
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//Shows mongoose has connection
db.once("open", function () {
    console.log("Mongoose connection successful.");
});

//Listen on port 3000
app.listen(port, function () {
    console.log("App running on port 3000!");
});