const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true });
var todoSchema = new mongoose.Schema({
  item: String
});

var Todo = mongoose.model("Todo", todoSchema);

module.exports = function(app) {
  app.get("/", function(req, res) {
    Todo.find({}, function(err, data) {
      if (err) throw err;
      res.render("index", { todo: data });
    });
  });

  app.get("/:item", function(req, res) {
    Todo.find({ item: req.params.item }, err => {
      if (err) throw err;
      res.send({ item: req.params.item });
    });
  });

  app.post("/", urlencodedParser, function(req, res) {
    if (req.body.item === "") {
      Todo.find({}, function(err, data) {
        if (err) throw err;
        res.render("index", { todo: data });
      });
    } else {
      Todo(req.body).save(err => {
        if (err) throw err;
        Todo.find({}, function(err, data) {
          if (err) throw err;
          res.render("index", { todo: data });
        });
      });
    }
  });

  app.delete("/:item", urlencodedParser, function(req, res) {
    Todo.deleteOne({ item: req.params.item }, err => {
      if (err) throw err;
    });
    Todo.find({}, function(err, data) {
      if (err) throw err;
      const filtered = data.filter(function(el) {
        return el.item !== req.params.item;
      });
      res.render("index", { todo: filtered });
    });
  });
};
