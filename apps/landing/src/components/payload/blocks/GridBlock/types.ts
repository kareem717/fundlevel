import type { Page } from "@/payload-types";
import { GRID_BLOCK_SLUG } from "@/payload/blocks/constants";

export type GridBlockProps = Extract<
  NonNullable<Page["layout"]>[number],
  { blockType: typeof GRID_BLOCK_SLUG }
>;
