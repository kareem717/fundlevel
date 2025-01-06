"use client";

import {
  ComponentPropsWithRef,
  ComponentPropsWithoutRef,
  useRef,
  FC,
} from "react";
import { cn } from "@repo/ui/lib/utils";
import { AnimatedBeam } from "./animated-beam";
import {
  SmallLogoIcon,
} from "@repo/ui/icons";
import { Banknote, Bitcoin, CreditCard, HandCoins, Landmark, Users } from "lucide-react";

const Circle: FC<ComponentPropsWithRef<"div">> = ({
  className,
  children,
  ...props
}) => (
  <div
    className={cn(
      "z-10 flex size-12 items-center justify-center rounded-full border-2 bg-background p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export const PaymentHandlingFlow: FC<ComponentPropsWithoutRef<"div">> = ({
  className,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLDivElement>(null);
  const div5Ref = useRef<HTMLDivElement>(null);
  const div6Ref = useRef<HTMLDivElement>(null);
  const div7Ref = useRef<HTMLDivElement>(null);

  return (
    <div
      className={cn(
        "relative flex w-full items-center justify-center p-10",
        className
      )}
      ref={containerRef}
      {...props}
    >
      <div className="flex size-full flex-col max-w-lg max-h-[200px] items-stretch justify-between gap-10">
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div1Ref}>
            <Banknote />
          </Circle>
          <Circle ref={div5Ref}>
            <Users />
          </Circle>
        </div>
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div2Ref}>
            <Landmark />
          </Circle>
          <Circle ref={div4Ref} className="size-16">
            <SmallLogoIcon />
          </Circle>
          <Circle ref={div6Ref}>
            <Bitcoin />
          </Circle>
        </div>
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div3Ref}>
            <HandCoins />
          </Circle>
          <Circle ref={div7Ref}>
            <CreditCard />
          </Circle>
        </div>
      </div>
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div4Ref}
        curvature={-75}
        endYOffset={-10}
        reverse
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div4Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div3Ref}
        toRef={div4Ref}
        curvature={75}
        endYOffset={10}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div5Ref}
        toRef={div4Ref}
        curvature={-75}
        endYOffset={-10}
        reverse
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div6Ref}
        toRef={div4Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div7Ref}
        toRef={div4Ref}
        curvature={75}
        endYOffset={10}
        reverse
      />
    </div>
  );
};
