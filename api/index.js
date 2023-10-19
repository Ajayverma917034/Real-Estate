import express from 'express'
import mongoose from 'mongoose'
import dotenv from "dotenv"
const app = express()

dotenv.config()
mongoose.connect(process.env.MONGO).then(()=>{
    console.log('connected to mongodb')
}).catch((error) => {
    console.log(error)
})

app.listen(3000, ()=>{
    console.log("Server is listening on port 3000")
})