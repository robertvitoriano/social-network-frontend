"use client";

import classNames from "classnames";

interface MessageReceivedNotificationProps {
  notification: any;
}

export const MessageReceivedNotification: React.FC<
  MessageReceivedNotificationProps
> = ({ notification }) => {
  return (
    <div
      className={classNames(
        "flex",
        "p-4",
        "gap-4",
        "rounded",
        "items-center",
        "text-white",
        { "bg-blue-500": !notification.wasRead },
        { "bg-transparent": notification.wasRead },
        { "border-white": notification.wasRead },
        { border: notification.wasRead }
      )}
    >
      <img className="h-14 w-14 rounded-full" src={notification.senderAvatar} />
      <span className="text-sm">{notification.content}</span>
      <div className="w-full flex justify-end">
        <span className="text-sm">
          {" "}
          {new Date(notification.createdAt).toLocaleDateString() +
            " - " +
            new Date(notification.createdAt).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};
