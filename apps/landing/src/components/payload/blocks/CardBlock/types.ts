import type { Page } from "@/payload-types";

export type CardBlockProps = Extract<
  NonNullable<Page["layout"]>[number],
  { blockType: "card" }
>;
