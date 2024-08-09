"use client";
import { listUserFriends } from "@/api/list-user-frients";
import { useEffect, useState } from "react";
import { ChatPopOver, Receiver } from "./ChatPopOver";
import classNames from "classnames";
import socket from "../api/websocket-service";
import { EventType } from "@/enums/websocket-events";

export const MessagesSideBar = () => {
  const [userFriends, setUserFriends] = useState<Receiver[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [friendInCurrentChat, setFriendInCurrentChat] = useState<Receiver>();
  useEffect(() => {
    loadUserFriends();
    socket.on(EventType.FRIEND_LOGGED_IN, handleFriendLoggedIn);
  }, []);

  function handleFriendLoggedIn(friendId: string) {
    const userFriendsUpdated = userFriends.map((friend: Receiver) => {
      if (friend.id === friendId) {
        return { ...friend, online: true };
      }
      return friend;
    });
    setUserFriends(userFriendsUpdated);
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
  return (
    <>
      <div className="bg-primary w-72 h-screen absolute right-0 text-white">
        {userFriends.map((friend: Receiver) => (
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
