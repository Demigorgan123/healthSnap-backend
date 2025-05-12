import mongoose from "mongoose"

interface signup{
    name: string,
    email: string,
    passwd: string,
    profilePic?: string
}

interface login{
    email: string,
    passwd: string
}

interface decodeUser{
    userId: string,
    email: string
}
export {signup, login, decodeUser}