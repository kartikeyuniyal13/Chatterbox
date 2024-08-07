import { fetchRedis } from "./redis"

export const getFriendById=async (id:string)=>{
const friendIds=await fetchRedis(
    'smembers',
    `user:${id}:friends`
) as string[]

const friends=await Promise.all(friendIds.map(async (friendId)=>{

    const result= await fetchRedis('get',`user:${friendId}`) as string // its a JSON string
    return JSON.parse(result)

}))

return friends
}