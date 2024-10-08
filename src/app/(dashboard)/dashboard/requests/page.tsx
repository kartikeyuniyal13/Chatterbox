import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import React from 'react'
import { notFound } from 'next/navigation'
import { fetchRedis } from '@/helper/redis'
import FriendRequests from '@/components/FriendRequest'

const page = async () => {

  const session= await getServerSession(authOptions)
    if(!session)
        notFound()
    
   const incomingSenderIds =  (await fetchRedis('smembers',`user:${session.user.id}:incoming_friend_requests`)) as string[]

   const incomingFriendRequests = await Promise.all(incomingSenderIds.map(async (senderId) => {
    const senderString=(await fetchRedis('get',`user:${senderId}`)) as string
    const sender=JSON.parse(senderString)
    return {
        senderId,
        senderEmail:sender.email
    }
   }))

   return (
    <main className='pt-8'>
      <h1 className='font-bold text-5xl mb-8'>Add a friend</h1>
      <div className='flex flex-col gap-4'>
        <FriendRequests
          incomingFriendRequests={incomingFriendRequests}
          sessionId={session.user.id}
        />
      </div>
    </main>
  )
}

export default page