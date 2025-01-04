"use client";

import {
  ComponentPropsWithRef,
  ComponentPropsWithoutRef,
  useRef,
  FC,
} from "react";

import { cn } from "@repo/ui/lib/utils";
import { AnimatedBeam } from "@/components/animated-beam";
import {
  GoogleDriveIcon,
  GoogleDocsIcon,
  NotionIcon,
  OpenAIAlternativeIcon,
  ZapierIcon,
  WhatsappIcon,
  MessengerIcon,
} from "@repo/ui/icons";

const Circle: FC<ComponentPropsWithRef<"div">> = ({
  className,
  children,
  ...props
}) => (
  <div
    className={cn(
      "z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export const AnimatedBeamDemo: FC<ComponentPropsWithoutRef<"div">> = ({
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
        "relative flex h-[500px] w-full items-center justify-center overflow-hidden rounded-lg border bg-background p-10 md:shadow-xl",
        className
      )}
      ref={containerRef}
      {...props}
    >
      <div className="flex size-full flex-col max-w-lg max-h-[200px] items-stretch justify-between gap-10">
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div1Ref}>
            <GoogleDriveIcon />
          </Circle>
          <Circle ref={div5Ref}>
            <GoogleDocsIcon />
          </Circle>
        </div>
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div2Ref}>
            <NotionIcon />
          </Circle>
          <Circle ref={div4Ref} className="size-16">
            <OpenAIAlternativeIcon />
          </Circle>
          <Circle ref={div6Ref}>
            <ZapierIcon />
          </Circle>
        </div>
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div3Ref}>
            <WhatsappIcon />
          </Circle>
          <Circle ref={div7Ref}>
            <MessengerIcon />
          </Circle>
        </div>
      </div>
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div4Ref}
        curvature={-75}
        endYOffset={-10}
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
        reverse
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
