import PusherServer from 'pusher';
import PusherClient from 'pusher-js';   

export const pusherServer=new PusherServer({
    appId: process.env.NEXT_PUBLIC_PUSHER_APP_ID!,
    key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    /*enable Transport Layer Security (TLS) for connections between your server and the Pusher service. */
    useTLS: true,
})

export const pusherClient=new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
})