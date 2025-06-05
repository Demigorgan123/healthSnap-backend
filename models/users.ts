import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    passwd: {type: String, required: true},
    profilePic: {type: String, default: "https://res.cloudinary.com/dpepprg1y/image/upload/v1748982509/default-profile-pic_wkpplr.png"}
},{timestamps: true})

const userModel = mongoose.model('Users', userSchema)

export default userModel