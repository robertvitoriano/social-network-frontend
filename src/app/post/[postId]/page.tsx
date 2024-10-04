"use client";

import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Spinner } from "@/components/Spinner";
import { IPost, Post } from "@/components/Post";
import { useAuthStore } from "@/lib/store/authStore";
import { getPost } from "@/api/get-post";
const PostPage = () => {
  const params = useParams<{ postId: string }>();
  const [post, setPost] = useState<IPost>();
  const [loading, setLoading] = useState(false);
  const [isLoggedUserProfile, setIsLoggedUserProfile] = useState(false);

  const loggedUser = useAuthStore((state) => state.loggedUser);

  useEffect(() => {
    loadPost();
  }, []);
  const postId = params.postId;

  const loadPost = async () => {
    const postReponse = await getPost(postId);
    setPost(postReponse.data);
  };
  if (loading) return <Spinner />;

  return (
    <div className="bg-secondary text-white flex flex-1 flex-col h-screen">
      {post && <Post key={post?.id} post={post} />}
    </div>
  );
};

export default PostPage;
