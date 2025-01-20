
const upstashRedisRestUrl= process.env.UPSTASH_REDIS_REST_URL
const upstashRedisRestToken= process.env.UPSTASH_REDIS_REST_TOKEN
type Command ='get'| 'zrange'|'sismember'|'smembers'

//get is by default cacheable in redis so we are creating a function to fetch data from redis with no cache because we want to get the latest data
export async function fetchRedis(
    command:Command,
    ...args:(string|number)[]
){
    const commandUrl= `${upstashRedisRestUrl}/${command}/${args.join('/')}`
    
    const response=await fetch(commandUrl,{
        headers:{

            Authorization:`Bearer ${upstashRedisRestToken}`
        },
        cache:'no-store'
    })
     
    if(!response.ok){
        throw new Error('Error executing Redis command: '+response.statusText)
    }   
  const data=await response.json()
  return data.result

}