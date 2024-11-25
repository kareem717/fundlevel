"use client";

import { Children, ComponentPropsWithoutRef, FC, memo, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface AnimatedListProps extends ComponentPropsWithoutRef<"div"> {
  delay?: number;
}

export const AnimatedList: FC<AnimatedListProps> = memo(
  ({ className, children, delay = 1000, ...props }) => {
    const [index, setIndex] = useState(0);
    const childrenArray = useMemo(
      () => Children.toArray(children),
      [children],
    );

    useEffect(() => {
      if (index < childrenArray.length - 1) {
        const timeout = setTimeout(() => {
          setIndex((prevIndex) => prevIndex + 1);
        }, delay);

        return () => clearTimeout(timeout);
      }
    }, [index, delay, childrenArray.length]);

    const itemsToShow = useMemo(() => {
      const result = childrenArray.slice(0, index + 1).reverse();
      return result;
    }, [index, childrenArray]);

    return (
      <div className={cn(`flex flex-col items-center gap-4`, className)} {...props}>
        <AnimatePresence>
          {itemsToShow.map((item) => (
            <AnimatedListItem key={(item as React.ReactElement).key}>
              {item}
            </AnimatedListItem>
          ))}
        </AnimatePresence>
      </div>
    );
  },
);

AnimatedList.displayName = "AnimatedList";

export const AnimatedListItem: FC<ComponentPropsWithoutRef<typeof motion.div>> = ({
  children,
  className,
  ...props
}) => {
  const animations = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1, originY: 0 },
    exit: { scale: 0, opacity: 0 },
    transition: { type: "spring", stiffness: 350, damping: 40 },
  };

  return (
    <motion.div
      {...animations}
      layout
      className={cn("mx-auto w-full", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
};
