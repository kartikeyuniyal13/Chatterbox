import React from 'react';
import axios from 'axios'; 
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { fetchRedis } from '@/helper/redis';
import { messageArraySchema } from '@/lib/validations/message';
import Image from 'next/image'
import Messages from '@/components/Messages';
import ChatInput from '@/components/ChatInput';

interface Props {
  params: { chatId: string };
}

async function getMessages(chatId: string) {
  try {
    const results: string[] = await fetchRedis(
      'zrange',
      `chat:${chatId}:messages`,
      0,
      -1
    );

    const dbMessages = results.map((message) => (JSON.parse(message)) as Message);
    const reversedMessages = dbMessages.reverse();
    const messages = messageArraySchema.parse(reversedMessages);

    return messages;
  } catch (error) {
    console.log(error);
  }
}

const Page = async ({ params }: Props) => {
  const { chatId } = params;
  const [user1, user2] = chatId.split('--');
  const session = await getServerSession(authOptions);

  if (!session) {
    return <div>Unauthorized</div>;
  }

  const user = session.user.id;
  const chatPartnerId = user === user1 ? user2 : user1;

  const chatPartnerString = await fetchRedis('get', `user:${chatPartnerId}`) as string;
  const chatPartner = JSON.parse(chatPartnerString) as User;

  if (user !== user1 && user !== user2) {
    return <div>Unauthorized</div>;
  }

  const initialMessages = await getMessages(chatId) || [];

  return (
    <div className="flex-1 flex flex-col h-full max-h-[calc(100vh-6rem)] bg-gradient-to-b from-teal-700 via-teal-600 to-teal-800">
      
      {/* Header */}
      <div className="flex items-center justify-between py-4 px-6 border-b border-teal-500 bg-teal-900/90 backdrop-blur-sm">
        <div className="flex items-center space-x-4">
          <div className="relative w-10 h-10 sm:w-12 sm:h-12">
            <Image
              fill
              referrerPolicy="no-referrer"
              src={chatPartner.image}
              alt={`${chatPartner.name} profile picture`}
              className="rounded-full object-cover"
            />
          </div>

          <div className="flex flex-col leading-tight">
            <h2 className="text-white font-semibold text-lg">{chatPartner.name}</h2>
            <span className="text-sm text-teal-200">{chatPartner.email}</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <Messages
        chatId={chatId}
        chatPartner={chatPartner}
        sessionImg={session.user.image}
        sessionId={session.user.id}
        initialMessages={initialMessages}
      />

      {/* Input */}
      <div className="bg-teal-900/90 px-4 py-3 backdrop-blur-sm border-t border-teal-500">
        <ChatInput chatId={chatId} chatPartner={chatPartner} />
      </div>

    </div>
  );
}

export default Page;