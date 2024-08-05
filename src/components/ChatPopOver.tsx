"use client";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/lib/store/authStore";
import classNames from "classnames";

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
  const [messages, setMessages] = useState([
    {
      content: "My first message",
      isFromUser: false,
    },
    {
      content: "My first message",
      isFromUser: false,
    },
    {
      content: "My first message",
      isFromUser: true,
    },
    {
      content: "My first message",
      isFromUser: false,
    },
    {
      content: "My first message",
      isFromUser: false,
    },
  ]);

  useEffect(() => {
    load();
  }, []);
  const loggedUser = useAuthStore((state) => state.loggedUser);

  async function load() {}
  async function handleClose() {
    onClose();
  }
  return (
    <div
      className={`fixed top-0 right-0 h-full w-full flex flex-col  bg-gray-800 text-white z-10`}
    >
      <div className="flex justify-between items-center p-4 bg-gray-900">
        <h2 className="text-lg font-bold">Chat</h2>
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
                    { "text-black": message.isFromUser },
                    { "bg-white": message.isFromUser },
                    { "bg-black": !message.isFromUser },
                    { "text-white": !message.isFromUser }
                  )}
                >
                  <p>{message.content}</p>
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
        <Input
          className="bg-primary "
          placeholder={`Send a message to ${receiver.name}`}
        />
      </div>
    </div>
  );
}
