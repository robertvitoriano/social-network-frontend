"use client";
import { listChatMessagesByUser } from "@/api/list-chat-messages";
import { sendChatMessage } from "@/api/send-chat-message";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/lib/store/authStore";
import { SendHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ChatMessage, Message } from "./ui/ChatMessage";
import socket from "@/api/websocket-service";
import { EventType } from "@/enums/websocket-events";

export type Receiver = {
  id: string;
  avatar: string;
  name: string;
  lastMessage: string;
  lastMessageCreatedAt: Date;
  online: boolean;
};

interface ChatPopOverProps {
  onClose: () => void;
  receiver: Receiver;
}

const Spinner = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-transparent z-20 fit-w fit-h">
    <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-white border-t-transparent rounded-full"></div>
  </div>
);

export function ChatPopOver({ onClose, receiver }: ChatPopOverProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const loggedUser = useAuthStore((state) => state.loggedUser);
  const [currentMessageContent, setCurrentMessageContent] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [shouldLoadNextPageMessages, setShouldLoadNextPageMessages] =
    useState(false);
  const [receiverIsTyping, setReceiverIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    handleInitialLoad();
    socket.on(EventType.USER_TYPING, () => {
      setReceiverIsTyping(true);
    });
    socket.on(EventType.USER_TYPING_STOPPED, () => {
      setReceiverIsTyping(false);
    });
    socket.on(EventType.MESSAGE_RECEIVED, (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });
  }, []);

  useEffect(() => {
    if (currentPage < totalPages && shouldLoadNextPageMessages) {
      loadNextPageMessages();
    }
  }, [shouldLoadNextPageMessages]);

  async function handleInitialLoad() {
    await load({});
    scrollToBottom();
    setLoading(false);
  }

  async function loadNextPageMessages() {
    setLoading(true);
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    await load({ page: nextPage });
    setShouldLoadNextPageMessages(false);
    setLoading(false);
  }

  async function load({ page = 1 }) {
    const chatMessagesResponse = await listChatMessagesByUser(
      receiver.id,
      page
    );
    const { messages: loadedMessages, totalPages } = chatMessagesResponse.data;
    setTotalPages(totalPages);

    const displayMessages = loadedMessages.map((message: Message) => ({
      ...message,
      isFromUser: message.userId === loggedUser.id,
    }));

    setMessages([...displayMessages, ...messages]);
  }

  async function handleClose() {
    onClose();
  }

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      if (messagesContainerRef.current.scrollTop === 0) {
        setShouldLoadNextPageMessages(true);
      }
    }
  };

  async function handleSendMessage() {
    if (currentMessageContent.trim() === "") return;
    const newMessage = {
      userId: loggedUser.id,
      content: currentMessageContent,
      createdAt: new Date().toISOString(),
      isFromUser: true,
    };
    setMessages([...messages, newMessage]);
    socket.emit(EventType.MESSAGE_SENT, {
      ...newMessage,
      receiverId: receiver.id,
      isFromUser: false,
    });
    setCurrentMessageContent("");
    scrollToBottom();

    await sendChatMessage(receiver.id, currentMessageContent);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  }

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function handleUserTyping(event: React.ChangeEvent<HTMLInputElement>) {
    setCurrentMessageContent(event.target.value);
    socket.emit(EventType.USER_TYPING, receiver.id);
    setTimeout(
      () => socket.emit(EventType.USER_TYPING_STOPPED, receiver.id),
      5000
    );
  }

  return (
    <div className="fixed top-0 right-0 h-full w-full flex flex-col bg-gray-800 text-white z-10">
      {loading && <Spinner />}
      <div className="flex justify-between items-center p-2 text-lg md:text-2xl md:p-4 bg-gray-900">
        <h2 className="font-bold">Chat</h2>
        <button onClick={handleClose} className="text-white cursor-pointer">
          X
        </button>
      </div>
      <div className="flex flex-1 p-4 flex-col gap-4">
        <div
          className="flex w-full bg-primary flex-col h-[76vh] 2xl:h-[84vh] rounded-xl p-4 gap-4 overflow-auto"
          onScroll={handleScroll}
          ref={messagesContainerRef}
        >
          {messages.length > 0 &&
            messages.map((message, index) => (
              <ChatMessage key={index} message={message} receiver={receiver} />
            ))}
          {messages.length === 0 && (
            <div className="flex flex-1 flex-col items-center justify-center gap-8">
              <img className="rounded-full w-24 h-24" src={receiver.avatar} />
              <span>Send a message to {receiver.name}</span>
            </div>
          )}
          <div ref={messagesEndRef}></div>
        </div>
        {receiverIsTyping && (
          <div className="absolute left-1/2 top-4 transform -translate-x-1/2 text-white text-bold">
            <span>{receiver.name} is typing...</span>
          </div>
        )}
        <div className="relative w-full h-fit">
          <Input
            className="bg-primary rounded-lg h-10 focus:outline-none focus:ring-0"
            placeholder={`Send a message to ${receiver.name}`}
            value={currentMessageContent}
            onChange={handleUserTyping}
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
