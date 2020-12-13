import * as bcrypt from "bcrypt"
import { validateSetPassword } from './schema';
import { User } from '~/modules/models/User.entity';
import { putUser } from '~/modules/auth/user';

export async function setPassword(user: User, form: unknown): Promise<User> {
    const { password } = await validateSetPassword(form);

    const hashedPassword = await hashPassword(password);
    const updatedUser: User = { ...user, password: hashedPassword }
    await putUser(updatedUser)
    delete user.password; // redact password

    return user;
}

export async function hashPassword(rawPassword: string) {
    const salt = await bcrypt.genSalt(5)
    return bcrypt.hash(rawPassword, salt)
}

export async function compare(raw: string, hashed: string) {
    const salt = await bcrypt.genSalt(5)
    return bcrypt.compare(raw, hashed)
}