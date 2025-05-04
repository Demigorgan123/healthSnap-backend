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

export {signup, login}