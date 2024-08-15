"use client";
import { listUserFriends } from "@/api/list-user-frients";
import { useEffect, useState } from "react";
import { ChatPopOver, Receiver } from "./ChatPopOver";
import classNames from "classnames";
import socket from "../api/websocket-service";
import { EventType } from "@/enums/websocket-events";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const MessagesSideBar = () => {
  const [userFriends, setUserFriends] = useState<Receiver[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [friendInCurrentChat, setFriendInCurrentChat] = useState<Receiver>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    loadUserFriends();
    socket.on(EventType.FRIEND_LOGGED_IN, handleFriendLoggedIn);
    socket.on(EventType.FRIEND_LOGGED_OUT, handleFriendLoggedOut);

    return () => {
      socket.off(EventType.FRIEND_LOGGED_IN, handleFriendLoggedIn);
    };
  }, []);
  function handleFriendLoggedOut(friendId: string) {
    setUserFriends((prevUserFriends) => {
      return prevUserFriends.map((friend: Receiver) => {
        if (friend.id === friendId) {
          return { ...friend, online: false };
        }
        return friend;
      });
    });
  }
  function handleFriendLoggedIn(friendId: string) {
    setUserFriends((prevUserFriends) => {
      return prevUserFriends.map((friend: Receiver) => {
        if (friend.id === friendId) {
          return { ...friend, online: true };
        }
        return friend;
      });
    });
  }

  async function loadUserFriends() {
    const friendsResponse = await listUserFriends();
    setUserFriends(friendsResponse.data.userFriends);
  }
  async function handleChatOpen(friend: Receiver) {
    console.log({ friend });
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
        className={classNames(
          "bg-primary h-screen absolute text-white transition-transform duration-300",
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
          userFriends.map((friend: Receiver) => (
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
