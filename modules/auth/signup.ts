import {validateSignup, Signup} from "./schema"
import { getConnection } from "~/db"
import {User} from "~/db/entity/User.entity"
import { hashPassword } from "./password";
import {  } from 'next-auth'


export default async function createUser(form: unknown): Promise<User> {
    await getConnection()
    let userForm: Signup;
    userForm = await validateSignup(form)
    
    const {email, password} = userForm
    const hashedPassword = await hashPassword(password)
    const user = User.create({email, password: hashedPassword})
    await user.save()
    delete user.password // redact password

    return user
}