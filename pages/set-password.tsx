import { signOut } from 'next-auth/client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '~/components/layout';

type Form = { [key: string]: string };

type OnChange = React.ChangeEventHandler<HTMLInputElement>;

async function sendForm(form: Form) {
	return await fetch('/api/set-password', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		redirect: 'follow',
		body: JSON.stringify(form)
	});
}

function useForm(initialValues: Form = {}): [Form, OnChange] {
	const [ values, setValues ] = React.useState<Form>(initialValues);
	const onChange = React.useCallback<OnChange>(
		(e) => {
			const { name, value } = e.currentTarget;
			setValues({ ...values, [name]: value });
		},
		[ values ]
	);
	return [ values, onChange ];
}

function SetPassword() {
	const [ errors, setErrors ] = React.useState(null);
	const [ form, onChange ] = useForm({ password: '', password1: '' });
	const onSubmit = React.useCallback(
		async (e) => {
			e.preventDefault();
			const res = await sendForm(form);
			if (res.status == 422) {
				setErrors(await res.json());
			} else {
				await signOut({ callbackUrl: '/api/auth/signin' });
			}
		},
		[ form ]
	);

	const { t } = useTranslation();

	return (
		<Layout>
			<div className="mx-auto mx-auto" style={{ width: 'min(600px, 100%)' }}>
				<h2>Set your password</h2>
				<form onSubmit={onSubmit}>
					<div className="form-group pt-2">
						<label htmlFor="password">{t('password')}</label>
						<input
							type="password"
							name="password"
							value={form['password']}
							onChange={onChange}
							className={`form-control ${errors ? 'error' : ''}`}
						/>
					</div>

					<div className="form-group pt-2">
						<label htmlFor="password1">{t('repeat-password')}</label>
						<input
							type="password"
							name="password1"
							value={form['password1']}
							onChange={onChange}
							className={`form-control ${errors ? 'error' : ''}`}
						/>
					</div>
					{errors && (
						<div className="alert alert-danger mt-3" role="alert">
							{t('passwords-dont-match')}
						</div>
					)}
					<div>
						<button type="submit" className={`btn btn-primary bt-lg ${errors ? 'error' : ''}`}>
							{t('submit')}
						</button>
					</div>
				</form>
			</div>
		</Layout>
	);
}

export default SetPassword;
