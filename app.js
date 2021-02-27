//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// creating DB
mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true});

// creating Schema
const itemsSchema = new mongoose.Schema ({
  name: String
});

// creating Model
const Item = mongoose.model("Item", itemsSchema);

// creating Documents
const item1 = new Item ({ name: "welcome to your todolist!" });
const item2 = new Item ({ name: "Hit the + button to add new item." });
const item3 = new Item ({ name: "Hit the - button to delete an item." });

const defaultItems = [item1, item2, item3];

app.get("/", function(req, res) {

  Item.find(function(err, foundItems) {
    if(err) { console.log(err); }
    else {
      if(foundItems.length === 0) {

        // insert default items
        Item.insertMany(defaultItems, function(err) {
          if(err) { console.log(err); }
          else { console.log("Successfully inserted default items!"); }
        });

        res.redirect('/');

      }
      else {
        res.render("list", {listTitle: "Today", newListItems: foundItems});
      }
    }
  });
});

app.post("/", function(req, res){

  const itemName = req.body.newItem;

  const item = new Item ({ name: itemName });
  item.save();

  res.redirect('/');
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Listening on port 3000");
});
