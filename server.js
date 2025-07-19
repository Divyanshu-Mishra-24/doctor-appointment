const express = require('express')
const colors = require('colors')
const morgan = require('morgan')
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');

// dotenv cpnfig
dotenv.config();

//mongoDB connection
connectDB();
//rest obj
const app = express()

//middlewares
app.use(express.json())
app.use(morgan('dev'))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//routes
app.use('/api/v1/user',require("./routes/userRoutes"));
app.use('/api/v1/admin',require("./routes/adminRoutes"));
app.use('/api/v1/doctor',require("./routes/doctorRoutes"))

//port
const port = process.env.PORT || 8000

//listen port
app.listen(port, ()=>{
    console.log(`Server Running in ${process.env.NODE_MODE} mode on port ${process.env.PORT}`.bgCyan.white);
});