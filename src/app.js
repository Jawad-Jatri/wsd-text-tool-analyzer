const express = require("express");
const app = express();
const helmet = require("helmet");
const cors = require("cors");
const router = require("./routes");
const errorHandler = require("./middlewares/error");
const bodyParser = require("body-parser");
const path = require('path');
const config = require("./config");

app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));

app.use("/", router);

app.use(errorHandler);

const PORT = config.port;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
