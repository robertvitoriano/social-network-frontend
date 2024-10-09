"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { useMainStore } from "@/lib/store/mainStore";
import { Spinner } from "@/components/Spinner";
import { useBeforeUnload } from "@/lib/hooks/useBeforeUnload";
import socket from "@/api/websocket-service";
import { EventType } from "@/enums/websocket-events";
import { IPost, Post } from "@/components/Post";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createUserPost } from "@/api/create-user-post";
import { FriendshipSuggestions } from "@/components/FriendshipSugestions";
import { listUserFeedPosts } from "@/api/get-feed-posts";

export default function Home() {
  const [newPostContent, setNewPostContent] = useState<string>("");
  const [posts, setPosts] = useState<IPost[]>([]);

  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const loggedUser = useAuthStore((state) => state.loggedUser);
  const rehydrated = useAuthStore((state) => state.rehydrated);

  const loading = useMainStore((state) => state.loading);
  const setLoading = useMainStore((state) => state.setLoading);

  useBeforeUnload(() => {
    socket.emit(EventType.USER_OFFLINE, { userId: loggedUser.id });
  });

  useEffect(() => {
    if (!rehydrated) return;

    if (!token) {
      router.push("/auth/sign-in");
    } else {
      socket.emit(EventType.USER_ONLINE, { userId: loggedUser.id });
      fetchFeedPosts();
    }
  }, [token, rehydrated]);

  const handleOffline = () => {};
  const handlePostCreation = async () => {
    if (!newPostContent.trim()) {
      console.error("Cannot create a post with empty content.");
      return;
    }

    try {
      const currentTime = new Date();
      setPosts([
        {
          id: loggedUser.id,
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
        timelinedOwnerId: loggedUser.id,
      });

      setNewPostContent("");
    } catch (error) {
      console.error("Error creating user post:", error);
    } finally {
      setLoading(false);
    }
  };
  async function fetchFeedPosts() {
    const timelinePostsResponse = await listUserFeedPosts(loggedUser.id);

    setPosts(timelinePostsResponse.data.posts);
    setLoading(false);
  }
  return (
    <>
      {loading && <Spinner />}
      {!loading && (
        <div>
          <FriendshipSuggestions />
          <div>
            <div className="mt-4 p-4 flex flex-col gap-4">
              <div className="flex gap-4">
                <img src={loggedUser.avatar} className="h-14 w-14 rounded-full" />
                <Input
                  className="bg-primary h-14 text-white"
                  placeholder={"Tell your friends what you think!"}
                  value={newPostContent}
                  onChange={(event) => setNewPostContent(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handlePostCreation();
                    }
                  }}
                />
              </div>

              <Button onClick={handlePostCreation}>Create post!</Button>
            </div>
            <div className="p-4 flex flex-col gap-4">
              {posts.map((post) => (
                <Post key={post.id} post={post} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
