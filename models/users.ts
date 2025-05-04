import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    passwd: {type: String, required: true},
    profilePic: {type: String}
},{timestamps: true})

const userModel = mongoose.model('Users', userSchema)

export default userModel