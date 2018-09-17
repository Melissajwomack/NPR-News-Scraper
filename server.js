var express = require("express");
var bodyParser = require("body-parser");
var cheerio = require("cheerio");
var request = require("request");


var app = express();

app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

request("http://www.npr.org/sections/news/archive", function (error, response, html) {
    var $ = cheerio.load(html);

    var results = [];

    $("div.archivelist > article").each(function (i, element) {

        var link = $(element).children().attr("href");
        var title = $(element).children().text();

        results.push({
            title: title,
            link: link
        });
    });

    console.log(results);
});

app.listen(3000, function () {
    console.log("App running on port 3000!");
});