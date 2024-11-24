import type { Page } from "@/payload-types";

export type TypographyBlockProps = Extract<
  NonNullable<Page["layout"]>[number],
  { blockType: "typography" }
>;
