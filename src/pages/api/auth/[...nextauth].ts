import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
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
    ],
};

export default NextAuth(authOptions);
