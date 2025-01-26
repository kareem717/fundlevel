"use client";

import { ReactNode, useState } from "react";
import { createContext, useContext } from "react";

export interface Notification {
  id: string;
  title: string;
  description?: string;
  action?: ReactNode
}

export interface NotificationProviderProps {
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
  getNotification: (id: string) => Notification | undefined;
};

const NotificationContext = createContext<NotificationProviderProps | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }

  return context;
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const getNotification = (id: string) => {
    return notifications.find(notification => notification.id === id);
  }

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications, getNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}
