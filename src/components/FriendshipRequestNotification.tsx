"use client";

import { sendFriendshipResponse } from "@/api/send-friendship-response";
import { FriendshipStatus } from "@/enums/friendship-status";

interface FriendshipRequestNotificationProps {
  notification: any;
}

export const FriendshipRequestNotification: React.FC<
  FriendshipRequestNotificationProps
> = ({ notification }) => {
  async function handleFriendshipResponse(friendId: string, status: string) {
    await sendFriendshipResponse(friendId, status);
  }
  return (
    <div className="flex p-4 gap-4 bg-blue-500 rounded items-center text-white">
      <img className="h-14 w-14 rounded-full" src={notification.senderAvatar} />
      <div className="flex flex-1 flex-col gap-2 pt-2">
        <span className="text-sm">
          {notification.senderName} wants to be your friend!
        </span>
        <div className="flex justify-around">
          <div className="p-2 ">
            <span
              className="cursor-pointer hover:underline"
              onClick={() =>
                handleFriendshipResponse(
                  notification.senderId,
                  FriendshipStatus.REJECTED
                )
              }
            >
              Ignore
            </span>
          </div>
          <div className="text-primary p-2 border-2 border-primary rounded-full">
            <span
              className="cursor-pointer"
              onClick={() =>
                handleFriendshipResponse(
                  notification.senderId,
                  FriendshipStatus.ACCEPTED
                )
              }
            >
              Accept
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
