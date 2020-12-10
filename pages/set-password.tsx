import { signOut } from 'next-auth/client';
import { useRouter } from 'next/dist/client/router';
import React, { ChangeEventHandler } from 'react';
import Layout from '~/components/layout'

type Form = {[key: string]: string}

async function sendForm (form: Form) {
    return await fetch('/api/set-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        body: JSON.stringify(form)
    })
}


function useForm(initialValues: Form = {}): [Form, OnChange] {
    const [values, setValues] = React.useState<Form>(initialValues)
    const onChange = React.useCallback<OnChange>(e => {
        const {name, value} = e.currentTarget
        setValues({...values, [name]: value})
    }, [values])
    return [values, onChange]
}

function SetPassword () {
    const [errors, setErrors] = React.useState({})
    const [form, onChange] = useForm()
    const router = useRouter()
    const onSubmit = React.useCallback(async (e) => {
        e.preventDefault()
        const res = await sendForm(form)
        if (res.status == 422) {
            setErrors(await res.json())
        }
        else {
            await signOut({callbackUrl: '/api/auth/signin'})
        }
    }, [form])
    
    return (
        <Layout>
            <div className="mx-auto mx-auto" style={{width: 'min(600px, 100%)'}}>
            <h2>Set your password</h2>
            <form onSubmit={onSubmit}>
                
                <div className="form-group pt-2">
                    <label htmlFor='password'>
                        Password
                    </label>
                    <input type="password" name='password'value={form['password']} onChange={onChange} className='form-control'/>
                </div>
                
                <div className="form-group pt-2">
                    <label htmlFor='password1'>
                        Repeat password
                    </label>
                    <input type="password" name='password1'value={form['password1']} onChange={onChange} className='form-control btn-lg mx-auto'/>
                </div>
                <div>
                    <button type='submit' className='btn btn-primary bt-lg mt-3'>
                        Submit
                    </button>
                </div>
            </form>
            {JSON.stringify(errors || {})}
            </div>
        </Layout>
    )
}

export default SetPassword