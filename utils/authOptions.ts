import connectDB from "@/config/database";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions : NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
              email: { label: "Email", type: "text" },
              password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials) {
                    throw new Error('No credentials provided');
                  }
              await connectDB();
              try {
                const user = await User.findOne({ email: credentials.email });
                if (user) {
                  const isPasswordCorrect = await bcrypt.compare(
                    credentials.password,
                    user.password
                  );
                  if (isPasswordCorrect) {
                    return user;
                  }
                }
              } catch (err: any) {
                throw new Error(err);
              }
            },
          }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),
    ],
    callbacks: {
        // Invoked on successful signin
        async signIn ({  account, profile } ) {
            //1. Connect to database
            await connectDB();
            //2. Check if user exists
            if (account?.provider == "credentials") {
                return true;
              }
            if (account?.provider == "google" && profile) {
            const userExists = await User.findOne({ email: profile.email });
            //3. If not, then add user to database
            if (!userExists && profile.name) {
               // Truncate user name if too long
                const username = profile.name.slice(0, 20);
                await User.create({
                    email: profile.email,
                    username,
                    image: profile.picture 
                });
            }
            }
            //4. Return true to allow sign in
            return true;
        },
    //     // Modifies the session object
        async session({ session }) {
            //1. Get user from database
                const user = await User.findOne({ email: (session.user as { email: string }).email});
            //2. Assign the user id to the session
            if (session?.user) {
                session.user.id = user._id.toString();
                session.user.name = session.user.name || user.username;
            }
            //3. return session
            return session;
            
        }
    }
}