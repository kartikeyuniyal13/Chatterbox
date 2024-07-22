"use client"
import React, { FC ,useState} from 'react'
import Button from './ui/Button'
import { addFriendValidator } from '@/lib/validations/add-friend'
import axios, { AxiosError } from 'axios'
import { z } from 'zod'
import {useForm} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const AddFriendButton:FC = () => {
  const [showSuccess, setShowSuccess] = useState(false);

  

  const addFriend= async (email:string)=>{
    try{
            const validatedEmail= addFriendValidator.parse({email})
            await axios.post('api/friends/add',{
              email:validatedEmail
            })
            setShowSuccess(true)
    }catch(error)
    {
       if(error instanceof z.ZodError){
        return error.errors.map(err=>console.log(err.message))
       }

       if(error instanceof AxiosError){
          return console.log(error.message)
       }
    }
  }


  return (
    <form>
        <label htmlFor="email">Add friend by email</label>
        <div>
          <input type="text" placeholder='you@example.com'>
          </input>
          <Button>Add</Button>
        </div>
    </form>
  )
}

export default AddFriendButton