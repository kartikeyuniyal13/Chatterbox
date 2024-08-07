import { usePathname } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { chatHrefConstructor } from '@/lib/utils';

interface SidebarChatListProps {
  friends: User[];
  sessionId: string;
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

  return (
    <ul role='list' className='max-h-[25rem] overflow-y-auto mx-2 space-y-1'>
      {friends.sort().map((friend) => {
        const unseenMessagesCount = unseenMessages.filter(
          (message) => message.senderId === friend.id
        ).length;

        return (
          <li key={friend.id}>
            <a href={`/dashboard/chat/${chatHrefConstructor(sessionId, friend.id)}`}>
              {friend.name} {unseenMessagesCount > 0 && `(${unseenMessagesCount})`}
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default SidebarChatList;
