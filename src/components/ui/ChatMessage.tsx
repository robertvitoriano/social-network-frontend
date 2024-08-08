import { useAuthStore } from "@/lib/store/authStore";
import classNames from "classnames";
import { Receiver } from "../ChatPopOver";

export type Message = {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
  isFromUser: boolean;
};
export type ChatMessageProps = {
  message: Message;
  receiver: Receiver;
};

export const ChatMessage = ({ message, receiver }: ChatMessageProps) => {
  const loggedUser = useAuthStore((state) => state.loggedUser);

  return (
    <div
      key={message.id}
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
          <img className="rounded-full w-20 h-20" src={receiver.avatar} />
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
          <img className="rounded-full w-20 h-20" src={loggedUser.avatar} />
          <span>{loggedUser.username}</span>
        </div>
      )}
    </div>
  );
};
