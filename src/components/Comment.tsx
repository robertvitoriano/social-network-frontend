"use client";
import { IComment } from "./Post";
import { toggleCommentLike } from "@/api/toggle-comment-like";
import classNames from "classnames";
import { Heart } from "lucide-react";
import { useState } from "react";
type Props = {
  comment: IComment;
};
export const Comment = ({ comment }: Props) => {
  const [liked, setLiked] = useState<boolean>(!!comment.likesCount);

  const [likesCount, setLikesCount] = useState<number>(comment.likesCount);
  const toggleLike = async () => {
    setLiked(!liked);
    setLikesCount(likesCount + (liked ? -1 : 1));
    await toggleCommentLike(comment.id!);
  };
  return (
    <div className="flex gap-4 items-center">
      <div className="flex flex-col h-10 w-10 ">
        <img src={comment.user.avatar} className="rounded-full" />
      </div>
      <div className="flex flex-col w-full">
        <div className="p-4 pt-1 bg-secondary rounded-md relative flex flex-1 flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="font-bold">{comment.user.name}</span>
            <span className="font-bold text-xs">
              {new Date(comment.createdAt).toLocaleDateString()}
              {/*  new Date(comment.createdAt).toLocaleTimeString()}  */}
            </span>
          </div>
          <p>{comment.content}</p>
          {likesCount > 0 && (
            <div className=" flex  gap-2 absolute right-0 -bottom-2">
              <span>{likesCount}</span>
              <div
                className={classNames(
                  "bg-red-500 rounded-full p-1 justify-center items-center",
                  { flex: likesCount > 0, hidden: likesCount <= 0 }
                )}
              >
                <Heart className={"w-4 h-4 fill-current text-white"} />
              </div>
            </div>
          )}
        </div>
        <div className="w-full flex justify-start">
          <div className="flex gap-4 text-white font-bold">
            <div onClick={toggleLike}>Like</div>
            <div>Reply</div>
          </div>
        </div>
      </div>
    </div>
  );
};
