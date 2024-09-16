"use client";
import { useEffect, useState, useRef } from "react";
import classNames from "classnames";
import socket from "../api/websocket-service";
import { EventType } from "@/enums/websocket-events";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { IUserFriend, useFriendshipStore } from "@/lib/store/friendshipStore";
import { useChatStore } from "@/lib/store/chatStore";
type Props = {
  isMessageSidebarOpen: boolean;
  setIsMessageSidebarOpen: Function;
};
export const MessagesSideBar = ({ isMessageSidebarOpen, setIsMessageSidebarOpen }: Props) => {
  const sidebarRef = useRef<HTMLDivElement>(null);

  const fetchUserFriends = useFriendshipStore((state) => state.fetchUserFriends);
  const setUserFriends = useFriendshipStore((state) => state.setUserFriends);
  const userFriends = useFriendshipStore((state) => state.userFriends);
  const openChatDialog = useChatStore((state) => state.openChatDialog);
  const closeChatDialog = useChatStore((state) => state.closeChatDialog);
  const isChatDialogOpen = useChatStore((state) => state.isChatDialogOpen);

  useEffect(() => {
    fetchUserFriends();
    socket.on(EventType.FRIEND_LOGGED_IN, handleFriendLoggedIn);
    socket.on(EventType.FRIEND_LOGGED_OUT, handleFriendLoggedOut);

    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsMessageSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      socket.off(EventType.FRIEND_LOGGED_IN, handleFriendLoggedIn);
      socket.off(EventType.FRIEND_LOGGED_OUT, handleFriendLoggedOut);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMessageSidebarOpen]);

  function handleFriendLoggedOut(friendId: string) {
    const updatedUserFriends = userFriends.map((friend: IUserFriend) => {
      if (friend.id === friendId) {
        return { ...friend, online: false };
      }
      return friend;
    });
    setUserFriends(updatedUserFriends);
  }

  function handleFriendLoggedIn(friendId: string) {
    const updatedUserFriends = userFriends.map((friend: IUserFriend) => {
      if (friend.id === friendId) {
        return { ...friend, online: true };
      }
      return friend;
    });
    setUserFriends(updatedUserFriends);
  }

  async function handleChatOpen(friend: IUserFriend) {
    if (isChatDialogOpen) {
      closeChatDialog();
      return;
    }
    openChatDialog(friend.id, friend.friendshipId);
  }

  function toggleSidebar() {
    setIsMessageSidebarOpen(!isMessageSidebarOpen);
  }

  return (
    <>
      <div
        ref={sidebarRef}
        className={classNames("bg-primary h-screen absolute text-white z-40 overflow-y-auto", {
          "right-0 w-72": isMessageSidebarOpen,
          hidden: !isMessageSidebarOpen,
        })}
      >
        <div className="p-2 cursor-pointer hover:bg-black text-white" onClick={toggleSidebar}>
          {isMessageSidebarOpen && <X />}
        </div>
        {isMessageSidebarOpen &&
          userFriends.map((friend: IUserFriend) => (
            <div
              className="w-full border-2 flex gap-4 flex-col border-white p-4 cursor-pointer"
              onClick={() => handleChatOpen(friend)}
              key={friend.id}
            >
              <div className="flex gap-4 items-center">
                <img className="rounded-full h-12 w-12" src={friend.avatar} />
                <div className="flex gap-4 items-center">
                  <span>{friend.name}</span>
                  <div
                    className={classNames(
                      "w-3",
                      "h-3",
                      { "bg-green-500": friend.online },
                      { "bg-secondary": !friend.online },
                      "rounded-full"
                    )}
                  ></div>
                </div>
              </div>
              <div>
                <p>{friend.lastMessage}</p>
              </div>
              <span className="text-right">
                {new Date(friend.lastMessageCreatedAt).toLocaleDateString() +
                  " - " +
                  new Date(friend.lastMessageCreatedAt).toLocaleTimeString()}
              </span>
            </div>
          ))}
      </div>
    </>
  );
};
