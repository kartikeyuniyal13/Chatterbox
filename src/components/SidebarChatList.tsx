'use client';

import { usePathname,useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { chatHrefConstructor, toPusherKey } from '@/lib/utils';
import { pusherClient } from '@/lib/pusher';
import toast from 'react-hot-toast';
import ToastNewMessage from './ToastNewMessage';

interface SidebarChatListProps {
  friends: User[];
  sessionId: string;
}

interface MessagePlus extends Message {
  senderImage: string;
  senderName: string;
  
}

const SidebarChatList: FC<SidebarChatListProps> = ({ friends, sessionId }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (pathname?.includes('chat')) {
      setUnseenMessages((prev) => {
        return prev.filter((message) => !pathname.includes(message.senderId));
      });
    }
  }, [pathname]);

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:chats`));
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`));

    const chatHandler = (message: MessagePlus) => {
       const shouldNotify =
          pathname !==
          `/dashboard/chat/${chatHrefConstructor(
             sessionId,
             message.senderId
          )}`;

       if (!shouldNotify) return;
       // toast
       toast.custom((t) => (
          <ToastNewMessage
             t={t}
             sessionId={sessionId}
             senderId={message.senderId}
             senderImage={message.senderImage}
             senderMessage={message.text}
             senderName={message.senderName}
          />
       ));

       setUnseenMessages((prev) => [...prev, message]);
    }     
     const newFriendHandler = (newFriend: User) => {
     router.refresh();
   };

   pusherClient.bind("new_message", chatHandler);
   pusherClient.bind("new_friend", newFriendHandler);

   return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:chats`));
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`));

      pusherClient.unbind("new_message", chatHandler);
      pusherClient.unbind("new_friend", newFriendHandler);
   };
}, [sessionId, router, pathname]);;

  return (
    <ul role='list' className='max-h-[25rem] overflow-y-auto mx-2 space-y-1'>
      {friends.sort().map((friend) => {
        const unseenMessagesCount = unseenMessages.filter(
          (message) => message.senderId === friend.id
        ).length;

        return (
          <li key={friend.id}>
            <a href={`/dashboard/chat/${chatHrefConstructor(sessionId, friend.id)}`}>
              {friend.name} {unseenMessagesCount > 0?<div>
                <div className="bg-indigo-600 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center">{unseenMessagesCount}</div>
              </div> :null}
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default SidebarChatList;
