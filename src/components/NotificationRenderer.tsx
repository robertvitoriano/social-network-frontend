"use client";

import { NotificationTypes } from "@/enums/notification-types";
import { FriendshipRequestNotification } from "./FriendshipRequestNotification";
import { FriendshipAcceptedNotification } from "./FriendshipAcceptedNotification";
import { MessageReceivedNotification } from "./MessageReceivedNotification";

interface NotificationRendererProps {
  notification: any;
}

const NotificationRenderer: React.FC<NotificationRendererProps> = ({
  notification,
}) => {
  return (
    <>
      {Number(notification.typeId) ===
        NotificationTypes.FRIENDSHIP_REQUEST.id && (
        <FriendshipRequestNotification notification={notification} />
      )}

      {Number(notification.typeId) ===
        NotificationTypes.FRIENDSHIP_ACCEPTED.id && (
        <FriendshipAcceptedNotification notification={notification} />
      )}
      {Number(notification.typeId) ===
        NotificationTypes.MESSAGE_RECEIVED.id && (
        <MessageReceivedNotification notification={notification} />
      )}
    </>
  );
};

export default NotificationRenderer;
