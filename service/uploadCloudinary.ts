import { v2 as cloudinary } from 'cloudinary'
import confCloudinary from '../config/confCloudinary'

const uploadOnCloudinary = async (imgPath: string) => {
    confCloudinary()
    const uplaodRes = await cloudinary.uploader.upload(imgPath,{folder: 'profilePics'})
    return uplaodRes
}

export default uploadOnCloudinary