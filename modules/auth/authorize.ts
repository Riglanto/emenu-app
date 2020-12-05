import "bcrypt"
import { User } from "~/db/entity/User.entity"
import { getConnection } from "~/db"
 
import {compare} from './password'

export default async function authorize(credentials: Record<string, string>) {
    const repo = (await getConnection()).getRepository(User)
    const user = await repo.findOne({email: credentials[0]})
    if (user?.password === null) { return null }

    try {
        const match = await compare(credentials[1], user.password)
        if (match) return { email: user.email, id: user.id }
    }
    finally { // password didn't match or is not set
        return null
    }
}