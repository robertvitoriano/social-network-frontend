"use client";

import { NotificationTypes } from "@/enums/notification-types";
import { FriendshipRequestNotification } from "./FriendshipRequestNotification";
import { FriendshipAcceptedNotification } from "./FriendshipAcceptedNotification";

interface NotificationRendererProps {
  notification: any;
}

const NotificationRenderer: React.FC<NotificationRendererProps> = ({
  notification,
}) => {
  return (
    <>
      {notification.type === NotificationTypes.FRIENDSHIP_REQUEST.label && (
        <FriendshipRequestNotification notification={notification} />
      )}

      {notification.type === NotificationTypes.FRIENDSHIP_ACCEPTED.label && (
        <FriendshipAcceptedNotification notification={notification} />
      )}
    </>
  );
};

export default NotificationRenderer;
