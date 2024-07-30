"use client";

import classNames from "classnames";

interface FriendshipAcceptedNotificationProps {
  notification: any;
}

export const FriendshipAcceptedNotification: React.FC<
  FriendshipAcceptedNotificationProps
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
      <span className="text-sm">
        {notification.senderName} is now your friend!
      </span>
    </div>
  );
};
