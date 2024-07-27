"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { listNonFriends } from "@/api/list-non-friends";
import { sendFriendshipRequest } from "@/api/send-friendship-request";
import { useAuthStore } from "@/lib/store/authStore";

interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  isAdmin: boolean;
  created_at: string;
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const rehydrated = useAuthStore((state) => state.rehydrated);

  useEffect(() => {
    if (!rehydrated) return;

    if (!token) {
      router.push("/auth/sign-in");
    } else {
      fetchUsers();
    }
  }, [token, rehydrated]);

  const fetchUsers = async () => {
    try {
      const response = await listNonFriends();
      setUsers(response.data.nonFriends);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFriendshipRequest = async (friendId: string) => {
    try {
      const frienshipRequestResponse = await sendFriendshipRequest(friendId);
      console.log({ frienshipRequestResponse });
      alert("Friendship request sent!");
    } catch (error) {
      console.error("Error sending friendship request:", error);
    }
  };

  if (!rehydrated || loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id} className="flex justify-between items-center mb-4">
            <span>{user.name}</span>
            <button
              onClick={() => handleFriendshipRequest(user.id)}
              className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
            >
              Send Friendship Request
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
