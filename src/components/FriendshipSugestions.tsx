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
      toast("Friendship request sent!");
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
    <div className="overflow-x-auto overflow-y-hidden flex-1 border-b-[3px] border-primary p-4">
      <div className="flex gap-4">
        {frienshipSugestions.map((friendshipSugestion) => (
          <div
            key={friendshipSugestion.id}
            className="flex flex-col items-center gap-2 p-4 rounded-lg bg-primary text-white mt-4"
            style={{ width: "200px" }}
          >
            <span className="text-center font-medium whitespace-nowrap">
              {friendshipSugestion.name}
            </span>

            <img
              src={friendshipSugestion.avatar}
              className="h-24 w-24 object-cover rounded-full"
              onClick={() => router.push(`/profile/${friendshipSugestion.id}`)}
            />
            {friendshipSugestion.friendshipRequestStatus === "not_sent" && (
              <button
                onClick={() => handleFriendshipRequest(friendshipSugestion.id)}
                className="text-center flex gap-4 h-12 px-4 items-center justify-around bg-blue-500 rounded-md hover:bg-blue-600"
              >
                <Send className="mr-2" size={18} />
                add friend
              </button>
            )}
            {friendshipSugestion.friendshipRequestStatus === "sent" && (
              <div className="text-center flex gap-4 h-12 px-4 items-center justify-around bg-gray-500 rounded-md ">
                <Clock size={30} />
                <div>Friendship pending</div>
              </div>
            )}
            {friendshipSugestion.friendshipRequestStatus === "received" && (
              <div className="text-center flex gap-4 h-14 px-2 items-center justify-around bg-primary rounded-md ">
                <div className="flex gap-4">
                  <div className=" bg-red-400 p-2 rounded-md">
                    <span
                      className="cursor-pointer text-white hover:underline"
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
                  <div className=" bg-green-400  rounded-md p-2">
                    <span
                      className="cursor-pointer text-white hover:underline"
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
      </div>

      {frienshipSugestions.length === 0 && (
        <h1 className="text-center mt-4">No friend suggestions for now</h1>
      )}
    </div>
  );
}
