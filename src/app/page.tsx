import { db } from "@/lib/db";
import Image from "next/image";

export default async function Home() {
 
  return (
    <div className=" text-yellow-700 bg-red-500">
      <h1>Chatterbox</h1>
      <p>Chat with your friends!</p>
      <Image src="/chatterbox.png" alt="Chatterbox" width={500} height={500} />

    </div>
  );
}
