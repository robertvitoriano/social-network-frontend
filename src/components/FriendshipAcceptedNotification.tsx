"use client";

interface FriendshipAcceptedNotificationProps {
  notification: any;
}

export const FriendshipAcceptedNotification: React.FC<
  FriendshipAcceptedNotificationProps
> = ({ notification }) => {
  return (
    <div className="p-4 bg-green-500 rounded">
      <p>{notification.message}</p>
    </div>
  );
};
