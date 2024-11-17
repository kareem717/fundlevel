"use client"

import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils"
import { ComponentPropsWithoutRef, FC, Fragment, useEffect, useState } from "react"
import { faker } from "@faker-js/faker";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export interface NotificationIndexProps extends ComponentPropsWithoutRef<typeof ScrollArea> {

};

const notifications = Array.from({ length: 20 }, (_, id) => ({
  id: id + 1,
  title: faker.lorem.words(2),
  message: faker.lorem.sentence(),
  time: faker.date.recent().toLocaleTimeString(),
}));

export const NotificationIndex: FC<NotificationIndexProps> = ({ className, ...props }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ScrollArea className={cn("h-full pb-4", className)} {...props}>
      {loading ? (
        Array.from({ length: 8 }).map((_, index) => (
          <Fragment key={index}>
            <div className="flex items-start gap-4">
              <div className="space-y-1 flex-1">
                <Skeleton className="h-6 rounded w-1/3" />
                <Skeleton className="h-4 rounded w-2/3" />
                <Skeleton className="h-3 rounded w-1/4" />
              </div>
            </div>
            <Separator className="my-4 last:hidden" />
          </Fragment>
        ))
      ) : (
        notifications.map((notification) => (
          <Fragment key={notification.id}>
            <div className="flex items-start gap-4">
              <Icons.bell className="mt-1 h-5 w-5 text-primary" />
              <div className="space-y-1">
                <p className="text-sm font-medium">{notification.title}</p>
                <p className="text-sm text-muted-foreground">{notification.message}</p>
                <p className="text-xs text-muted-foreground">{notification.time}</p>
              </div>
            </div>
            <Separator className="my-4 last:hidden" />
          </Fragment>
        ))
      )}
    </ScrollArea>
  );
};