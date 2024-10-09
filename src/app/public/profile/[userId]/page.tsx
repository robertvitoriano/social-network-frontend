"use client";

import { listUserFeedPosts } from "@/api/get-feed-posts";
import { getProfile } from "@/api/get-profile";
import { listUserTimelinePosts } from "@/api/list-user-timeline-posts";
import { IPost, Post } from "@/components/Post";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState<{
    id: string;
    name: string;
    avatar: string;
    friendshipId?: string;
    cover: string;
  }>();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState<boolean>();
  const params = useParams<{ userId: string }>();

  useEffect(() => {
    const userId = params.userId;
    if (userId) {
      loadProfile(userId);
    }
  }, []);

  const loadProfile = async (userId: string) => {
    try {
      const userPostsResponse = await listUserTimelinePosts(userId);

      setPosts([...posts, ...userPostsResponse.data.posts]);

      await setFriendProfile(userId);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };
  const setFriendProfile = async (userId: string) => {
    const {
      data: { profile, friendshipId, avatar, cover },
    } = await getProfile(userId);
    setUser({ ...profile, friendshipId: friendshipId });
  };

  return (
    <div className="bg-secondary text-white flex flex-1 flex-col h-screen">
      {user ? (
        <div>
          <div
            className="relative border-b border-black flex h-52 lg:h-80"
            style={{
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundImage: `URL(${user.cover})`,
            }}
          >
            <div className="flex flex-col gap-4 absolute w-full items-start p-4 pl-2 -bottom-[60px] lg:flex-row lg:-bottom-[100px] lg:items-center">
              <div
                style={{
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundImage: `URL(${user.avatar})`,
                }}
                className="h-36 w-36 relative rounded-full border-solid border-4 border-white"
              ></div>
            </div>
          </div>
          <div className="flex justify-between mt-14 pl-4 lg:mt-24">
            <div className="flex-col gap-1 flex">
              <h2 className="text-2xl">{user.name}</h2>
              <h2 className="text-base">
                <span className="font-bold">1.6 th </span> friends
              </h2>
            </div>
          </div>
          <Tabs defaultValue="timeline" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-primary">
              <TabsTrigger value="timeline">timeline</TabsTrigger>
              <TabsTrigger value="media">media</TabsTrigger>
            </TabsList>
            <TabsContent value="timeline">
              <div>
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
                  <div className="p-4 text-2xl font-bold bg-primary rounded-lg text-center w-full">Photos</div>
                  <div className="p-4">
                    <span className="text-center">No photos found</span>
                  </div>
                </div>
                <div>
                  <div className="p-4 text-2xl font-bold bg-primary rounded-lg text-center w-full">Videos</div>
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
export default Profile;
