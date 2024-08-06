"use client";
import { listChatMessagesByUser } from "@/api/list-chat-messages";
import { sendChatMessage } from "@/api/send-chat-message";
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
  const [currentMessageContent, setCurrentMessageContent] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const chatMessagesResponse = await listChatMessagesByUser(receiver.id);
    const chatMessages = chatMessagesResponse.data.userMessages;
    const displayMessages = chatMessages.map((message) => ({
      ...message,
      isFromUser: message.userId === loggedUser.id,
    }));
    setMessages(displayMessages);
  }

  async function handleClose() {
    onClose();
  }

  async function handleSendMessage() {
    if (currentMessageContent.trim() === "") return;

    await sendChatMessage(receiver.id, currentMessageContent);
    setMessages([
      ...messages,
      {
        userId: loggedUser.id,
        content: currentMessageContent,
        createdAt: new Date().toISOString(),
        isFromUser: true,
      },
    ]);
    setCurrentMessageContent("");
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  }

  return (
    <div className="fixed top-0 right-0 h-full w-full flex flex-col bg-gray-800 text-white z-10">
      <div className="flex justify-between items-center p-2 text-lg md:text-2xl md:p-4 bg-gray-900">
        <h2 className="font-bold">Chat</h2>
        <button onClick={handleClose} className="text-white cursor-pointer">
          X
        </button>
      </div>
      <div className="flex flex-1 p-4 flex-col gap-4">
        <div className="flex w-full bg-primary flex-col h-[84vh] rounded-xl p-4 gap-4 overflow-auto">
          {messages.length > 0 &&
            messages.map((message, index) => (
              <div
                key={index}
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
                    <span>{receiver.name}</span>
                  </div>
                )}
                <div
                  className={classNames(
                    "p-4",
                    "rounded-xl",
                    "relative",
                    "w-full",
                    "md:max-w-[600px]",
                    { "text-black": message.isFromUser },
                    { "bg-white": message.isFromUser },
                    { "bg-black": !message.isFromUser },
                    { "text-white": !message.isFromUser }
                  )}
                >
                  <p className="break-words">{message.content}</p>
                  <span
                    className={classNames(
                      "absolute",
                      "bottom-2",
                      { "right-2": message.isFromUser },
                      { "left-2": !message.isFromUser },
                      "text-xs"
                    )}
                  >
                    {new Date(message.createdAt).toLocaleTimeString()}
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
                    <span>{loggedUser.username}</span>
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
            className="bg-primary rounded-lg h-10 focus:outline-none focus:ring-0"
            placeholder={`Send a message to ${receiver.name}`}
            value={currentMessageContent}
            onChange={(e) => setCurrentMessageContent(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div
            onClick={handleSendMessage}
            className="absolute flex top-0 right-0 bg-secondary text-white hover:bg-black cursor-pointer h-10 w-10 justify-center items-center border border-white rounded-lg"
          >
            <SendHorizontal />
          </div>
        </div>
      </div>
    </div>
  );
}
