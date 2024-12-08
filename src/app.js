const express = require("express");
const app = express();
const router = require("./routes");
const errorHandler = require("./middlewares/error");
const bodyParser = require("body-parser");
const path = require('path');

app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

app.use("/", router);

app.use(errorHandler);

module.exports = app;