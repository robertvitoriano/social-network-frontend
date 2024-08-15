"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { listNonFriends } from "@/api/list-non-friends";
import { sendFriendshipRequest } from "@/api/send-friendship-request";
import { useAuthStore } from "@/lib/store/authStore";
import { Send, Clock, User } from "lucide-react";
import { FriendshipStatus } from "@/enums/friendship-status";
import { sendFriendshipResponse } from "@/api/send-friendship-response";
import { toast } from "sonner";

interface NonFriend {
  id: string;
  name: string;
  email: string;
  username: string;
  isAdmin: boolean;
  friendshipRequestStatus: string;
  avatar: string;
  created_at: string;
}

export default function Home() {
  const [nonFriends, setNonFriends] = useState<NonFriend[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const rehydrated = useAuthStore((state) => state.rehydrated);

  useEffect(() => {
    if (!rehydrated) return;

    if (!token) {
      router.push("/auth/sign-in");
    } else {
      fetchNonFriends();
    }
  }, [token, rehydrated]);

  const fetchNonFriends = async () => {
    try {
      const response = await listNonFriends();
      setNonFriends(response.data.nonFriends);
    } catch (error) {
      console.error("Error fetching nonFriends:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleFriendshipResponse = async (
    nonFriendId: string,
    status: string
  ) => {
    toast("Friendship response sent!");
    await sendFriendshipResponse(nonFriendId, status);
    await fetchNonFriends();
  };
  const handleFriendshipRequest = async (friendId: string) => {
    try {
      toast("Friendship response sent!");
      await sendFriendshipRequest(friendId);
      await fetchNonFriends();
    } catch (error) {
      console.error("Error sending friendship request:", error);
    }
  };

  return (
    <main className="flex h-screen flex-col p-10 bg-secondary text-white overflow-hidden">
      <h1 className="text-center mb-10">Sugestions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 overflow-auto">
        {nonFriends.map((nonFriend) => (
          <div
            key={nonFriend.id}
            className="flex flex-col gap-4 justify-between items-center mb-4"
          >
            <span>{nonFriend.name}</span>
            <img src={nonFriend.avatar} className="h-60 w-60 object-cover" />
            {nonFriend.friendshipRequestStatus === "not_sent" && (
              <button
                onClick={() => handleFriendshipRequest(nonFriend.id)}
                className="flex items-center bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
              >
                <Send className="mr-2" size={18} />
                Send Friendship Request
              </button>
            )}
            {nonFriend.friendshipRequestStatus === "sent" && (
              <span className="flex items-center text-black">
                <Clock className="mr-2" size={18} />
                Friendship request pending
              </span>
            )}
            {nonFriend.friendshipRequestStatus === "received" && (
              <div className="flex flex-1 flex-col gap-2 pt-2">
                <User className="mr-2" size={18} />
                <span className="text-sm">wants to be your friend!</span>
                <div className="flex justify-around">
                  <div className="p-2 ">
                    <span
                      className="cursor-pointer hover:underline"
                      onClick={() =>
                        handleFriendshipResponse(
                          nonFriend.id,
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
                          nonFriend.id,
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
        {nonFriends.length === 0 && <h1>No friend sugestion for now</h1>}
      </div>
    </main>
  );
}
