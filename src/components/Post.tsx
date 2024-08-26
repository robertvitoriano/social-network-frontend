"use client";

import { MoreHorizontal, Heart, MessageSquare, Share2 } from "lucide-react";
type Props = {
  user: {
    name: string;
    avatar: string;
  };
};
export function Post({ user }: Props) {
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
      <p>
        Contrary to popular belief, Lorem Ipsum is not simply random text. It
        has roots in a piece of classical Latin literature from 45 BC, making it
        over 2000 years old. Richard McClintock, a Latin professor at
        Hampden-Sydney College in Virginia, looked up one of the more obscure
        Latin words, consectetur, from a Lorem Ipsum passage, and going through
        the cites of the word in classical literature, discovered the
        undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33
        of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by
        Cicero, written in 45 BC. This book is a treatise on the theory of
        ethics,{" "}
      </p>
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
