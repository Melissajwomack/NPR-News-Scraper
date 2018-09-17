var express = require("express");
var request = require("request");
var cheerio = require("cheerio");
var Comment = require("../models/Comment.js");
var Article = require("../models/Article.js");
var router = express.Router();


//Scrape data from NPR
router.get("/scrape", function (req, res) {
    request("http://www.npr.org/sections/news/archive", function (error, response, html) {

        var $ = cheerio.load(html);

        $("article.item").each(function (i, element) {

            var result = {};

            result.title = $(element).children("div.item-info").children("h2.title").children("a").text();
            console.log(result.title);

            result.link = $(element).children("div.item-info").children("h2.title").children("a").attr("href");
            console.log(result.link);

            result.description = $(element).children("div.item-info").children("p.teaser").children("a").text();
            console.log(result.description);

            var newArticle = new Article(result);

            newArticle.save(function (err, doc) {

                // Log any errors
                if (err) {
                    console.log(err);
                }
                // Or log the doc
                else {
                    console.log(doc);
                }
            });
        });

    });
    res.redirect("/all");
});