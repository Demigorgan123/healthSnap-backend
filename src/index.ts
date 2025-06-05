// importing dependencies
import express from 'express'
import connectDB from '../config/connectDB'
import userRouter from '../routes/user'
import cookieParse from 'cookie-parser'
import cors from 'cors'
import 'dotenv/config'

// creating express server app 
const app = express()
const DB_URL = process.env.DB_URL! // getting database url

// connecting with the database
connectDB(DB_URL)

// using middlewares
app.use(express.json())
app.use(express.urlencoded())
app.use(cookieParse())
app.use(cors())

// using user route for handling signup/login
app.use('/user', userRouter)

// server listening on port 500
app.listen(5000, ()=>console.log("listening on 5000..."))