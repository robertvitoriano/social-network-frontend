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
    <div className="bg-secondary text-white flex flex-1 flex-col">
      {user ? (
        <>
          <div
            className="relative border-b border-black flex h-52 lg:h-80"
            style={{
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundImage:
                'URL("https://images.ctfassets.net/hrltx12pl8hq/28ECAQiPJZ78hxatLTa7Ts/2f695d869736ae3b0de3e56ceaca3958/free-nature-images.jpg?fit=fill&w=1200&h=630")',
            }}
          >
            <div className="flex flex-col gap-4 absolute w-full items-start lg:flex-row  -bottom-[60px] lg:-bottom-[280px] p-4 pl-2">
              <img
                src={user.avatar}
                className="h-36 w-36 rounded-full border-solid border-4 border-white"
              />
              <div className="flex-col gap-1 hidden lg:flex">
                <h2 className="text-2xl">{user.name}</h2>
                <h2 className="text-base">
                  <span className="font-bold">1.6 th </span> friends
                </h2>
              </div>
            </div>
          </div>
          <div className="flex-col gap-1 flex mt-10">
            <h2 className="text-2xl">{user.name}</h2>
            <h2 className="text-base">
              <span className="font-bold">1.6 th </span> friends
            </h2>
          </div>
          <div className="p-4 pr-12 flex flex-col gap-4">
            <div className="h-32 w-full bg-primary"></div>
            <div className="h-32 w-full bg-primary"></div>
            <div className="h-32 w-full bg-primary"></div>
            <div className="h-32 w-full bg-primary"></div>
            <div className="h-32 w-full bg-primary"></div>
            <div className="h-32 w-full bg-primary"></div>
            <div className="h-32 w-full bg-primary"></div>
            <div className="h-32 w-full bg-primary"></div>
            <div className="h-32 w-full bg-primary"></div>
            <div className="h-32 w-full bg-primary"></div>
            <div className="h-32 w-full bg-primary"></div>
            <div className="h-32 w-full bg-primary"></div>
            <div className="h-32 w-full bg-primary"></div>
          </div>
        </>
      ) : (
        <p>User not found</p>
      )}
    </div>
  );
};

export default UserProfile;
