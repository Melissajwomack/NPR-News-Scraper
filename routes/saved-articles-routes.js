var Comment = require("../models/Comment.js");
var Article = require("../models/Article.js");

module.exports = function (app) {

    //Get article by ObjectId
    app.get("/articles/:id", function (req, res) {
        Article.findOne({ "_id": req.params.id }).populate("comments").exec(function (error, doc) {
            if (error) {
                console.log(error);
            }
            else {
                res.json(doc);
            }
        });
    });

    //Make a new comment
    app.post("/comment/:id", function (req, res) {
        var newComment = new Comment(req.body);
        newComment.save(function (error, newComment) {
            if (error) {
                console.log(error);
            }
            else {
                Article.findOneAndUpdate({ "_id": req.params.id }, { $push: { "comments": newComment._id } }, { new: true }).exec(function (err, doc) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log("Added: ", doc);
                        res.send(doc);
                    }
                });
            }
        });
    });

    //Remove a comment
    app.post("/uncomment/:id", function (req, res) {
        Commet.findOneAndUpdate({ "_id": req.params.id }, { "saved": false })
            .exec(function (err, doc) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("Article Removed");
                }
            });
        res.redirect("/saved");
    });

    //Remove a saved article
    app.post("/unsave/:id", function (req, res) {
        Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": false })
            .exec(function (err, doc) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("Article Removed");
                }
            });
        res.redirect("/saved");
    });

};

