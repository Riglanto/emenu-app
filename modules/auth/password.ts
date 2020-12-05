import * as bcrypt from "bcrypt"

export async function hashPassword(rawPassword: string) {
    const salt = await bcrypt.genSalt(5)
    return bcrypt.hash(rawPassword, salt)
}

export const compare = bcrypt.compare