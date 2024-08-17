"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { sendFriendshipRequest } from "@/api/send-friendship-request";
import { useAuthStore } from "@/lib/store/authStore";
import { Send, Clock, User } from "lucide-react";
import { FriendshipStatus } from "@/enums/friendship-status";
import { sendFriendshipResponse } from "@/api/send-friendship-response";
import { useFriendshipStore } from "@/lib/store/friendshipStore";
import { toast } from "sonner";
import { useMainStore } from "@/lib/store/mainStore";
import { Spinner } from "@/components/Spinner";

export default function Home() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const rehydrated = useAuthStore((state) => state.rehydrated);
  const frienshipSugestions = useFriendshipStore(
    (state) => state.friendsSuggestions
  );
  const fetchFriendshipSugestions = useFriendshipStore(
    (state) => state.fetchFriendshipSugestions
  );
  const loading = useMainStore((state) => state.loading);

  useEffect(() => {
    if (!rehydrated) return;

    if (!token) {
      router.push("/auth/sign-in");
    } else {
      fetchFriendshipSugestions();
    }
  }, [token, rehydrated]);

  const handleFriendshipResponse = async (
    friendshipSugestionId: string,
    status: string
  ) => {
    toast("Friendship response sent!");
    await sendFriendshipResponse(friendshipSugestionId, status);
    await fetchFriendshipSugestions();
  };
  const handleFriendshipRequest = async (friendId: string) => {
    try {
      toast("Friendship resquest sent!");
      await sendFriendshipRequest(friendId);
      await fetchFriendshipSugestions();
    } catch (error) {
      console.error("Error sending friendship request:", error);
    }
  };

  return (
    <main className="flex h-screen flex-col p-10 bg-secondary text-white overflow-hidden">
      <h1 className="text-center mb-10">Sugestions</h1>
      {loading && <Spinner size={60} />}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 overflow-auto">
          {frienshipSugestions.map((friendshipSugestion) => (
            <div
              key={friendshipSugestion.id}
              className="flex flex-col gap-4 justify-between items-center mb-4"
            >
              <span>{friendshipSugestion.name}</span>
              <img
                src={friendshipSugestion.avatar}
                className="h-60 w-60 object-cover"
              />
              {friendshipSugestion.friendshipRequestStatus === "not_sent" && (
                <button
                  onClick={() =>
                    handleFriendshipRequest(friendshipSugestion.id)
                  }
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
                    <div className="p-2 ">
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
          {frienshipSugestions.length === 0 && (
            <h1>No friend sugestion for now</h1>
          )}
        </div>
      )}
    </main>
  );
}
