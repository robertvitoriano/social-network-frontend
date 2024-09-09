"use client";

import { useParams } from "next/navigation";
import { Camera } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { getProfile } from "@/api/get-profile";
import { Spinner } from "@/components/Spinner";
import { MessageCircleMore, UserCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { IPost, Post } from "@/components/Post";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { listUserFeedPosts } from "@/api/list-user-timeline-posts";
import { Button } from "@/components/ui/button";
import { createUserPost } from "@/api/create-user-post";
import { DrawerDialog } from "@/components/DrawerDialog";
import { updateUserProfile } from "@/api/update-user-profile";
import { useAuthStore } from "@/lib/store/authStore";

const UserProfile = () => {
  const params = useParams<{ userId: string }>();
  const [user, setUser] = useState<{ name: string; avatar: string }>();
  const [avatarUrl, setAvatarUrl] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [isLoggedUserProfile, setIsLoggedUserProfile] = useState(false);

  const avatarFileInputRef = useRef<HTMLInputElement>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);

  const loggedUser = useAuthStore((state) => state.loggedUser);
  const setLoggedUser = useAuthStore((state) => state.setLoggedUser);

  useEffect(() => {
    const userId = params.userId;
    if (userId) {
      loadProfile(userId);
    }
  }, [params, loggedUser]);

  const loadProfile = async (userId: string) => {
    try {
      const userPostsResponse = await listUserFeedPosts(userId);
      setPosts([...posts, ...userPostsResponse.data.posts]);
      if (loggedUser.id) {
        if (userId === loggedUser.id) {
          setUser(loggedUser);
          setIsLoggedUserProfile(true);
          return;
        }
        await setFriendProfile(userId);
        return;
      }
      await setFriendProfile(userId);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };
  const setFriendProfile = async (userId: string) => {
    const profileResponse = await getProfile(userId);
    setUser(profileResponse.data.profile);
    setAvatarUrl(profileResponse.data.profile.avatar);
    setCoverUrl(profileResponse.data.profile.cover);
  };
  const handlePostCreation = async () => {
    if (!newPostContent.trim()) {
      console.error("Cannot create a post with empty content.");
      return;
    }

    try {
      const currentTime = new Date();
      setPosts([
        {
          id: params.userId,
          content: newPostContent,
          createdAt: currentTime.toISOString(),
          likesCount: 0,
          commentsCount: 0,
          lastComment: null,
          comments: null,
          sharesCount: 0,
          user: {
            id: loggedUser.id,
            name: loggedUser.name,
            email: loggedUser.email,
            avatar: loggedUser.avatar,
          },
        },
        ...posts,
      ]);
      await createUserPost({
        content: newPostContent,
        timelinedOwnerId: params.userId,
      });

      setNewPostContent("");
    } catch (error) {
      console.error("Error creating user post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenFilePicker = () => {
    avatarFileInputRef.current?.click();
  };

  const handleAvatarFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const file = event.target.files[0];
      if (file) {
        const url = URL.createObjectURL(file) as string;
        setLoggedUser({
          ...loggedUser,
          avatar: avatarUrl!,
        });
        updateUserProfile({ avatar: avatarFileInputRef.current?.files! })
          .then((updatedUser) => {
            if (updatedUser) {
              setLoggedUser(updatedUser);
            }
          })
          .catch(() => {
            setLoggedUser(loggedUser);
          });
        setAvatarUrl(url);
      }
    }
  };
  const handleCoverFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const file = event.target.files[0];
      if (file) {
        const url = URL.createObjectURL(file) as string;
        setLoggedUser({
          ...loggedUser,
          cover: coverUrl!,
        });
        updateUserProfile({ cover: coverFileInputRef.current?.files! })
          .then((updatedUser) => {
            if (updatedUser) {
              setLoggedUser(updatedUser);
            }
          })
          .catch(() => {
            setLoggedUser(loggedUser);
          });
        setCoverUrl(url);
      }
    }
  };
  if (loading) return <Spinner />;

  return (
    <div className="bg-secondary text-white flex flex-1 flex-col h-screen">
      {user ? (
        <div>
          <div
            className="relative border-b border-black flex h-52 lg:h-80"
            style={{
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundImage: `URL(${coverUrl})`,
            }}
          >
            <div className="flex flex-col gap-4 absolute w-full items-start p-4 pl-2 -bottom-[60px] lg:flex-row lg:-bottom-[100px] lg:items-center">
              <div
                style={{
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundImage: `URL(${avatarUrl})`,
                }}
                className="h-36 w-36 relative rounded-full border-solid border-4 border-white"
              >
                { isLoggedUserProfile && <DrawerDialog
                  dialogTitle="Avatar Options"
                  dialogDescription="Select an option for your avatar"
                  trigger={
                    <div className="p-1 flex justify-center items-center absolute right-4 bottom-0 bg-primary border border-green rounded-full">
                      <Camera
                        className="text-secondary h-4 w-4 cursor-pointer"
                        color="white"
                      />
                    </div>
                  }
                  content={
                    <div className="flex flex-col gap-4 pb-4 hover:underline">
                      <Button
                        onClick={() => {
                          console.log("View Avatar clicked");
                        }}
                      >
                        View Avatar
                      </Button>

                      <Button
                        onClick={handleOpenFilePicker}
                        className="flex flex-1"
                      >
                        <label htmlFor="avatar">
                          <input
                            ref={avatarFileInputRef}
                            id="avatar"
                            type="file"
                            className="hidden"
                            onChange={handleAvatarFileChange}
                          />
                          Change Avatar
                        </label>
                      </Button>
                    </div>
                  }
                />}
              </div>
            </div>
            {isLoggedUserProfile && <DrawerDialog
              dialogTitle="Avatar Options"
              dialogDescription="Select an option for your avatar"
              trigger={
                <div className="p-1 flex justify-center items-center absolute right-4 bottom-4 bg-primary border border-white rounded-full">
                  <Camera
                    className="text-secondary h-4 w-4 cursor-pointer"
                    color="white"
                  />
                </div>
              }
              content={
                <div className="flex flex-col gap-4 pb-4 hover:underline">
                  <Button
                    onClick={() => {
                      console.log("View Avatar clicked");
                    }}
                  >
                    View Cover
                  </Button>
                  <Button
                    onClick={handleOpenFilePicker}
                    className="flex flex-1"
                  >
                    <label htmlFor="cover">
                      <input
                        ref={coverFileInputRef}
                        id="cover"
                        type="file"
                        className="hidden"
                        onChange={handleCoverFileChange}
                      />
                      Change Cover
                    </label>
                  </Button>
                </div>
              }
            />}
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
          <Tabs defaultValue="timeline" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-primary">
              <TabsTrigger value="timeline">timeline</TabsTrigger>
              <TabsTrigger value="media">media</TabsTrigger>
            </TabsList>
            <TabsContent value="timeline">
              <div>
                <div className="mt-4 p-4 flex flex-col gap-4">
                  <Input
                    className="bg-primary h-14 text-white"
                    placeholder={
                      isLoggedUserProfile
                        ? "Tell your friends what you think!"
                        : `Post something in ${user.name} timeline!`
                    }
                    value={newPostContent}
                    onChange={(event) => setNewPostContent(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        handlePostCreation();
                      }
                    }}
                  />

                  <Button onClick={handlePostCreation}>Create post!</Button>
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
