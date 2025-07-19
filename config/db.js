const mongoose = require('mongoose')
const color=require('colors')

const connectDB = async() =>{
    try{
        console.log('Attempting to connect to:', process.env.MONGODB_URL) // Debug line
        await mongoose.connect(process.env.MONGODB_URL)
        console.log(`MongoDB connected ${mongoose.connection.host}`.bgGreen.white)
    }
    catch(error){
        console.log(`MongoDB sever issue ${error}`.bgRed.white)
    }
};

module.exports=connectDB;