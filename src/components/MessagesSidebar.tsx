"use client";
import { useEffect, useState, useRef } from "react";
import { ChatPopOver } from "./ChatPopOver";
import classNames from "classnames";
import socket from "../api/websocket-service";
import { EventType } from "@/enums/websocket-events";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { IUserFriend, useFriendshipStore } from "@/lib/store/friendshipStore";

export const MessagesSideBar = () => {
  const [showChat, setShowChat] = useState(false);
  const [friendInCurrentChat, setFriendInCurrentChat] = useState<IUserFriend>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const fetchUserFriends = useFriendshipStore(
    (state) => state.fetchUserFriends
  );
  const setUserFriends = useFriendshipStore((state) => state.setUserFriends);
  const userFriends = useFriendshipStore((state) => state.userFriends);

  useEffect(() => {
    fetchUserFriends();
    socket.on(EventType.FRIEND_LOGGED_IN, handleFriendLoggedIn);
    socket.on(EventType.FRIEND_LOGGED_OUT, handleFriendLoggedOut);

    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      socket.off(EventType.FRIEND_LOGGED_IN, handleFriendLoggedIn);
      socket.off(EventType.FRIEND_LOGGED_OUT, handleFriendLoggedOut);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    setShowChat(true);
    setFriendInCurrentChat(friend);
  }

  function handleChatClose() {
    setShowChat(false);
  }

  function toggleSidebar() {
    setIsSidebarOpen(!isSidebarOpen);
  }

  return (
    <>
      <div
        ref={sidebarRef}
        className={classNames(
          "bg-primary h-screen absolute text-white transition-transform duration-300 z-40",
          {
            "right-0 w-72": isSidebarOpen,
            "-right-64 w-72": !isSidebarOpen,
          }
        )}
      >
        <div
          className="p-2 cursor-pointer hover:bg-black"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? <ChevronRight /> : <ChevronLeft />}
        </div>
        {isSidebarOpen &&
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
      {friendInCurrentChat && showChat && (
        <ChatPopOver receiver={friendInCurrentChat} onClose={handleChatClose} />
      )}
    </>
  );
};
