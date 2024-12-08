const sequelize = require('./config/db');
const config = require('./config');
const app = require('./app');

(async () => {
    await sequelize.sync(); // Sync models with DB
    const PORT = config.port;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})();