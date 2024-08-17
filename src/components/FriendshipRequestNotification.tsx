"use client";

import { sendFriendshipResponse } from "@/api/send-friendship-response";
import { FriendshipStatus } from "@/enums/friendship-status";
import { useFriendshipStore } from "@/lib/store/friendshipStore";
import classNames from "classnames";
import { Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface FriendshipRequestNotificationProps {
  notification: any;
}

export const FriendshipRequestNotification: React.FC<
  FriendshipRequestNotificationProps
> = ({ notification }) => {
  const [frienshipRequestWasAccepeted, setFrienshipRequestWasAccepeted] =
    useState<boolean>();
  const fetchFriendshipSugestions = useFriendshipStore(
    (state) => state.fetchFriendshipSugestions
  );
  const fetchUserFriends = useFriendshipStore(
    (state) => state.fetchUserFriends
  );
  async function handleFriendshipResponse(friendId: string, status: string) {
    setFrienshipRequestWasAccepeted(true);
    toast("Friendship response was sent");
    await sendFriendshipResponse(friendId, status);
    await fetchFriendshipSugestions();
    await fetchUserFriends();
  }

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
      {" "}
      <img className="h-14 w-14 rounded-full" src={notification.senderAvatar} />
      {notification.friendshipRequestStatus === FriendshipStatus.PENDING &&
        !frienshipRequestWasAccepeted && (
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
              <div className="bg-white text-primary p-2 border-2 border-primary rounded-full ">
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
        )}
      {(notification.friendshipRequestStatus === FriendshipStatus.ACCEPTED ||
        frienshipRequestWasAccepeted) && (
        <div className="flex flex-1 items-center gap-4 pt-2">
          <span className="text-sm">
            {notification.senderName} Is now your friend!
          </span>
          <div className="flex justify-around">
            <div className="flex gap-4 text-white p-2 border-2 bg-secondary border-white primary rounded-full ">
              <Check />
              <span>Accepted</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
