import { fetchRedis } from '@/helper/redis'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import {string, z} from 'zod'
import { db } from '@/lib/db'

export async function POST(req:Request){
    try{
        const body =await req.json()
        const {id:idToAdd}= z.object({id:string()}).parse(body)

        const session=await getServerSession(authOptions)
        if(!session){
            return new Response('Unauthorized',{status:401})
        }
       
      
        db.srem(`user:${session.user.id}:incoming_friend_requests`, idToAdd);
        
        return new Response('Friend request denied',{status:200});
    }
    catch(error){
       if(error instanceof z.ZodError){
        return new Response(error.toString(), { status: 400 });
       }
         return new Response('Invalid request', { status: 400 });
    }
}