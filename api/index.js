import express from 'express'
import mongoose from 'mongoose'
import dotenv from "dotenv"
import UserRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'
import listingRouter from './routes/listing.route.js'
import cookieParser from 'cookie-parser'
const app = express()
app.use(express.json())
app.use(cookieParser())
dotenv.config()
mongoose.connect(process.env.MONGO).then(()=>{
    console.log('connected to mongodb')
}).catch((error) => {
    console.log(error)
    console.log("hello")
})

app.listen(3000, ()=>{
    console.log("Server is listening on port 3000")
})

app.use('/api/user', UserRouter)
app.use('/api/auth', authRouter)
app.use('/api/listing', listingRouter)


app.use((err, req, res, next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({success: false, message, statusCode})
})