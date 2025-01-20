import React from 'react';
import axios from 'axios'; // Import axios library
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { fetchRedis } from '@/helper/redis';
import { messageArraySchema } from '@/lib/validations/message';
import Image from 'next/image'
import Messages from '@/components/Messages';
import ChatInput from '@/components/ChatInput';

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

  const {chatId}=params

  const [user1,user2]=chatId.split('--');
  const session=await getServerSession(authOptions)
  if(!session){
    return <div>Unauthorized</div>
  }

  const  user=session.user.id;

  const chatPartnerId= user===user1?user2:user1;
  const chatPartnerString= await fetchRedis('get',`user:${chatPartnerId}`) as string
  const chatPartner=JSON.parse(chatPartnerString) as User
  if(user!==user1 && user!==user2){
    return <div>Unauthorized</div>}

  const initialMessages=await getMessages(chatId) || []

  
  return (
    <div className='flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)]'>
      <div className='flex sm:items-center justify-between py-3 border-b-2 border-gray-200'>
        <div className='relative flex items-center space-x-4'>
          <div className='relative'>
            <div className='relative w-8 sm:w-12 h-8 sm:h-12'>
              <Image
                fill
                referrerPolicy='no-referrer'
                src={chatPartner.image}
                alt={`${chatPartner.name} profile picture`}
                className='rounded-full'
              />
            </div>
          </div>

          <div className='flex flex-col leading-tight'>
            <div className='text-xl flex items-center'>
              <span className='text-gray-700 mr-3 font-semibold'>
                {chatPartner.name}
              </span>
            </div>

            <span className='text-sm text-gray-600'>{chatPartner.email}</span>
          </div>
        </div>
      </div>

      <Messages
        chatId={chatId}
        chatPartner={chatPartner}
        sessionImg={session.user.image}
        sessionId={session.user.id}
        initialMessages={initialMessages}
      />
      <ChatInput chatId={chatId} chatPartner={chatPartner} />
    </div>
  )
}

export default Page;
