"use client";

import { MoreHorizontal, Heart, MessageSquare, Share2 } from "lucide-react";
export interface IPost {
  content: string;
  createdAt: string;
  id: string;
  userId: string;
}

interface Props {
  user: {
    name: string;
    avatar: string;
  };
  post: IPost;
}
export function Post({ user, post }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex justify-between">
          <div className="flex gap-4 items-center">
            <img src={user.avatar} className="h-12 w-12 rounded-full" />
            <div>
              <h2 className="text-base font-bold">{user.name}</h2>
              <h2 className="text-xs">14h</h2>
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
