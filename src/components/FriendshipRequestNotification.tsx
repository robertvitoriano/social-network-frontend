"use client";

interface FriendshipRequestNotificationProps {
  notification: any;
}

export const FriendshipRequestNotification: React.FC<
  FriendshipRequestNotificationProps
> = ({ notification }) => {
  return (
    <div className="flex p-4 gap-4 bg-blue-500 rounded items-center text-white">
      <img className="h-14 w-14 rounded-full" src={notification.senderAvatar} />
      <div className="flex flex-1 flex-col gap-2 pt-2">
        <span className="text-sm">
          {notification.senderName} wants to be your friend!
        </span>
        <div className="flex justify-around">
          <div className="hover:bg-primary p-4 hover:rounded-lg">
            <span className="cursor-pointer">Accept</span>
          </div>
          <div className="hover:bg-primary p-4 hover:rounded-lg">
            <span className="cursor-pointer">Reject</span>
          </div>
        </div>
      </div>
    </div>
  );
};
