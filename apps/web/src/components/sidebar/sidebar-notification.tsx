import { Card } from "@repo/ui/components/card";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@repo/ui/components/card";
import { ComponentPropsWithoutRef } from "react";
import { Notification } from "../providers/notification-provider";
import { cn } from "@/lib/utils";

export interface SidebarNotificationProps extends ComponentPropsWithoutRef<"div"> {
  notification: Notification;
}

export function SidebarNotification({ notification, className, ...props }: SidebarNotificationProps) {
  return (
    <Card className={cn("shadow-none", className)} {...props}>
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-sm">{notification.title}</CardTitle>
        <CardDescription>
          {notification.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2.5 p-4">
        {notification.action}
      </CardContent>
    </Card>
  )
}