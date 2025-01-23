import { fetchRedis } from "@/helper/redis"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { nanoid } from "nanoid"
import { Message, messageSchema } from "@/lib/validations/message"
import { db } from "@/lib/db"
import { z } from "zod"
import { pusherServer } from "@/lib/pusher"
import { toPusherKey } from "@/lib/utils"

//we automatically get the request object from the server
export async function POST(req:Request){
    try{
     const {text,chatId}=await req.json()
     const session=await getServerSession(authOptions)
     if(!session){
         return new Response('Unauthorized',{status:401})
     }

     const [userId1,userId2]=chatId.split('--')
     const chatPartnerId=session.user.id===userId1?userId2:userId1

     if(!text){
         return new Response('Text is required',{status:400})
     }

     const isFriend = await fetchRedis(
        'sismember',
        `user:${session.user.id}:friends`,
        chatPartnerId
       
      )

     if(!isFriend){
        //try using the particular custom name
        return new Response('Not in friends list',{status:500})
     }

     const timestamp=Date.now()
 
     const messageData:Message={
        id:nanoid(),
        senderId:session.user.id,
        text,
        timestamp
     }
     
     const message=messageSchema.parse(messageData)

     pusherServer.trigger(
        toPusherKey(`chat:${chatId}`),
        'incoming-message',
        message
     )

     const rawSender = (await fetchRedis(
        "get",
        `user:${session.user.id}`
     )) as string;
     const sender = JSON.parse(rawSender) as User;

     try {
        pusherServer.trigger(
          toPusherKey(`user:${chatPartnerId}:chats`),
          "new_message",
          { ...message, senderImage: sender.image, senderName: sender.name }
        );
        console.error('Pusher trigger', { ...message, senderImage: sender.image, senderName: sender.name },
            toPusherKey(`user:${chatPartnerId}:chats`)
        );
      } catch (error) {
        console.error('Pusher trigger error:', error);
      }

     
     await db.zadd(
            `chat:${chatId}:messages`,
            { score: timestamp, member: JSON.stringify(message) }
     )

     return new Response('OK',{status:200})

    }catch(error){
       if(error instanceof z.ZodError){
           return new Response(JSON.stringify(error.errors), { status:400 })
       }
       if(error instanceof Error){
           return new Response(error.message,{status:500})
       }
    }
}