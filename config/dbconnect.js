const mongoose = require('mongoose');
require('dotenv').config();
exports.dbconnect = (function() {
    return () => {
        mongoose.connect(process.env.URL)
            .then(() => console.log("database has been connected"))
            .catch((error) => {
                console.error(error.message);
                process.exit(1);
            });
    };
})();
