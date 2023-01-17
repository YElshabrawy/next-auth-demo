import NextAuth, { NextAuthOptions, User } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { signIn } from 'next-auth/react';

export const authOptions: NextAuthOptions = {
    pages: {
        error: '/auth/error',
    },
    callbacks: {
        signIn({ user, account }) {
            const isAllowedToSignIn = true;
            if (account?.provider == 'google') {
                // Check if user in database
                // for now lets check if its my email
                if (user.email == 'mariam.shabrawy.uni1@gmail.com') return true;
                else return false;
            }
            return isAllowedToSignIn;
        },
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: {
                    label: 'Email',
                    type: 'email',
                    placeholder: 'jsmith@test.com',
                },
                password: { label: 'Password', type: 'password' },
            },
            authorize: async (credentails, req) => {
                // Check if user exists in database
                if (
                    credentails?.email == 'admin@gmail.com' &&
                    credentails.password == '0000'
                ) {
                    let u: User = { id: '237', email: credentails.email };
                    return u;
                }
                return null;
            },
        }),
    ],
};

export default NextAuth(authOptions);
