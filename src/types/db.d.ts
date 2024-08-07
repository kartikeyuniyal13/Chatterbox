interface User{
    name:string,
    email:string,
    image:string,
    id:string
}

interface Chat{
    id:string,
    messages:Message[],
}

interface Message{
    id:string,
    receiverId:string,
    senderId:string,
    text:string,
   timestamp:number //unix timestamp
}

interface FriendRequest{
    id:string,
    senderId:string,
    receiverId:string,
}