//Dependencies
require('dotenv').config()
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');

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
        handlebars: allowInsecurePrototypeAccess(Handlebars),
        defaultLayout: "main"
    })
);
app.set("view engine", "handlebars");

//DB config
var mdbkey = require("./key.js");
var user = mdbkey.mdburi.user;
var pw = mdbkey.mdburi.pw;
var db = mdbkey.mdburi.db;
var mongodburi = `mongodb+srv://me:076269mw@cluster0.oepzq.mongodb.net/Cluster0?retryWrites=true&w=majority`;

if (process.env.MONGODB_URI) {
    mongoose.set('useCreateIndex', true);
    mongoose.connect(process.env.MONGODB_URI, { 
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}
else {
    mongoose.set('useCreateIndex', true);
    mongoose.connect(mongodburi, { 
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
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