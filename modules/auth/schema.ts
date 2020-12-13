import * as yup from 'yup'

export const SET_PASSWORD_SCHEMA = yup.object().shape({
    password: yup.string().required('Password is required'),
    password1: yup.string().oneOf([yup.ref('password'), null], "Passwords don't match").required('Confirm Password is required'),
})

export type SetPasswordForm = yup.InferType<typeof SET_PASSWORD_SCHEMA>

export async function validateSetPassword(form: unknown) {
    return await SET_PASSWORD_SCHEMA.validate(form)
}