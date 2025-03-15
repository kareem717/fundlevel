import { Card } from "@fundlevel/ui/components/card";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@fundlevel/ui/components/card";
import { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";
import {
  NOTIFICATION_ID,
  useNotification,
} from "../providers/notification-provider";

export interface SidebarNotificationProps
  extends ComponentPropsWithoutRef<"div"> {
  notificationId: NOTIFICATION_ID;
}

export function SidebarNotification({
  notificationId,
  className,
  ...props
}: SidebarNotificationProps) {
  const notificationContext = useNotification();
  const notification = notificationContext?.getNotification(notificationId);

  if (!notification) {
    return null;
  }

  return (
    <Card className={cn("shadow-none", className)} {...props}>
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-sm">{notification.title}</CardTitle>
        <CardDescription>{notification.description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2.5 p-4">
        {notification.action}
      </CardContent>
    </Card>
  );
}
