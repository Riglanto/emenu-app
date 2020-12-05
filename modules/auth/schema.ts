import * as yup from 'yup'

export const SIGNUP_SCHEMA = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required(),
})

export type Signup = yup.InferType<typeof SIGNUP_SCHEMA>

export async function validateSignup(form: unknown) {
    return SIGNUP_SCHEMA.validate(form)
}