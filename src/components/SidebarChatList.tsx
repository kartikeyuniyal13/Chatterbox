'use client';

import { usePathname, useRouter } from 'next/navigation';
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
    <ul role="list" className="max-h-[25rem] overflow-y-auto mx-2 space-y-3 p-2">
      {friends.sort().map((friend) => {
        const chatHref = `/dashboard/chat/${chatHrefConstructor(sessionId, friend.id)}`;
        const isActive = pathname === chatHref; // Check if this chat is active
        const unseenMessagesCount = unseenMessages.filter(
          (message) => message.senderId === friend.id
        ).length;

        return (
          <li key={friend.id}>
            <a
              href={chatHref}
              className={`flex items-center justify-between p-4 rounded-xl shadow-sm transition-all duration-300 ease-in-out group ${isActive
                  ? 'bg-teal-100 text-teal-1000 shadow-md border-2 border-teal-700'
                  : 'bg-white hover:shadow-[0_4px_20px_rgba(13,148,136,0.5)] hover:bg-teal-50'
                }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-5 rounded-full flex items-center justify-center font-bold uppercase text-lg transition ${isActive
                    ? 'bg-teal-200 text-teal-700'
                    : 'bg-teal-100 text-teal-600 group-hover:bg-teal-200'
                    }`}
                >
                  {friend.name.charAt(0)}
                </div>
                <span
                  className={`text-sm font-medium ${isActive ? 'text-teal-700' : 'text-gray-800 group-hover:text-teal-700'
                    }`}
                >
                  {friend.name}
                </span>
              </div>

              {unseenMessagesCount > 0 && (
                <div className="bg-teal-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-md">
                  {unseenMessagesCount}
                </div>
              )}
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default SidebarChatList;
