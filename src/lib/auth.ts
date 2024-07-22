import { NextAuthOptions } from "next-auth";
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { db } from "./db";
import GoogleProvider from "next-auth/providers/google";



function getGoogleCredentials(){
    const clientId=process.env.GOOGLE_CLIENT_ID;
    const clientSecret=process.env.GOOGLE_CLIENT_SECRET;
    if(!clientId||clientId.length===0){
        throw new Error("Missing GOOGLE_CLIENT_ID env variable");
    }
    if(!clientSecret||clientSecret.length===0){
        throw new Error("Missing GOOGLE_CLIENT_SECRET env variable");
    }
    return {
        clientId,
        clientSecret
    
    }
}
export const authOptions: NextAuthOptions = {
    adapter: UpstashRedisAdapter(db),
    session:{
        strategy:"jwt",
    },
    pages:{
        signIn:'/login'
    },
    providers:[
        GoogleProvider({
            clientId:getGoogleCredentials().clientId,
            clientSecret:getGoogleCredentials().clientSecret

        })
    ],
    callbacks:{
async jwt({ token, user }) {
  if (user) {
    try {
      const dbUser = await db.get(user.id) as User | null;

      if (dbUser) {
        token.id = dbUser.id;
        token.name = dbUser.name;
        token.email = dbUser.email;
        token.image = dbUser.image;
      } else {
        token.id = user.id;
      }
    } catch (error) {
      console.error('Error fetching user from database:', error);
      token.id = user.id;
    }
  } else {
    console.warn('User is undefined in JWT callback.');
    // Optionally handle this case, e.g., by setting a default token value or logging the issue
  }

  return token;
},

        async session({session,token}){
            console.log('Session Callback:', { session, token });
            if(token){
                session.user.id=token.id;
                session.user.name=token.name;
                session.user.email=token.email;
                session.user.image=token.picture;
            }
            return session
        },redirect(){
            return '/dashboard'
        }
    }

}