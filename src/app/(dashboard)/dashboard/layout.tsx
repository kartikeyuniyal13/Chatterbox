import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import { FC, ReactNode } from 'react'
import Link from 'next/link'
import { Icons } from '@/components/Icons'
import FriendRequestSidebarOptions from '@/components/FriendRequestSidebarOptions'
import { fetchRedis } from '@/helper/redis'
import { getFriendById } from '@/helper/getFriend'
import SidebarChatList from '@/components/SidebarChatList'
import Image from 'next/image'
import SignOutButton from '@/components/SignOutButton'
import MobileChatLayout from '@/components/MobileChatLayout'

interface LayoutProps {
  children: ReactNode
}

const sidebarOptions: SidebarOption[] = [
  {
    id: 1,
    name: 'Add Friend',
    Icon: 'UserPlus',
    href: '/dashboard/add'
  }
]

const Layout: FC<LayoutProps> = async ({ children }) => {
  const session = await getServerSession(authOptions)
  if (!session) {
    console.log('no session')
    return <div>No session</div>
  }

  const friends = await getFriendById(session.user.id)

  const unseenRequestCount = (await fetchRedis('smembers', `user:${session.user.id}:incoming_friend_requests`) as User[]).length

  return (
    <div className='w-full mx-1 flex h-screen bg-gradient-to-br from-teal-50 to-teal-100'>
      <div className='md:hidden'>
        <MobileChatLayout
          friends={friends}
          session={session}
          sidebarOptions={sidebarOptions}
          unseenRequestCount={unseenRequestCount}
        />
      </div>

      <div className='hidden md:flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white'>
        {/* Logo */}
        <Link href='/dashboard' className='flex h-16 shrink-0 items-center px-4'>
          <span className='text-2xl font-bold text-black tracking-wide'>
            Chatterbox
          </span>
          <Icons.Logo className='h-8 w-auto text-teal-600 ml-2' />
        </Link>

        {/* Chats Section */}
        <div className="flex flex-col flex-1">
          {friends.length > 0 && (
            <div className="px-4 py-2 text-sm font-semibold text-teal-700 uppercase tracking-wider">
              Your Chats
            </div>
          )}

          <nav className='flex flex-1 flex-col px-2'>
            <ul className='flex flex-1 flex-col gap-y-5'>
              {/* Sidebar Chat List */}
              <li>
                <SidebarChatList sessionId={session.user.id} friends={friends} />
              </li>

              {/* Sidebar Options (Add Friend etc.) */}
              <ul className='-mx-2 mt-4 space-y-2'>
                {sidebarOptions.map((option) => {
                  const Icon = Icons[option.Icon as keyof typeof Icons];
                  return (
                    <li key={option.id}>
                      <Link
                        href={option.href}
                        className='group flex items-center gap-3 rounded-md p-2 text-sm font-semibold text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition'
                      >
                        <span className='flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-teal-600 group-hover:border-teal-700 group-hover:bg-teal-100'>
                          <Icon className='h-5 w-5' />
                        </span>
                        {option.name}
                      </Link>
                    </li>
                  )
                })}

                {/* Friend Requests */}
                <li>
                  <FriendRequestSidebarOptions
                    sessionId={session.user.id}
                    initialUnseenRequestCount={unseenRequestCount}
                  />
                </li>
              </ul>

              {/* Profile and Sign Out */}
              <li className="mt-auto -mx-2 flex items-center bg-teal-50 p-3 rounded-md shadow-sm">
                <div className="flex items-center gap-x-3 w-full">
                  <div className="relative h-10 w-10">
                    <Image
                      fill
                      referrerPolicy="no-referrer"
                      className="rounded-full object-cover"
                      src={session.user.image || ""}
                      alt="Your profile image"
                    />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-bold text-teal-700 truncate">
                      {session.user.name}
                    </span>
                    <span className="text-xs text-gray-500 truncate">
                      {session.user.email}
                    </span>
                  </div>
                  <SignOutButton className='ml-auto h-8 w-8' />
                </div>
              </li>

            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <aside className='max-h-screen container py-16 md:py-12 w-full overflow-y-auto'>
        {children}
      </aside>
    </div>
  );
};

export default Layout