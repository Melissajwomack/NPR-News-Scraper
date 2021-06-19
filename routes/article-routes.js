var express = require('express');
var router = express.Router();
var request = require("request");
var cheerio = require("cheerio");
var Comments = require("../models/comment.js");
var Article = require("../models/article.js");

//Scrape data from NPR
router.get("/scrape", function (req, res) {
    request("http://www.npr.org/sections/news/", function (error, response, html) {

        var $ = cheerio.load(html);

        $("article.item.has-image").each(function (i, element) {

            var result = {};

            result.title = $(element).children("div.item-info-wrap").children("div.item-info").children("h2.title").children("a").text();

            result.description = $(element).children("div.item-info-wrap").children("div.item-info").children("p.teaser").children("a").text();

            result.link = $(element).children("div.item-info-wrap").children("div.item-info").children("h2.title").children("a").attr("href");

            result.photo = $(element).children("div.item-image").children("div.item-image").children("div.imagewrap").children("a").children("picture").children("img").attr("src");

            var newArticle = new Article(result);

            newArticle.save(function (err, inserted) {

                // Log any errors
                if (err) {
                    console.log(err);
                }
                // Or log the doc
                else {
                    console.log(inserted);
                }
            });
        });
        res.redirect("/");
    });
});

//Render data from database on index page
router.get("/", (req, res) => {
    Article.find({})
        .populate("comments")
        .exec(function (error, found) {
            if (error) {
                console.log(error);
            }
            else {
                res.render("index", {
                    data: found
                });
            }
        });
});

//Clear database off all articles
router.delete("/delete", (req, res) => {
    Article.deleteMany({}, function (error) {
        if (error) {
            console.log(error);
        }
        else {
            console.log("Removed all articles from database!");
        }
    })
})

//Render saved articles on saved page
router.get("/saved", (req, res) => {
    Article.find({ saved: true })
    .populate("comments")
    .exec( function (error, found) {
        if (error) {
            console.log(error);
        }
        else {
            res.render("saved", {
                data: found
            });
        }
    });
});


//Sets saved to true for article
router.post("/save/:id", function (req, res) {
    Article.findOneAndUpdate({ _id: req.params.id }, { saved: true }, { new: true }, function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Changed: ", data)
        }
    });
});

//Sets saved to false for article
router.post("/removesaved/:id", function (req, res) {
    Article.findOneAndUpdate({ _id: req.params.id }, { saved: false }, { new: true }, function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Changed: ", data)
        }
    });
});


//** COMMENTS **//

//Get article comments by ObjectId
router.get("/articles/:id", function (req, res) {
    Article.findOne({ _id: req.params.id })
        .populate("comments")
        .then(function (res) {
            res.json(res);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//Make a new comment
router.post("/comment/:id", function (req, res) {
    Comments.create(req.body)
        .then(function (data) {
            Article.findOneAndUpdate({ _id: req.params.id }, { $push: { comments: data._id } }, { new: true }, function(err, data) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(data);
                }
            });
        })
        .then(function (res) {
            res.json(res);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//Remove a comment
router.delete("/uncomment/:id", function (req, res) {
    Comments.findOneAndRemove({ _id: req.params.id })
        .exec(function (err, doc) {
            if (err) {
                console.log(err);
            }
            else {
                console.log("Article Removed");
                console.log(doc);
            }
        });
});

module.exports = router;
