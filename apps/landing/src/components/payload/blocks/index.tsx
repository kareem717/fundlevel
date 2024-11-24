import React, { Fragment } from "react";
import type { Page } from "@/payload-types";
import { ArchiveBlock } from "@/components/payload/blocks/ArchiveBlock";
import { CallToActionBlock } from "@/components/payload/blocks/CallToAction";
import { ContentBlock } from "@/components/payload/blocks/Content";
import { MediaBlock } from "@/components/payload/blocks/MediaBlock";
import { TypographyBlock } from "@/components/payload/blocks/Typography";
import { LatestPostsBlock } from "@/components/payload/blocks/LatestPosts";
import { CardBlock } from "@/components/payload/blocks/CardBlock";
import { GridBlock } from "@/components/payload/blocks/GridBlock";

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  mediaBlock: MediaBlock,
  typography: TypographyBlock,
  "latest-posts": LatestPostsBlock,
  card: CardBlock,
  grid: GridBlock,
} as const;

export const RenderBlocks: React.FC<{
  blocks: NonNullable<Page["layout"]>[number];
}> = (props) => {
  const { blocks } = props;
  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0;

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block;
          // @ts-expect-error
          const Block = blockComponents[blockType];

          return Block ? (
            <div className="" key={index}>
              <Block {...block} id={block.id?.toString()} />
            </div>
          ) : null;
        })}
      </Fragment>
    );
  }

  return null;
};
