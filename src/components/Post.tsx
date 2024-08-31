"use client";

import { useState } from "react";
import { MoreHorizontal, Heart, Share2, MessageSquare } from "lucide-react";
import { togglePostLike } from "@/api/toggle-post-like";
import { Input } from "./ui/input";
import { LoggedUser, useAuthStore } from "@/lib/store/authStore";
import { createPostComment } from "@/api/create-post-comment";
import { Comment } from "./Comment";
import { useRouter } from "next/navigation";
export interface IComment {
  id?: string;
  content: string;
  userId: string;
  postId: string;
  createdAt: Date;
  user: {
    id: string;
    email: string;
    name: string;
    avatar: string;
  };
}
export interface IPost {
  id: string;
  content: string;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  lastComment: IComment | null;
  comments: IComment[] | null;
  user: {
    id: string;
    email: string;
    name: string;
    avatar: string;
  };
}

interface Props {
  post: IPost;
}

export function Post({ post }: Props) {
  const [liked, setLiked] = useState(!!post.likesCount);
  const [likeCount, setLikeCount] = useState(post.likesCount);
  const [newCommentContent, setNewCommentContent] = useState("");
  const [lastComment, setLastComment] = useState<IComment | null>(
    post.lastComment
  );

  const loggedUser = useAuthStore((state) => state.loggedUser);

  const router = useRouter();
  const toggleLike = async () => {
    setLiked(!liked);
    setLikeCount(likeCount + (liked ? -1 : 1));
    await togglePostLike(post.id);
  };
  const handleCommentCreation = async (event: { key: string }) => {
    if (event.key === "Enter") {
      setLastComment({
        user: loggedUser,
        content: newCommentContent,
        userId: post.user.id,
        postId: post.id,
        createdAt: new Date(),
      });
      await createPostComment({ content: newCommentContent, postId: post.id });
      setNewCommentContent("");
    }
  };

  const handlePostPageRedirect = () => {
    router.push(`/post/${post.id}`);
  };
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex justify-between p-4">
          <div
            className="flex gap-4 items-center hover:underline cursor-pointer"
            onClick={handlePostPageRedirect}
          >
            <img src={post.user.avatar} className="h-12 w-12 rounded-full" />
            <div>
              <h2 className="text-base font-bold">{post.user.name}</h2>
              <h2 className="text-xs">
                {new Date(post.createdAt).toLocaleDateString() +
                  " - " +
                  new Date(post.createdAt).toLocaleTimeString()}
              </h2>
            </div>
          </div>
          <MoreHorizontal />
        </div>
      </div>
      <p className="p-4">{post.content}</p>
      <div className="flex justify-between px-2 pb-1">
        <div className="flex gap-1">
          <Heart
            className={`w-5 h-5 ${
              likeCount > 0 ? "fill-current text-red-500" : "hidden"
            } `}
          />
          {likeCount > 0 && likeCount}
        </div>
        <div className="flex gap-4">
          <div className="hover:underline" onClick={handlePostPageRedirect}>
            {post.commentsCount} comments
          </div>
          <div className="hover:underline">1 share</div>
        </div>
      </div>
      <div className="bg-primary rounded-md shadow-md p-4">
        <div className="flex justify-around text-white">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={toggleLike}
          >
            <Heart
              className={`w-5 h-5 ${liked ? "fill-current text-red-500" : ""}`}
            />
            <span>Like</span>
          </div>
          <div className="flex items-center gap-2 cursor-pointer">
            <MessageSquare className="w-5 h-5" />
            <span>Comment</span>
          </div>
          <div className="flex items-center gap-2 cursor-pointer">
            <Share2 className="w-5 h-5" />
            <span>Share</span>
          </div>
        </div>
        <div className="p-4 flex flex-col gap-4">
          {lastComment && <Comment comment={lastComment} />}
          {post.comments?.map((comment) => (
            <Comment comment={comment} />
          ))}
          <div className="flex gap-4">
            <img src={loggedUser.avatar} className="h-10 w-10 rounded-full" />
            <Input
              className="bg-primary  text-white"
              placeholder="Write a comment..."
              value={newCommentContent}
              onChange={(event) => setNewCommentContent(event.target.value)}
              onKeyDown={handleCommentCreation}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
