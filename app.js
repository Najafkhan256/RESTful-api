const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const e = require("express");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.set("strictQuery", true);

// DB name
const DB = "wikiDB";
// mongoose connection
mongoose.connect(`mongodb://localhost:27017/wikiDB`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// article schema
const articleSchema = {
  title: String,
  content: String
};

// collection name is articles
const Article = mongoose.model("Article", articleSchema);

// chained routing in express

//////////////////// Requesting All Articles ////////////////////////////
app
  .route("/articles")
  .get(function (req, res) {
    Article.find(function (err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  .post(function (req, res) {
    console.log(req.body.title);
    console.log(req.body.content);

    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save(function (err) {
      if (!err) {
        res.send("Saved successfully");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("Delete successfully");
      } else {
        res.send(err);
      }
    });
  });

//////////////////// Requesting A specific Articles ////////////////////////////
app
  .route("/articles/:articleTitle")
  .get(function (req, res) {
    Article.findOne(
      { title: req.params.articleTitle },
      function (err, foundArticle) {
        if (foundArticle) {
          res.send(foundArticle);
        } else {
          res.send("No article is found!");
        }
      }
    );
  })
  .put(function (req, res) {
    Article.updateOne(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      // { overwrite: true },
      function (err) {
        if (!err) {
          res.send("Successfully updated selected Article");
        } else {
          res.send(err);
        }
      }
    );
  })
  .patch(function (req, res) {
    Article.updateOne(
      { title: req.params.articleTitle },
      // { $set: { title: req.body.title, content: req.body.content } },
      { $set: req.body },
      function (err) {
        if (!err) {
          res.send("Successfully updated selected Article");
        } else {
          res.send(err);
        }
      }
    );
  })
  .delete(function (req, res) {
    Article.deleteOne({ title: req.params.articleTitle }, function (err) {
      if (!err) {
        res.send("Successfully deleted selected article");
      } else {
        res.send(err);
      }
    });
  });

/* app.get("/", function(req, res) {
  res.render("articles", {
    pageName: "Your Articles",
    foundArticles: foundArticles
  });
}); */

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});

/* {
    "_id" : ObjectId("5c139771d79ac8eac11e754a"),
    "title" : "API",
    "content" : "API stands for Application Programming Interface. It is a set of subroutine definitions, communication protocols, and tools for building software. In general terms, it is a set of clearly defined methods of communication among various components. A good API makes it easier to develop a computer program by providing all the building blocks, which are then put together by the programmer."
}
{
    "_id" : ObjectId("5c1398aad79ac8eac11e7561"),
    "title" : "Bootstrap",
    "content" : "This is a framework developed by Twitter that contains pre-made front-end templates for web design"
}
{
    "_id" : ObjectId("5c1398ecd79ac8eac11e7567"),
    "title" : "DOM",
    "content" : "The Document Object Model is like an API for interacting with our HTML"
}
{
    "_id" : ObjectId("63b7fe6678e0a131c16c09ec"),
    "title" : "Jack Bauer",
    "content" : "Jack Bauer once stepped into quicksand. The quicksand couldn't escape and nearly drowned."
}
{
    "_id" : ObjectId("63b8455147f1c8e019b375eb"),
    "title" : "Najaf khan",
    "content" : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took",
}

{
    "_id" : ObjectId("63b84678daf2ded562030a83"),
    "title" : "Rayyan khan",
    "content" : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took",
} */
