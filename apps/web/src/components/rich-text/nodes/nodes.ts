import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { HashtagNode } from "@lexical/hashtag";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { OverflowNode } from "@lexical/overflow";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import {
	Klass,
	LexicalNode,
	LexicalNodeReplacement,
	ParagraphNode,
	TextNode,
} from "lexical";

import { AutocompleteNode } from "@/components/rich-text/nodes/autocomplete-node";
import { CollapsibleContainerNode } from "@/components/rich-text/nodes/collapsible-container-node";
import { CollapsibleContentNode } from "@/components/rich-text/nodes/collapsible-content-node";
import { CollapsibleTitleNode } from "@/components/rich-text/nodes/collapsible-title-node";
import { FigmaNode } from "@/components/rich-text/nodes/embeds/figma-node";
import { TweetNode } from "@/components/rich-text/nodes/embeds/tweet-node";
import { YouTubeNode } from "@/components/rich-text/nodes/embeds/youtube-node";
import { EmojiNode } from "@/components/rich-text/nodes/emoji-node";
import { EquationNode } from "@/components/rich-text/nodes/equation-node";
import { ExcalidrawNode } from "@/components/rich-text/nodes/excalidraw-node";
import { ImageNode } from "@/components/rich-text/nodes/image-node";
import { InlineImageNode } from "@/components/rich-text/nodes/inline-image-node";
import { KeywordNode } from "@/components/rich-text/nodes/keyword-node";
import { LayoutContainerNode } from "@/components/rich-text/nodes/layout-container-node";
import { LayoutItemNode } from "@/components/rich-text/nodes/layout-item-node";
import { MentionNode } from "@/components/rich-text/nodes/mention-node";
import { PageBreakNode } from "@/components/rich-text/nodes/page-break-node";
import { PollNode } from "@/components/rich-text/nodes/poll-node";

export const nodes: ReadonlyArray<Klass<LexicalNode> | LexicalNodeReplacement> =
	[
		HeadingNode,
		ParagraphNode,
		TextNode,
		QuoteNode,
		ListNode,
		ListItemNode,
		LinkNode,
		OverflowNode,
		HashtagNode,
		TableNode,
		TableCellNode,
		TableRowNode,
		CodeNode,
		CodeHighlightNode,
		HorizontalRuleNode,
		MentionNode,
		PageBreakNode,
		ImageNode,
		InlineImageNode,
		EmojiNode,
		KeywordNode,
		ExcalidrawNode,
		PollNode,
		LayoutContainerNode,
		LayoutItemNode,
		EquationNode,
		CollapsibleContainerNode,
		CollapsibleContentNode,
		CollapsibleTitleNode,
		AutoLinkNode,
		FigmaNode,
		TweetNode,
		YouTubeNode,
		AutocompleteNode,
	];
