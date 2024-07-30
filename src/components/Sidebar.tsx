"use client";

import NotificationRenderer from "./NotificationRenderer";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: any[];
}

export function Sidebar({ isOpen, onClose, notifications }: SidebarProps) {
  return (
    <div
      className={`fixed top-0 right-0 h-full w-full bg-gray-800 text-white transform transition-transform ${
        isOpen ? "none" : "block"
      }`}
    >
      <div className="flex justify-between items-center p-4 bg-gray-900">
        <h2 className="text-lg font-bold">Notifications</h2>
        <button onClick={onClose} className="text-white">
          Close
        </button>
      </div>
      <div className="p-4">
        {notifications.length === 0 ? (
          <p>No notifications</p>
        ) : (
          <ul>
            {notifications.map((notification, index) => (
              <li key={index} className="mb-2">
                <NotificationRenderer notification={notification} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
