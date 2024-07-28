"use client";

interface FriendshipAcceptedNotificationProps {
  notification: any;
}

export const FriendshipAcceptedNotification: React.FC<
  FriendshipAcceptedNotificationProps
> = ({ notification }) => {
  return (
    <div className="flex p-4 gap-4 bg-blue-500 rounded items-center text-white">
      <img className="h-14 w-14 rounded-full" src={notification.senderAvatar} />
      <span className="text-sm">
        {notification.senderName} is now your friend!
      </span>
    </div>
  );
};
