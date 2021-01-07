import "bcrypt"
 
import {compare} from './password'
import { getUserByEmail } from "./user"

export default async function authorize(credentials: Record<string, string>) {
    const user = await getUserByEmail(credentials['email'])
    if (user?.password === null) return null

    try {
        const match = await compare(credentials['password'], user.password)
        return match ? user : null
    }
    catch(e) {
        console.log(`An error occured while authorizing the user ${user}`, e)
        return null
    }
}