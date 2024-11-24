import { Archive } from "./ArchiveBlock";
import { Banner } from "./Banner";
import { CallToAction } from "./CallToAction";
import { Code } from "./Code";
import { Content } from "./Content";
import { Media } from "./Media";
import { Contact } from "./Contact";
import { Typography } from "./Typography";
import { LatestPosts } from "./LatestPosts";
import { Card } from "./Card";
import { Grid } from "./Grid";

import {
  ArchiveBlock as ArchiveBlockType,
  BannerBlock as BannerBlockType,
  CallToActionBlock as CallToActionBlockType,
  CodeBlock as CodeBlockType,
  ContentBlock as ContentBlockType,
  MediaBlock as MediaBlockType,
} from "@/payload-types";

export type BlockTypes = {
  archive: ArchiveBlockType;
  banner: BannerBlockType;
  cta: CallToActionBlockType;
  code: CodeBlockType;
  content: ContentBlockType;
  mediaBlock: MediaBlockType;
};

export const pageBlocks = [
  Archive,
  Banner,
  CallToAction,
  Code,
  Content,
  Media,
  Contact,
  Typography,
  LatestPosts,
  Card,
  Grid,
];

export const postBlocks = [Archive, Banner, CallToAction, Code, Content, Media];

export const inlineBlocks = [Archive, Banner, CallToAction, Code, Media];

export const contentBlocks = [
  // Form,
  Media,
];
