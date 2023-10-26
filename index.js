require('dotenv').config()
const express = require('express')
const app = express();
const cors = require("cors");

const connectDB = require('./db/conn')
const port = process.env.PORT
const userRoute = require("./routes/userRoute");
const cookieParser = require('cookie-parser')

// middlewares
app.use(cors());
app.use(cookieParser())
app.use(express.json());

// authenticaion route
app.use("/api/user", userRoute);

// database connection
connectDB();

app.listen(port, () => console.log(`server is running on ${port}`))