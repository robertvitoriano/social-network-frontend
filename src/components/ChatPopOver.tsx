"use client";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/lib/store/authStore";
import classNames from "classnames";
import { SendHorizontal } from "lucide-react";

import { useEffect, useState } from "react";
export type Receiver = {
  id: string;
  avatar: string;
  name: string;
};
interface ChatPopOverProps {
  onClose: () => void;
  receiver: Receiver;
}

export function ChatPopOver({ onClose, receiver }: ChatPopOverProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const loggedUser = useAuthStore((state) => state.loggedUser);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const chatMessages = [
      {
        id: "",
        userId: receiver.id,
        content: "My first message",
        createdAt: "19:10:56",
      },
      {
        id: "",
        userId: receiver.id,
        content: "My first message",
        createdAt: "19:10:56",
      },
      {
        id: "",
        userId: loggedUser.id,
        content: "My first message",
        createdAt: "19:10:56",
      },
      {
        id: "",
        userId: receiver.id,
        content: "My first message",
        createdAt: "19:10:56",
      },
      {
        id: "",
        userId: receiver.id,
        content: "My first message",
        createdAt: "19:10:56",
      },
    ];
    const displayMessages = chatMessages.map((message) => ({
      ...message,
      isFromUser: message.userId === loggedUser.id,
    }));
    setMessages(displayMessages);
  }
  async function handleClose() {
    onClose();
  }
  return (
    <div
      className={`fixed top-0 right-0 h-full w-full flex flex-col  bg-gray-800 text-white z-10`}
    >
      <div className="flex justify-between items-center p-2 text-lg md:text-2xl md:p-4 bg-gray-900">
        <h2 className=" font-bold">Chat</h2>
        <button onClick={handleClose} className="text-white cursor-pointer">
          X
        </button>
      </div>
      <div className="flex flex-1  p-4 flex-col gap-4">
        <div className="flex w-full bg-primary flex-col h-[84vh] rounded-xl p-4 gap-4 overflow-auto">
          {messages.length > 0 &&
            messages.map((message) => (
              <div
                className={classNames(
                  "w-full",
                  "gap-4",
                  "flex",
                  "relative",
                  { "justify-end": message.isFromUser },
                  { "justify-start": !message.isFromUser }
                )}
              >
                {!message.isFromUser && (
                  <div className="flex flex-col items-center justify-center w-fit">
                    <img
                      className="rounded-full w-20 h-20"
                      src={receiver.avatar}
                    />
                    <span> {receiver.name}</span>
                  </div>
                )}
                <div
                  className={classNames(
                    "p-4",
                    "rounded-xl",
                    "relative",
                    "w-full",
                    "md:w-fit",
                    { "text-black": message.isFromUser },
                    { "bg-white": message.isFromUser },
                    { "bg-black": !message.isFromUser },
                    { "text-white": !message.isFromUser }
                  )}
                >
                  <p>{message.content}</p>
                  <span
                    className={classNames(
                      "absolute",
                      "bottom-2",
                      { "right-2": message.isFromUser },
                      { "left-2": !message.isFromUser },

                      "text-xs"
                    )}
                  >
                    {message.createdAt}
                  </span>
                  <div
                    className={classNames(
                      "absolute",
                      { "right-[-6px]": message.isFromUser },
                      { "left-[-6px]": !message.isFromUser },
                      "bottom-0",
                      "w-0",
                      "h-0",
                      "border-solid",
                      "border-l-[8px]",
                      "border-r-[8px]",
                      "border-b-[16px]",
                      "border-transparent",
                      { "border-b-black": !message.isFromUser },
                      { "border-b-white": message.isFromUser }
                    )}
                  ></div>
                </div>
                {message.isFromUser && (
                  <div className="flex flex-col items-center justify-center w-fit">
                    <img
                      className="rounded-full w-20 h-20"
                      src={loggedUser.avatar}
                    />
                    <span> {loggedUser.username}</span>
                  </div>
                )}
              </div>
            ))}
          {messages.length === 0 && (
            <div className="flex flex-1 flex-col gap items-center justify-center gap-8">
              <img className="rounded-full w-24 h-24" src={receiver.avatar} />
              <span>Send a message to {receiver.name}</span>
            </div>
          )}
        </div>
        <div className="relative w-full h-fit">
          <Input
            className="bg-primary rounded-lg h-10"
            placeholder={`Send a message to ${receiver.name}`}
          />
          <div className="absolute flex top-0 right-0 bg-secondary h-10 w-10 justify-center items-center  text-white border border-white  rounded-lg">
            <SendHorizontal />
          </div>
        </div>
      </div>
    </div>
  );
}
