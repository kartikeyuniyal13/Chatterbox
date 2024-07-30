import AddFriendButton from '@/components/AddFriendButton'
import React, { FC } from 'react'

const Page: FC = () => {
  return (
    <div className='pt-8'>
      <h1 className='font-bold text-5xl mb-8'>Add a friend</h1>
      <AddFriendButton />
    </div>
  )
}

export default Page
