const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const app = express();
const router = require("./routes");
const sequelize = require('./config/db');
const config = require('./config');
const errorHandler = require("./middlewares/error");

app.use(express.json());
app.use(helmet());
app.use(cors());

app.use("/api", router);

app.use(errorHandler);

module.exports = app;

(async () => {
    await sequelize.sync(); // Sync models with DB
    const PORT = config.port;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})();