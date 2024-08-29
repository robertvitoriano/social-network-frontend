"use client";

import { LoggedUser } from "@/lib/store/authStore";
import { MoreHorizontal, Heart, MessageSquare, Share2 } from "lucide-react";
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
      <div className="bg-primary rounded-md shadow-md p-4">
        <div className="flex justify-around text-white">
          <div className="flex items-center gap-2 cursor-pointer">
            <Heart className="w-5 h-5" />
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
