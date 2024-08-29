"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getProfile } from "@/api/get-profile";
import { Spinner } from "@/components/Spinner";
import { MessageCircleMore, UserCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { IPost, Post } from "@/components/Post";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { listUserFeedPosts } from "@/api/list-user-feed-posts";
import { Button } from "@/components/ui/button";
import { createUserPost } from "@/api/create-user-post";
import { useAuthStore } from "@/lib/store/authStore";

const UserProfile = () => {
  const params = useParams<{ userId: string }>();
  const [user, setUser] = useState<{ name: string; avatar: string }>();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [friendPostContent, setFriendPostContent] = useState("");
  const loggedUser = useAuthStore((state) => state.loggedUser);
  useEffect(() => {
    const userId = params.userId;
    if (userId) {
      loadProfile(userId);
    }
  }, [params]);

  const loadProfile = async (userId: string) => {
    try {
      const profileResponse = await getProfile(userId);
      const userPostsResponse = await listUserFeedPosts(userId);
      setUser(profileResponse.data.profile);
      setPosts([...posts, ...userPostsResponse.data.posts]);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreation = async () => {
    try {
      const currentTime = new Date();
      setPosts([
        {
          id: params.userId,
          content: friendPostContent,
          createdAt: currentTime.toISOString(),
          creator: {
            id: loggedUser.id,
            name: loggedUser.name,
            email: loggedUser.email,
            avatar: loggedUser.avatar,
          },
        },
        ...posts,
      ]);
      await createUserPost({
        content: friendPostContent,
        timelinedOwnerId: params.userId,
      });

      setFriendPostContent("");
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="bg-secondary text-white flex flex-1 flex-col h-screen overflow-y-auto overflow-x-hidden">
      {user ? (
        <div>
          <div
            className="relative border-b border-black flex h-52 lg:h-80"
            style={{
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundImage:
                'URL("https://images.ctfassets.net/hrltx12pl8hq/28ECAQiPJZ78hxatLTa7Ts/2f695d869736ae3b0de3e56ceaca3958/free-nature-images.jpg?fit=fill&w=1200&h=630")',
            }}
          >
            <div className="flex flex-col gap-4 absolute w-full items-start p-4 pl-2 -bottom-[60px] lg:flex-row lg:-bottom-[100px] lg:items-center">
              <img
                src={user.avatar}
                className="h-36 w-36 rounded-full border-solid border-4 border-white"
              />
            </div>
          </div>
          <div className="flex justify-between mt-14 pl-4 lg:mt-24">
            <div className="flex-col gap-1 flex">
              <h2 className="text-2xl">{user.name}</h2>
              <h2 className="text-base">
                <span className="font-bold">1.6 th </span> friends
              </h2>
            </div>
            <div className="flex gap-4 p-2">
              <div className="bg-primary p-2 h-fit flex gap-4 rounded-md text-sm items-center">
                <UserCheck />
                Friends
              </div>
              <div className="bg-primary p-2 h-fit flex gap-4 rounded-md text-sm items-center">
                <MessageCircleMore />
                Message
              </div>
            </div>
          </div>
          <Tabs defaultValue="feed" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-primary">
              <TabsTrigger value="feed">feed</TabsTrigger>
              <TabsTrigger value="media">media</TabsTrigger>
            </TabsList>
            <TabsContent value="feed">
              <div>
                <div className="mt-4 p-4 flex flex-col gap-4">
                  <Input
                    className="bg-primary h-14 text-white"
                    placeholder={`Post something in ${user.name} timeline!`}
                    value={friendPostContent}
                    onChange={(event) =>
                      setFriendPostContent(event.target.value)
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        handlePostCreation();
                      }
                    }}
                  />

                  <Button onClick={handlePostCreation}>Post</Button>
                </div>
                <div className="p-4 flex flex-col gap-4">
                  {posts.map((post) => (
                    <Post key={post.id} post={post} />
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="media">
              <div className="flex flex-col gap-4">
                <div>
                  <div className="p-4 text-2xl font-bold bg-primary rounded-lg text-center w-full">
                    Photos
                  </div>
                  <div className="p-4">
                    <span className="text-center">No photos found</span>
                  </div>
                </div>
                <div>
                  <div className="p-4 text-2xl font-bold bg-primary rounded-lg text-center w-full">
                    Videos
                  </div>
                  <div className="p-4">
                    <span className="text-center">No Videos found</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <p>User not found</p>
      )}
    </div>
  );
};

export default UserProfile;
