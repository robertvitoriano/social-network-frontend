"use client";
import { listChatMessagesByUser } from "@/api/list-chat-messages";
import { sendChatMessage } from "@/api/send-chat-message";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/lib/store/authStore";
import { SendHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { ChatMessage, Message } from "./ui/ChatMessage";

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

    document.body.addEventListener("scroll", () => console.log("HELLO WORLD"));
  }, []);

  async function load() {
    const chatMessagesResponse = await listChatMessagesByUser(receiver.id);
    const chatMessages = chatMessagesResponse.data.userMessages;
    const displayMessages = chatMessages.map((message: Message) => ({
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
            messages.map((message) => (
              <ChatMessage message={message} receiver={receiver} />
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
