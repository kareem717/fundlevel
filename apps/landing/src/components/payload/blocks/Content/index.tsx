import { cn } from "@/lib/utils";
import React from "react";
import RichText from "@/components/payload/RichText";

import type { Page } from "@/payload-types";

import { CMSLink } from "@/components/payload/Link";
import { RenderBlocks } from "..";
import { Media } from "@/components/payload/Media";

type Props = Extract<
  NonNullable<Page["layout"]>[number],
  { blockType: "content" }
>;

export const ContentBlock: React.FC<
  {
    id?: string;
  } & Props
> = (props) => {
  const { columns, gapX, gapY } = props;

  const colsSpanClasses = {
    full: "12",
    half: "6",
    oneThird: "4",
    twoThirds: "8",
  };

  const alignClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
  };

  return (
    <div className="container my-16">
      <div
        className={cn(
          "grid grid-cols-4 lg:grid-cols-12",
          { "gap-y-[32px]": gapY },
          { "gap-x-[32px]": gapX }
        )}
      >
        {columns &&
          columns.length > 0 &&
          columns.map((col, index) => {
            const {
              enableLink,
              link,
              richText,
              size,
              blocks,
              enableBackgroundImage,
              backgroundImage,
              align,
              height,
            } = col;

            return (
              <div
                className={cn(
                  `relative col-span-4 lg:col-span-${colsSpanClasses[size!]}`,
                  {
                    "md:col-span-2": size !== "full",

                    [`min-h-[${height}px]`]: height,
                  }
                )}
                key={index}
              >
                {enableBackgroundImage && backgroundImage && (
                  <>
                    <Media
                      resource={backgroundImage}
                      fill
                      imgClassName="absolute inset-0 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 z-20"></div>
                  </>
                )}

                <div
                  className={cn(
                    "relative z-30 flex flex-col h-full",
                    {
                      "p-8 lg:p-12": enableBackgroundImage,
                    },
                    align ? alignClasses[align] : ""
                  )}
                >
                  {richText && (
                    <RichText content={richText} enableGutter={false} />
                  )}

                  {blocks && blocks.length > 0 && (
                    // @ts-expect-error
                    <RenderBlocks blocks={blocks} />
                  )}

                  {enableLink && <CMSLink {...link} className="rounded-none" />}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
