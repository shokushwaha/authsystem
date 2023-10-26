const mongoose = require('mongoose')

const URI = process.env.URL
const connectDB = async () => {
    try {
        const con = await mongoose.connect(URI);
        console.log("Database Connected Successfully");
    } catch (e) {
        console.log(`Authentication to database failed`);
        process.exit(1);
    }
};

module.exports = connectDB;