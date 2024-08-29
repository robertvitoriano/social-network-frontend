"use client";

import { useState } from "react";
import { MoreHorizontal, Heart, Share2, MessageSquare } from "lucide-react";

export interface IPost {
  content: string;
  createdAt: string;
  id: string;
  creator: {
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
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const toggleLike = () => {
    setLiked(!liked);
    setLikeCount(likeCount + (liked ? -1 : 1));
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex justify-between">
          <div className="flex gap-4 items-center">
            <img src={post.creator.avatar} className="h-12 w-12 rounded-full" />
            <div>
              <h2 className="text-base font-bold">{post.creator.name}</h2>
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
      <p>{post.content}</p>
      <div className="flex justify-between">
        <div className="flex gap-1">
          <Heart
            className={`w-5 h-5 ${
              likeCount > 0 ? "fill-current text-red-500" : "hidden"
            } `}
          />
          {likeCount > 0 && likeCount}
        </div>
        <div className="flex gap-4">
          <div>3 comments</div>
          <div>1 share</div>
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
      </div>
    </div>
  );
}
