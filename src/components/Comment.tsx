"use client";
import { IComment } from "./Post";
import { toggleCommentLike } from "@/api/toggle-comment-like";
import classNames from "classnames";
import { Heart, SendHorizonal } from "lucide-react";
import { useState } from "react";
import { Input } from "./ui/input";
import { useAuthStore } from "@/lib/store/authStore";
import { createPostComment } from "@/api/create-post-comment";
type Props = {
  comment: IComment;
};
export const Comment = ({ comment }: Props) => {
  const [liked, setLiked] = useState<boolean>(!!comment.likesCount);

  const [likesCount, setLikesCount] = useState<number>(comment.likesCount);
  const [isReplying, setisReplying] = useState<boolean>(false);
  const [newReplyContent, setNewReplyContent] = useState<string>("");
  const [replies, setReplies] = useState<IComment[]>(comment.replies!);
  const loggedUser = useAuthStore((state) => state.loggedUser);

  const toggleLike = async () => {
    setLiked(!liked);
    setLikesCount(likesCount + (liked ? -1 : 1));
    await toggleCommentLike(comment.id!);
  };
  const handleReply = async () => {
    setisReplying(false);
    setNewReplyContent("");
    setReplies([
      ...replies,
      {
        content: newReplyContent,
        postId: comment.postId,
        parentCommentId: comment.id,
        likesCount: 0,
        user: loggedUser,
        userId: loggedUser.id,
        createdAt: new Date(),
      },
    ]);
    await createPostComment({ content: newReplyContent, postId: comment.postId, parentCommentId: comment.id });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 items-center">
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-4">
            <div className="p-4 pt-2 bg-secondary rounded-md relative flex flex-1 flex-col gap-2">
              <div className="flex justify-between items-center">
                <div className="flex gap-4 items-center">
                  <div className="flex flex-col h-10 w-10 ">
                    <img src={comment.user.avatar} className="rounded-full" />
                  </div>
                  <span className="font-bold">{comment.user.name}</span>
                </div>
                <span className="font-bold text-xs">{new Date(comment.createdAt).toLocaleDateString()}</span>
              </div>
              <p>{comment.content}</p>
              {likesCount > 0 && (
                <div className=" flex  gap-2 absolute right-0 -bottom-2">
                  <span>{likesCount}</span>
                  <div
                    className={classNames("bg-red-500 rounded-full p-1 justify-center items-center", {
                      flex: likesCount > 0,
                      hidden: likesCount <= 0,
                    })}
                  >
                    <Heart className={"w-4 h-4 fill-current text-white"} />
                  </div>
                </div>
              )}
              <div className="w-full flex flex-col gap-4 relative">
                <div className="flex gap-4 text-white font-bold">
                  <div onClick={toggleLike} className="cursor-pointer">
                    Like
                  </div>
                  <div className="cursor-pointer" onClick={() => setisReplying(true)}>
                    Reply
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isReplying && (
        <div className="flex gap-4">
          <img src={loggedUser.avatar} className="h-10 w-10 rounded-full" />
          <div className="flex-col w-full">
            <Input
              className="bg-primary  text-white"
              placeholder="write a reply"
              onChange={(e) => setNewReplyContent(e.target.value)}
              value={newReplyContent}
            />
            <span className="cursor-pointer text-sm hover:underline" onClick={() => setisReplying(false)}>
              cancel
            </span>
          </div>
          <SendHorizonal className="mr-2" size={40} onClick={handleReply} />
        </div>
      )}
      {replies?.map((mockReply, index) => (
        <div className="pl-4">
          <Comment comment={mockReply} key={index} />
        </div>
      ))}
    </div>
  );
};
