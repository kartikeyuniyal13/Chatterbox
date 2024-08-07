import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import { FC, ReactNode } from 'react'
import Link from 'next/link'
import { IconType, Icons } from '@/components/Icons'
import FriendRequestSidebarOptions from '@/components/FriendRequestSidebarOptions'
import { fetchRedis } from '@/helper/redis'
import { getFriendById } from '@/helper/getFriend'
import SidebarChatList from '@/components/SidebarChatList'

interface LayoutProps {
  children: ReactNode
}

interface SidebarOption {
  id: number
  name: string
  Icon: IconType
  href: string
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

  const friends=await getFriendById(session.user.id)
  
  const unseenRequestCount=(await fetchRedis('smembers',`user:${session.user.id}:incoming_friend_requests`) as User[]).length


  return (
    <div className='w-full flex h-screen'>
      <div className='hidden md:flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-wh'>
        <Link href='/dashboard' className='flex h-16 shrink-0 items-center'>
          <Icons.Logo className='h-8 w-auto text-indigo-600' />
        </Link>
        
        {
          friends.length>0?(<div className='text-xs font-semibold leading-6 text-gray-400'>
            Your Chats
          </div>):null  
        }
        <nav className='flex flex-1 flex-col '>

          <ul role='list' className='flex flex-1 flex-col gap-y-7'>
            <li>
              <SidebarChatList sessionId={session.user.id} friends={friends}/>
            </li>





          <ul role='list' className='-mx-2 mt-2 space-y-1'>
            {sidebarOptions.map((option) => {
              const Icon = Icons[option.Icon]
              return (
                <li key={option.id}>
                  <Link
                    href={option.href}
                    className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold'
                  >
                    <span className='text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'>
                      <Icon className='h-4 w-4' />
                    </span>
                    <span className='truncate'>{option.name}</span>
                  </Link>
                </li>
              )
            })}

            <li>
            <FriendRequestSidebarOptions
                    sessionId={session.user.id}
                    initialUnseenRequestCount={unseenRequestCount}
                  />
            </li>
          </ul>
        </nav>
      </div>
      <div className='flex-1'>{children}</div>
    </div>
  )
}

export default Layout
