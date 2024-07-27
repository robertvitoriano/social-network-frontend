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
  switch (notification.type) {
    case NotificationTypes.FRIENDSHIP_REQUEST.label:
      return <FriendshipRequestNotification notification={notification} />;
    case NotificationTypes.FRIENDSHIP_ACCEPTED.label:
      return <FriendshipAcceptedNotification notification={notification} />;
    default:
      return null;
  }
};

export default NotificationRenderer;
