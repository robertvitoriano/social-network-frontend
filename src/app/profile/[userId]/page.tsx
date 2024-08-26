"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getProfile } from "@/api/get-profile";

const UserProfile = () => {
  const params = useParams<{ userId: string }>();
  const [user, setUser] = useState<{ name: string; avatar: string }>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = params.userId;
    if (userId) {
      console.log("User ID:", userId);
      loadProfile(userId);
    }
  }, [params]);

  const loadProfile = async (userId: string) => {
    try {
      const profileResponse = await getProfile(userId);
      setUser(profileResponse.data.profile);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-secondary text-white flex flex-1">
      {user ? (
        <div
          className="relative border-b border-black flex flex-1 h-52 lg:h-80"
          style={{
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundImage:
              'URL("https://images.ctfassets.net/hrltx12pl8hq/28ECAQiPJZ78hxatLTa7Ts/2f695d869736ae3b0de3e56ceaca3958/free-nature-images.jpg?fit=fill&w=1200&h=630")',
          }}
        >
          <div className="p-8 flex flex-col gap-4 absolute w-full items-center lg:flex-row lg:-bottom-[280px]">
            <img
              src={user.avatar}
              className="h-60 w-60 rounded-full border-solid border-8 border-white"
            />
            <h2 className="text-4xl">{user.name}</h2>
          </div>
        </div>
      ) : (
        <p>User not found</p>
      )}
    </div>
  );
};

export default UserProfile;
