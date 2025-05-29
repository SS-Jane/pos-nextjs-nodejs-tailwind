import NextAuth from "next-auth";
import CredentailsProvider from "next-auth/providers/credentials";
import config from "@/config";

const handler = NextAuth({
    providers : [
        CredentailsProvider({
            name : "Credentials",
            credentials : {
                email : {},
                password : {},
            },
            async authorize(credentials) {
                const user = {id: 1, name : 'Admin', email : 'admin@example.com'};
                if (credentials?.email === user.email && credentials?.password === 'admin') {
                    return user;
                }
                return null;
            }
        })
    ],
    pages : {
        signIn: '/(full-width-pages)/(auth)/signin',
    },
    session:{
        strategy: 'jwt',
    },
    secret : config.token
});

export { handler as GET, handler as POST };