import express from 'express'
import mongoose from 'mongoose'
import dotenv from "dotenv"
import UserRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'
const app = express()
app.use(express.json())
dotenv.config()
mongoose.connect(process.env.MONGO).then(()=>{
    console.log('connected to mongodb')
}).catch((error) => {
    console.log(error)
})

app.listen(3000, ()=>{
    console.log("Server is listening on port 3000")
})

app.use('/api/user', UserRouter)
app.use('/api/auth', authRouter)


app.use((err, req, res, next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({success: false, message, statusCode})
})