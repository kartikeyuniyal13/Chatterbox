'use client'

import axios from 'axios'
import { FC, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import TextareaAutosize from 'react-textarea-autosize'
import Button from './ui/Button'

interface ChatInputProps {
  chatPartner: User
  chatId: string
}

const ChatInput: FC<ChatInputProps> = ({ chatPartner, chatId }) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [input, setInput] = useState<string>('')

  const sendMessage = async () => {
    if (!input.trim()) {
      toast.error('Empty message. Enter a message to send.')
      return
    }
    setIsLoading(true)

    try {
      await axios.post('/api/message/send', { text: input, chatId })
      setInput('')
      textareaRef.current?.focus()
    } catch {
      toast.error('Something went wrong. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='px-4 pt-4 pb-6 sm:pb-4'>
      <div className='relative flex-1 overflow-hidden rounded-2xl bg-white/90 backdrop-blur-md shadow-md ring-1 ring-gray-300 focus-within:ring-2 focus-within:ring-teal-500' >
        <TextareaAutosize
          ref={textareaRef}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              sendMessage()
            }
          }}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Message ${chatPartner.name}...`}
          className='block w-full resize-none border-0 bg-transparent text-gray-800 placeholder:text-gray-400 focus:ring-0 py-2 pl-4 pr-10 sm:text-sm sm:leading-6'
        />

        <div
          onClick={() => textareaRef.current?.focus()}
          className='py-2'
          aria-hidden='true'
        >
          <div className='py-px'>
            <div className='h-8' />
          </div>
        </div>

        <div className='absolute right-3 bottom-2 flex justify-between'>
          <div className='flex-shrink-0'>
            <Button 
              isLoading={isLoading} 
              onClick={sendMessage} 
              type='submit'
              className='bg-gradient-to-r from-teal-700 to-teal-900 hover:from-teal-600 hover:to-teal-800 text-white rounded-full px-4 py-2 text-sm font-semibold shadow-md'
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatInput