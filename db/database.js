const mongoose = require("mongoose");

const connectDatabase = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log(`MongoDB connected with server: ${mongoose.connection.host}`);
    } catch (error) {
        console.log("Error connecting Mongodb:", error.message);
    }
}

module.exports = connectDatabase;