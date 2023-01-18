import NextAuth, { NextAuthOptions, User } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
// Prisma
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '../../../lib/prismadb';

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    pages: {
        error: '/auth/error',
        signIn: '/auth/login',
    },
    // callbacks: {
    //     signIn({ user, account }) {
    //         const isAllowedToSignIn = true;
    //         if (account?.provider == 'google') {
    //             // Check if user in database
    //             // for now lets check if its my email
    //             if (user.email == 'mariam.shabrawy.uni1@gmail.com') return true;
    //             else return false;
    //         }
    //         return isAllowedToSignIn;
    //     },
    // },
    session: { strategy: 'jwt' },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        }),
        CredentialsProvider({
            name: 'credentials',
            id: 'credentials',
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
                const usr = await prisma.user.findFirst({
                    where: {
                        email: credentails?.email,
                    },
                });

                if (!usr) return null;
                // if (usr.password !== credentails?.password) return null;

                return {
                    id: String(usr.id),
                    email: usr.email,
                };
            },
        }),
    ],
};

export default NextAuth(authOptions);
