"use client";

import { Fragment, useState, useEffect } from "react";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { Session } from "next-auth";
import Image from "next/image";
import Button, { buttonVariants } from "./ui/Button";
import { Icons } from "./Icons";
import SidebarChatList from "./SidebarChatList";
import SignOutButton from "./SignOutButton";
import FriendRequestSidebarOptions from "./FriendRequestSidebarOptions";

interface PropTypes {
   friends: User[];
   session: Session;
   sidebarOptions: SidebarOption[];
   unseenRequestCount: number;
}

const MobileChatLayout = ({
   friends,
   session,
   sidebarOptions,
   unseenRequestCount,
}: PropTypes) => {
   const [open, setOpen] = useState(false);
   const pathname = usePathname();

   useEffect(() => {
      setOpen(false);
   }, [pathname]);

   return (
      <div className="fixed bg-white border-b border-zinc-200 top-0 inset-x-0 py-2 px-4 shadow-sm">
         <div className="w-full flex justify-between items-center">
            <Link
               href="/dashboard"
               className={buttonVariants({ variant: "ghost" })}
            >
               <span className="text-xl font-bold text-primary tracking-wide">
                  Chatterbox
               </span>
               <Icons.Logo className="h-6 w-auto text-teal-600" />
            </Link>
            <Button onClick={() => setOpen(true)} className="gap-4">
               Menu <Menu className="h-6 w-6" />
            </Button>
         </div>
         
         <Transition show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={setOpen}>
               <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
               
               <div className="fixed inset-0 overflow-hidden">
                  <div className="absolute inset-0 overflow-hidden">
                     <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10">
                        <TransitionChild
                           as={Fragment}
                           enter="transform transition ease-in-out duration-500 sm:duration-700"
                           enterFrom="-translate-x-full"
                           enterTo="translate-x-0"
                           leave="transform transition ease-in-out duration-500 sm:duration-700"
                           leaveFrom="translate-x-0"
                           leaveTo="-translate-x-full"
                        >
                           <DialogPanel className="pointer-events-auto w-screen max-w-md">
                              <div className="flex h-full flex-col overflow-hidden bg-white py-6 shadow-2xl rounded-r-lg">
                                 <div className="px-4 sm:px-6">
                                    <div className="flex items-start justify-end">
                                    
                                       <div className="ml-3 flex h-7 items-center">
                                          <button
                                             type="button"
                                             className="rounded-md text-gray-400 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                                             onClick={() => setOpen(false)}
                                          >
                                             <span className="sr-only">Close panel</span>
                                             <X className="h-6 w-6" aria-hidden="true" />
                                          </button>
                                       </div>
                                    </div>
                                 </div>

                                 <div className="relative mt-6 flex-1 px-4 sm:px-6">
                                    {/* Content */}
                                    {friends.length > 0 && (
                                       <div className="text-sm font-bold leading-6 text-primary">
                                          Your Chats
                                       </div>
                                    )}

                                    <nav className="flex flex-1 flex-col">
                                       <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                          <li>
                                             <SidebarChatList
                                                friends={friends}
                                                sessionId={session.user.id}
                                             />
                                          </li>

                                          <li>
                                             <div className="text-xs font-semibold text-gray-400">
                                                Overview
                                             </div>
                                             <ul role="list" className="-mx-2 mt-2 space-y-1">
                                                {sidebarOptions.map((option) => {
                                                   const Icon = Icons[option.Icon as keyof typeof Icons];
                                                   return (
                                                      <li key={option.name}>
                                                         <Link
                                                            href={option.href}
                                                            className="text-gray-700 hover:text-primary hover:bg-gray-100 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors"
                                                         >
                                                            <span className="text-gray-400 border-gray-200 group-hover:border-primary group-hover:text-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
                                                               <Icon className="h-4 w-4" />
                                                            </span>
                                                            <span className="truncate">{option.name}</span>
                                                         </Link>
                                                      </li>
                                                   );
                                                })}

                                                <li>
                                                   <FriendRequestSidebarOptions
                                                      initialUnseenRequestCount={unseenRequestCount}
                                                      sessionId={session.user.id}
                                                   />
                                                </li>
                                             </ul>
                                          </li>

                                          <li className="-ml-6 mt-auto flex items-center">
                                             <div className="flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900">
                                                <div className="relative h-8 w-8 bg-gray-100">
                                                   <Image
                                                      fill
                                                      referrerPolicy="no-referrer"
                                                      className="rounded-full object-cover"
                                                      src={session.user.image || ""}
                                                      alt="Your profile picture"
                                                   />
                                                </div>

                                                <div className="flex flex-col">
                                                   <span>{session.user.name}</span>
                                                   <span className="text-xs text-gray-400">
                                                      {session.user.email}
                                                   </span>
                                                </div>
                                             </div>

                                             <SignOutButton className="h-full aspect-square" />
                                          </li>
                                       </ul>
                                    </nav>
                                    {/* Content end */}
                                 </div>
                              </div>
                           </DialogPanel>
                        </TransitionChild>
                     </div>
                  </div>
               </div>
            </Dialog>
         </Transition>
      </div>
   );
};

export default MobileChatLayout;