import React from 'react';
import axios from 'axios'; // Import axios library
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { fetchRedis } from '@/helper/redis';
import { messageArraySchema } from '@/lib/validations/message';

interface Props {
  params:{
    chatId: string;
  },
}

async function getMessages(chatId:string){
  try{
    const results: string[]= await fetchRedis(
      'zrange',
      `chat:${chatId}:messages`,
      0,
      -1
    )

    const dbmessages=results.map((message)=>(JSON.parse(message)) as Message)

    const reversedMessages=dbmessages.reverse()

    const messages= messageArraySchema.parse(reversedMessages) 

   return messages
  }catch(error){
    console.log(error)
  }
}

const Page = async ({ params}:Props) => {

  const [user1,user2]=params.chatId.split('--');
  const session=await getServerSession(authOptions)
  if(!session){
    return <div>Unauthorized</div>
  }

  const  user=session.user.id;

  const friendId= user===user1?user2:user1;

  if(user!==user1 && user!==user2){
    return <div>Unauthorized</div>}

  const result=await axios.post('/api/friends/accept', {id:params.chatId})

  if(){

  }
  
  return (
    <div>
      <div>{params.chatId}</div>

    </div>
  );
}

export default Page;
