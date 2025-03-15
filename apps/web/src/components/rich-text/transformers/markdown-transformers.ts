import {
  CHECK_LIST,
  ELEMENT_TRANSFORMERS,
  MULTILINE_ELEMENT_TRANSFORMERS,
  TEXT_FORMAT_TRANSFORMERS,
  TEXT_MATCH_TRANSFORMERS,
  Transformer,
} from "@lexical/markdown";

import { EMOJI } from "@/components/rich-text/transformers/markdown-emoji-transformer";
import { EQUATION } from "@/components/rich-text/transformers/markdown-equation-transofrmer";
import { HR } from "@/components/rich-text/transformers/markdown-hr-transformer";
import { IMAGE } from "@/components/rich-text/transformers/markdown-image-transformer";
import { TABLE } from "@/components/rich-text/transformers/markdown-table-transformer";
import { TWEET } from "@/components/rich-text/transformers/markdown-tweet-transformer";

export const MARKDOWN_TRANSFORMERS: Array<Transformer> = [
  TABLE,
  HR,
  IMAGE,
  EMOJI,
  EQUATION,
  TWEET,
  CHECK_LIST,
  ...ELEMENT_TRANSFORMERS,
  ...MULTILINE_ELEMENT_TRANSFORMERS,
  ...TEXT_FORMAT_TRANSFORMERS,
  ...TEXT_MATCH_TRANSFORMERS,
];
