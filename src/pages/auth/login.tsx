import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';

import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';

export default function Login() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const errMsg = router.query.error;

    // If authed go home
    if (status === 'authenticated') {
        router.push('/');
    }

    // Formik
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        onSubmit: handleSubmitLogin,
    });

    async function handleSubmitLogin(values: {
        email: string;
        password: string;
    }) {
        let res = await signIn('credentials', {
            ...values,
            callbackUrl: (router.query.callbackUrl as string) ?? '/',
        });
    }
    return (
        <>
            <Head>
                <title>Login</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <h1>JoeDev - Login</h1>
                {errMsg && <h3>Error: {errMsg}</h3>}
                <button
                    onClick={() =>
                        signIn('google', {
                            callbackUrl:
                                (router.query.callbackUrl as string) ?? '/',
                        })
                    }
                >
                    Sign In with Google
                </button>
                <p>- Sign in with Email -</p>
                <form onSubmit={formik.handleSubmit}>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="test@test.com"
                        {...formik.getFieldProps('email')}
                    />
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder=""
                        {...formik.getFieldProps('password')}
                    />
                    <button type="submit">Login</button>
                </form>
                <Link href="/">Go Back</Link>
            </main>
        </>
    );
}
