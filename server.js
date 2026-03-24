const express = require('express')
const colors = require('colors')
const morgan = require('morgan')
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');
const cors=require('cors')

// dotenv cpnfig
dotenv.config();

//mongoDB connection
connectDB();
//rest obj
const app = express()

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));


//middlewares
app.use(express.json())
app.use(morgan('dev'))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
console.log('📁 Static files served from:', path.join(__dirname, 'uploads'));

//routes
console.log('🛣️ Loading routes...');
app.use('/api/v1/user',require("./routes/userRoutes"));
console.log('✅ User routes loaded');
app.use('/api/v1/admin',require("./routes/adminRoutes"));
console.log('✅ Admin routes loaded');
app.use('/api/v1/doctor',require("./routes/doctorRoutes"))
console.log('✅ Doctor routes loaded');

//port
const port = process.env.PORT || 8000

//listen port
console.log(`🚀 Starting server on port ${port}...`);
app.listen(port, ()=>{
    console.log(`Server Running in ${process.env.NODE_MODE} mode on port ${port}`.bgCyan.white);
});