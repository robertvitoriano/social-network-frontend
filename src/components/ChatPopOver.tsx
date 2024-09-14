"use client";
import { listChatMessagesByUser } from "@/api/list-chat-messages";
import { sendChatMessage } from "@/api/send-chat-message";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/lib/store/authStore";
import { useChatStore } from "@/lib/store/chatStore";
import { SendHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ChatMessage, Message } from "./ui/ChatMessage";
import socket from "@/api/websocket-service";
import { EventType } from "@/enums/websocket-events";
import { Spinner } from "./Spinner";
import { getProfile } from "@/api/get-profile";

export type Receiver = {
  id: string;
  friendshipId: string;
  avatar: string;
  name: string;
  lastMessage: string;
  lastMessageCreatedAt: Date;
  online: boolean;
};

export function ChatPopOver() {
  const [messages, setMessages] = useState<any[]>([]);
  const loggedUser = useAuthStore((state) => state.loggedUser);
  const closeChatDialog = useChatStore((state) => state.closeChatDialog);
  const friendId = useChatStore((state) => state.friendId);
  const friendshipId = useChatStore((state) => state.friendshipId);

  const [currentMessageContent, setCurrentMessageContent] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [shouldLoadNextPageMessages, setShouldLoadNextPageMessages] = useState(false);
  const [receiverIsTyping, setReceiverIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);
  const [receiver, setReceiver] = useState<Receiver>({
    id: "",
    avatar: "",
    friendshipId: "",
    name: "",
    lastMessage: "",
    lastMessageCreatedAt: new Date(),
    online: false,
  });

  const timeToSendOpenChatEvent = 5000;
  let chatOpenTimerId: NodeJS.Timeout | null = null;
  useEffect(() => {
    loadReceiver(friendId);
    handleInitialLoad();
    const handleUserTyping = () => setReceiverIsTyping(true);
    const handleUserTypingStopped = () => setReceiverIsTyping(false);
    const handleMessageReceived = (newMessage: object) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setShouldScrollToBottom(true);
    };

    socket.on(EventType.USER_TYPING, handleUserTyping);
    socket.on(EventType.USER_TYPING_STOPPED, handleUserTypingStopped);
    socket.on(EventType.MESSAGE_RECEIVED, handleMessageReceived);
    sendChatOpenEvent();
    chatOpenTimerId = setInterval(sendChatOpenEvent, timeToSendOpenChatEvent);

    return () => {
      socket.off(EventType.USER_TYPING, handleUserTyping);
      socket.off(EventType.USER_TYPING_STOPPED, handleUserTypingStopped);
      socket.off(EventType.MESSAGE_RECEIVED, handleMessageReceived);
      sendChatCloseEvent();

      if (chatOpenTimerId) {
        clearInterval(chatOpenTimerId);
      }
    };
  }, []);

  useEffect(() => {
    if (currentPage < totalPages && shouldLoadNextPageMessages) {
      loadNextPageMessages();
    }
  }, [shouldLoadNextPageMessages]);

  useEffect(() => {
    if (shouldScrollToBottom) {
      scrollToBottom();
    }
  }, [shouldScrollToBottom]);

  async function loadReceiver(userId: string) {
    try {
      if (userId) {
        const {
          data: { profile, friendshipId },
        } = await getProfile(userId);
        console.log({ ...profile, friendshipId });
        setReceiver({ ...profile, friendshipId });
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  }
  async function handleInitialLoad() {
    await load({});
    setShouldScrollToBottom(true);
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
    const chatMessagesResponse = await listChatMessagesByUser(friendId, page);
    const { messages: loadedMessages, totalPages } = chatMessagesResponse.data;
    setTotalPages(totalPages);

    const displayMessages = loadedMessages.map((message: Message) => ({
      ...message,
      isFromUser: message.userId === loggedUser.id,
    }));

    setMessages([...displayMessages, ...messages]);
  }

  async function handleClose() {
    sendChatCloseEvent();
    closeChatDialog();
  }
  function sendChatCloseEvent() {
    socket.emit(EventType.CHAT_CLOSE, {
      userId: loggedUser.id,
      friendId: friendId,
    });
  }
  function sendChatOpenEvent() {
    socket.emit(EventType.CHAT_OPEN, {
      userId: loggedUser.id,
      friendId: friendId,
    });
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
      friendshipId,
      userId: loggedUser.id,
      content: currentMessageContent,
      createdAt: new Date().toISOString(),
      isFromUser: true,
    };
    setMessages([...messages, newMessage]);
    socket.emit(EventType.MESSAGE_SENT, {
      ...newMessage,
      receiverId: friendId,
      isFromUser: false,
    });
    setCurrentMessageContent("");
    setTimeout(scrollToBottom, 100);

    await sendChatMessage({
      receiverId: friendId,
      content: currentMessageContent,
      friendshipId: friendshipId,
    });
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  }

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setShouldScrollToBottom(false);
  }

  function handleUserTyping(event: React.ChangeEvent<HTMLInputElement>) {
    setCurrentMessageContent(event.target.value);
    socket.emit(EventType.USER_TYPING, friendId);
    setTimeout(() => socket.emit(EventType.USER_TYPING_STOPPED, friendId), 5000);
  }

  return (
    <div className="fixed top-0 right-0 h-full w-full flex flex-col bg-primary text-white z-50 rounded-md border border-white sm:max-w-72 sm:right-40 sm:top-auto sm:bottom-2 sm:h-96">
      {loading && <Spinner />}
      <div className="flex justify-between items-center p-2 text-lg md:text-2xl md:p-4 bg-gray-900">
        <img className="rounded-full w-10 h-10 sm:w-10 sm:h-10" src={receiver.avatar} />
        <h2 className="font-bold">{receiver.name}</h2>
        <button onClick={handleClose} className="text-white cursor-pointer">
          X
        </button>
      </div>
      <div className="flex h-full p-4 flex-col gap-4 justify-between">
        <div
          className="flex bg-primary flex-col h-[75vh]  rounded-xl p-4 gap-4 overflow-auto sm:h-56"
          onScroll={handleScroll}
          ref={messagesContainerRef}
        >
          {messages.length > 0 &&
            messages.map((message, index) => (
              <ChatMessage key={index} message={message} receiver={receiver} onClose={handleClose} />
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
