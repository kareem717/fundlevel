import React from "react";
import RichText from "@/components/payload/RichText";
import type { Page, BannerBlock } from "@/payload-types";
import { CMSLink } from "@/components/payload/Link";

type Props = Extract<NonNullable<Page["layout"]>[number], { blockType: "cta" }>;

export const CallToActionBlock: React.FC<
  Props & {
    id?: string;
  }
> = ({ links, richText }) => {
  return (
    <div className="container">
      <div className="bg-card rounded border-border border p-4 flex flex-col gap-8 md:flex-row md:justify-between md:items-center">
        <div className="max-w-[48rem] flex items-center">
          {richText && (
            <RichText
              className="mb-0"
              content={richText}
              enableGutter={false}
            />
          )}
        </div>
        <div className="flex flex-col gap-8">
          {(links || []).map(({ link }, i) => {
            return <CMSLink key={i} size="lg" {...link} />;
          })}
        </div>
      </div>
    </div>
  );
};
