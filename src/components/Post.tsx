"use client";

import { useState } from "react";
import { MoreHorizontal, Heart, Share2, MessageSquare, SendHorizonal } from "lucide-react";
import { togglePostLike } from "@/api/toggle-post-like";
import { Input } from "./ui/input";
import { useAuthStore } from "@/lib/store/authStore";
import { createPostComment } from "@/api/create-post-comment";
import { Comment } from "./Comment";
import { useRouter } from "next/navigation";
import classNames from "classnames";
export interface IComment {
  id?: string;
  content: string;
  userId: string;
  postId: string;
  createdAt: Date;
  likesCount: number;
  replies?: IComment[];
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
  sharesCount: number;
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
  const [commentsCount, setCommentscount] = useState(post.commentsCount);
  const [sharesCount, setSharescount] = useState(post.sharesCount || 0);
  const [newCommentContent, setNewCommentContent] = useState("");
  const [lastComment, setLastComment] = useState<IComment | null>(post.lastComment);
  const loggedUser = useAuthStore((state) => state.loggedUser);

  const router = useRouter();
  const toggleLike = async () => {
    setLiked(!liked);
    setLikeCount(likeCount + (liked ? -1 : 1));
    await togglePostLike(post.id);
  };
  const handleCommentCreationOneEnter = async (event: { key: string }) => {
    if (event.key === "Enter") {
      handleCommentCreation();
    }
  };
  const handleCommentCreation = async () => {
    setCommentscount(commentsCount + 1);
    setLastComment({
      user: loggedUser,
      content: newCommentContent,
      userId: post.user.id,
      postId: post.id,
      createdAt: new Date(),
      likesCount: 0,
    });
    await createPostComment({ content: newCommentContent, postId: post.id });
    setNewCommentContent("");
  };
  const handlePostPageRedirect = () => {
    router.push(`/post/${post.id}`);
  };
  const mockReplies = [
    {
      id: "reply1",
      content: "I totally agree with your point of view. It's spot on!",
      userId: "user1",
      postId: "post1",
      createdAt: new Date("2023-10-01T12:34:56"),
      likesCount: 15,
      user: {
        id: "user1",
        email: "user1@example.com",
        name: "John Doe",
        avatar: loggedUser.avatar,
      },
    },
    {
      id: "reply2",
      content: "I think you missed an important aspect of the discussion.",
      userId: "user2",
      postId: "post1",
      createdAt: new Date("2023-10-02T09:24:12"),
      likesCount: 8,
      user: {
        id: "user2",
        email: "user2@example.com",
        name: "Jane Smith",
        avatar: loggedUser.avatar,
      },
    },
    {
      id: "reply3",
      content: "This topic is really interesting, thanks for sharing!",
      userId: "user3",
      postId: "post2",
      createdAt: new Date("2023-10-03T14:45:33"),
      likesCount: 25,
      user: {
        id: "user3",
        email: "user3@example.com",
        name: "Alex Johnson",
        avatar: loggedUser.avatar,
      },
    },
    {
      id: "reply4",
      content: "I have a different take on this. Here's my perspective...",
      userId: "user4",
      postId: "post3",
      createdAt: new Date("2023-10-04T11:12:05"),
      likesCount: 12,
      user: {
        id: "user4",
        email: "user4@example.com",
        name: "Emily Davis",
        avatar: loggedUser.avatar,
      },
    },
    {
      id: "reply5",
      content: "Can you elaborate on your last point? It’s not clear to me.",
      userId: "user5",
      postId: "post2",
      createdAt: new Date("2023-10-05T18:37:29"),
      likesCount: 4,
      user: {
        id: "user5",
        email: "user5@example.com",
        name: "Michael Brown",
        avatar: loggedUser.avatar,
      },
    },
  ];
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex justify-between p-4">
          <div className="flex gap-4 items-center hover:underline cursor-pointer" onClick={handlePostPageRedirect}>
            <img src={post.user.avatar} className="h-12 w-12 rounded-full" />
            <div>
              <h2 className="text-base font-bold">{post.user.name}</h2>
              <h2 className="text-xs">
                {new Date(post.createdAt).toLocaleDateString() + " - " + new Date(post.createdAt).toLocaleTimeString()}
              </h2>
            </div>
          </div>
          <MoreHorizontal />
        </div>
      </div>
      <p className="p-4">{post.content}</p>
      <div className="flex justify-between px-2 pb-1">
        <div className="flex gap-1">
          <div
            className={classNames("bg-red-500 rounded-full p-1 justify-center items-center", {
              flex: likeCount > 0,
              hidden: likeCount == 0,
            })}
          >
            <Heart className={"w-4 h-4 fill-current text-white"} />
          </div>
          {likeCount > 0 && likeCount}
        </div>
        <div className="flex gap-4">
          {commentsCount > 0 && (
            <div className="hover:underline" onClick={handlePostPageRedirect}>
              {commentsCount} comments
            </div>
          )}
          {sharesCount > 0 && <div className="hover:underline">{sharesCount} share</div>}
        </div>
      </div>
      <div className="bg-primary rounded-md shadow-md p-4">
        <div className="flex justify-around text-white">
          <div className="flex items-center gap-2 cursor-pointer" onClick={toggleLike}>
            <Heart className={`w-5 h-5 ${liked ? "fill-current text-red-500" : ""}`} />
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
          {lastComment && <Comment comment={{ replies: mockReplies, ...lastComment }} />}
          {post.comments?.map((comment) => (
            <Comment comment={{ replies: mockReplies, ...comment }} />
          ))}
          <div className="flex gap-4">
            <img src={loggedUser.avatar} className="h-10 w-10 rounded-full" />
            <Input
              className="bg-primary  text-white"
              placeholder="Write a comment..."
              value={newCommentContent}
              onChange={(event) => setNewCommentContent(event.target.value)}
              onKeyDown={handleCommentCreationOneEnter}
            />

            <SendHorizonal className="mr-2" size={40} onClick={handleCommentCreation} />
          </div>
        </div>
      </div>
    </div>
  );
}
