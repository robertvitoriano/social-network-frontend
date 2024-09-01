"use client";

import { sendFriendshipRequest } from "@/api/send-friendship-request";
import { sendFriendshipResponse } from "@/api/send-friendship-response";
import { FriendshipStatus } from "@/enums/friendship-status";
import { useFriendshipStore } from "@/lib/store/friendshipStore";
import { Clock, Send, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { useMainStore } from "@/lib/store/mainStore";
export function FriendshipSuggestions() {
  const loading = useMainStore((state) => state.loading);
  const setLoading = useMainStore((state) => state.setLoading);

  useEffect(() => {
    load();
  }, []);
  const router = useRouter();
  const frienshipSugestions = useFriendshipStore(
    (state) => state.friendsSuggestions
  );
  const fetchFriendshipSugestions = useFriendshipStore(
    (state) => state.fetchFriendshipSugestions
  );
  async function load() {
    await fetchFriendshipSugestions();
  }
  const handleFriendshipRequest = async (friendId: string) => {
    try {
      toast("Friendship resquest sent!");
      await sendFriendshipRequest(friendId);
      await fetchFriendshipSugestions();
    } catch (error) {
      console.error("Error sending friendship request:", error);
    }
  };
  const handleFriendshipResponse = async (
    friendshipSugestionId: string,
    status: string
  ) => {
    toast("Friendship response sent!");
    await sendFriendshipResponse(friendshipSugestionId, status);
    await fetchFriendshipSugestions();
  };
  return (
    <div className="flex overflow-auto gap-8 flex-1">
      {frienshipSugestions.map((friendshipSugestion) => (
        <div
          key={friendshipSugestion.id}
          className="flex flex-col gap-4 justify-between items-center mb-4"
        >
          <span>{friendshipSugestion.name}</span>
          <img
            src={friendshipSugestion.avatar}
            className="h-60 w-60 object-cover"
            onClick={() => router.push(`/profile/${friendshipSugestion.id}`)}
          />
          {friendshipSugestion.friendshipRequestStatus === "not_sent" && (
            <button
              onClick={() => handleFriendshipRequest(friendshipSugestion.id)}
              className="flex items-center bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
            >
              <Send className="mr-2" size={18} />
              Send Friendship Request
            </button>
          )}
          {friendshipSugestion.friendshipRequestStatus === "sent" && (
            <span className="flex items-center text-black">
              <Clock className="mr-2" size={18} />
              Friendship request pending
            </span>
          )}
          {friendshipSugestion.friendshipRequestStatus === "received" && (
            <div className="flex flex-1 flex-col gap-2 pt-2">
              <User className="mr-2" size={18} />
              <span className="text-sm">wants to be your friend!</span>
              <div className="flex justify-around">
                <div className="p-2">
                  <span
                    className="cursor-pointer hover:underline"
                    onClick={() =>
                      handleFriendshipResponse(
                        friendshipSugestion.id,
                        FriendshipStatus.REJECTED
                      )
                    }
                  >
                    Ignore
                  </span>
                </div>
                <div className="text-primary p-2 border-2 border-primary rounded-full">
                  <span
                    className="cursor-pointer"
                    onClick={() =>
                      handleFriendshipResponse(
                        friendshipSugestion.id,
                        FriendshipStatus.ACCEPTED
                      )
                    }
                  >
                    Accept
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
      {frienshipSugestions.length === 0 && <h1>No friend sugestion for now</h1>}
    </div>
  );
}
