import mongoose from "mongoose"

const connectDB = (DB_URL:string)=>{
    mongoose.connect(DB_URL).then(()=>console.log("Connected to DB successfully")).catch(()=>console.error("Database connection error"))
}

export default connectDB