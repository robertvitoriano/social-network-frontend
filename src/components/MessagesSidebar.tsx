"use client";
import { listUserFriends } from "@/api/list-user-frients";
import { useEffect, useState } from "react";
import { ChatPopOver, Receiver } from "./ChatPopOver";
export const MessagesSideBar = () => {
  const [userFriends, setUserFriends] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [friendInCurrentChat, setFriendInCurrentChat] = useState<Receiver>();
  useEffect(() => {
    loadUserFriends();
  }, []);

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
              <span>{friend.name}</span>
            </div>
            <div>
              <p>
                Última mensagem enviada por julio, Última mensagem enviada por
                julio...
              </p>
            </div>
          </div>
        ))}
      </div>
      {friendInCurrentChat && showChat && (
        <ChatPopOver receiver={friendInCurrentChat} onClose={handleChatClose} />
      )}
    </>
  );
};
