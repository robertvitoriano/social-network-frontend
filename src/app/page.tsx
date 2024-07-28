"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { listNonFriends } from "@/api/list-non-friends";
import { sendFriendshipRequest } from "@/api/send-friendship-request";
import { useAuthStore } from "@/lib/store/authStore";
import { Send, Clock } from "lucide-react";

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

  const handleFriendshipRequest = async (friendId: string) => {
    try {
      const frienshipRequestResponse = await sendFriendshipRequest(friendId);
      alert("Friendship request sent!");
    } catch (error) {
      console.error("Error sending friendship request:", error);
    }
  };

  if (!rehydrated || loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex h-screen flex-col p-10">
      <h1 className="text-center mb-10">nonFriends</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
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
          </div>
        ))}
      </div>
    </main>
  );
}
