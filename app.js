const express = require("express");
const todoControllers = require("./Controllers/todoControllers");
const app = express();

app.set("view engine", "ejs");

app.use(express.static("./public"));

todoControllers(app);

app.listen(4000);
