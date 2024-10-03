import 'dotenv/config'

import jwt from 'jsonwebtoken'

export const getAccessToken = (payload: {
    id: number,
    email: string|undefined,
    role: string|undefined,
})=> {const token = jwt.sign(payload, process.env.SECRET_KEY as string,{expiresIn:'5 days'}); return token}
