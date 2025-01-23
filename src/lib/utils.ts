import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'


/**The type ClassValue[] comes from the clsx library and allows for multiple formats:
Strings (e.g., 'text-center').
Arrays (e.g., ['text-center', 'bg-red-500']).
Objects (e.g., { 'text-center': true, 'hidden': isHidden }). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function chatHrefConstructor(id1: string, id2: string) {
  const sortedIds=[id1,id2].sort()
  return `${sortedIds[0]}--${sortedIds[1]}`

}

export function toPusherKey(key: string) {
  if (typeof key !== 'string' || key.trim() === '') {
    throw new Error('Invalid key: Key must be a non-empty string.');
  }
  return key.replace(/:/g, '__')
}