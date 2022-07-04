import express from "express";
import dotenv from "dotenv";
import mongoose from 'mongoose';
import authRoute from "./routes/auth.js"
import usersRoute from "./routes/users.js"
import hotelsRoute from "./routes/hotels.js"
import roomsRoute from "./routes/rooms.js"
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();
dotenv.config();

const connect = async() =>{
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("Connected to Mongodb")
      } catch (error) {
        throw error;
      }
}

mongoose.connection.on("disconnected", ()=>{
    console.log("MongoDB disconnected!")
});

mongoose.connection.on("connected", ()=>{
    console.log("MongoDB connected!")
});


//creating middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth",authRoute);
app.use("/api/users",usersRoute);
app.use("/api/hotels",hotelsRoute);
app.use("/api/rooms",roomsRoute);

app.use((err,req,res,next)=>{
    const errorStatus = err.status || 500;
    const errorMessage = "Something is not right";
    return res.status(errorStatus).json({
        success: false,
        status : errorStatus,
        message:errorMessage,
        stack:err.stack
    })
})



const PORT = process.env.PORT || 1000;
app.listen(PORT, function(){
    connect()
    console.log(`The backend server is running on ${PORT}`)
})