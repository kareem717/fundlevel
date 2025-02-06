import { useState } from 'react'

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin'
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin'
import { ClickableLinkPlugin } from '@lexical/react/LexicalClickableLinkPlugin'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin'
import { TablePlugin } from '@lexical/react/LexicalTablePlugin'

import { Separator } from '@repo/ui/components/separator'

import { BlockFormatDropDown } from '@/components/rich-text/plugins/toolbar/block-format-toolbar-plugin'
import { FormatBulletedList } from '@/components/rich-text/plugins/toolbar/block-format/format-bulleted-list'
import { FormatCheckList } from '@/components/rich-text/plugins/toolbar/block-format/format-check-list'
import { FormatCodeBlock } from '@/components/rich-text/plugins/toolbar/block-format/format-code-block'
import { FormatHeading } from '@/components/rich-text/plugins/toolbar/block-format/format-heading'
import { FormatNumberedList } from '@/components/rich-text/plugins/toolbar/block-format/format-numbered-list'
import { FormatParagraph } from '@/components/rich-text/plugins/toolbar/block-format/format-paragraph'
import { FormatQuote } from '@/components/rich-text/plugins/toolbar/block-format/format-quote'
import { BlockInsertPlugin } from '@/components/rich-text/plugins/toolbar/block-insert-plugin'
import { InsertCollapsibleContainer } from '@/components/rich-text/plugins/toolbar/block-insert/insert-collapsible-container'
import { InsertColumnsLayout } from '@/components/rich-text/plugins/toolbar/block-insert/insert-columns-layout'
import { InsertEmbeds } from '@/components/rich-text/plugins/toolbar/block-insert/insert-embeds'
import { InsertExcalidraw } from '@/components/rich-text/plugins/toolbar/block-insert/insert-excalidraw'
import { InsertHorizontalRule } from '@/components/rich-text/plugins/toolbar/block-insert/insert-horizontal-rule'
import { InsertImage } from '@/components/rich-text/plugins/toolbar/block-insert/insert-image'
import { InsertInlineImage } from '@/components/rich-text/plugins/toolbar/block-insert/insert-inline-image'
import { InsertPageBreak } from '@/components/rich-text/plugins/toolbar/block-insert/insert-page-break'
import { InsertPoll } from '@/components/rich-text/plugins/toolbar/block-insert/insert-poll'
import { InsertTable } from '@/components/rich-text/plugins/toolbar/block-insert/insert-table'
import { ClearFormattingToolbarPlugin } from '@/components/rich-text/plugins/toolbar/clear-formatting-toolbar-plugin'
import { CodeLanguageToolbarPlugin } from '@/components/rich-text/plugins/toolbar/code-language-toolbar-plugin'
import { ElementFormatToolbarPlugin } from '@/components/rich-text/plugins/toolbar/element-format-toolbar-plugin'
import { FontBackgroundToolbarPlugin } from '@/components/rich-text/plugins/toolbar/font-background-toolbar-plugin'
import { FontColorToolbarPlugin } from '@/components/rich-text/plugins/toolbar/font-color-toolbar-plugin'
import { FontFamilyToolbarPlugin } from '@/components/rich-text/plugins/toolbar/font-family-toolbar-plugin'
import { FontFormatToolbarPlugin } from '@/components/rich-text/plugins/toolbar/font-format-toolbar-plugin'
import { FontSizeToolbarPlugin } from '@/components/rich-text/plugins/toolbar/font-size-toolbar-plugin'
import { HistoryToolbarPlugin } from '@/components/rich-text/plugins/toolbar/history-toolbar-plugin'
import { LinkToolbarPlugin } from '@/components/rich-text/plugins/toolbar/link-toolbar-plugin'
import { SubSuperToolbarPlugin } from '@/components/rich-text/plugins/toolbar/subsuper-toolbar-plugin'

import { CharacterLimitPlugin } from '@/components/rich-text/plugins/actions/character-limit-plugin'
import { ClearEditorActionPlugin } from '@/components/rich-text/plugins/actions/clear-editor-plugin'
import { EditModeTogglePlugin } from '@/components/rich-text/plugins/actions/edit-mode-toggle-plugin'
import { ImportExportPlugin } from '@/components/rich-text/plugins/actions/import-export-plugin'
import { MarkdownTogglePlugin } from '@/components/rich-text/plugins/actions/markdown-toggle-plugin'
import { MaxLengthPlugin } from '@/components/rich-text/plugins/actions/max-length-plugin'
import { ShareContentPlugin } from '@/components/rich-text/plugins/actions/share-content-plugin'
import { SpeechToTextPlugin } from '@/components/rich-text/plugins/actions/speech-to-text-plugin'
import { TreeViewPlugin } from '@/components/rich-text/plugins/actions/tree-view-plugin'
import { AutoLinkPlugin } from '@/components/rich-text/plugins/auto-link-plugin'
import { AutocompletePlugin } from '@/components/rich-text/plugins/autocomplete-plugin'
import { CodeActionMenuPlugin } from '@/components/rich-text/plugins/code-action-menu-plugin'
import { CodeHighlightPlugin } from '@/components/rich-text/plugins/code-highlight-plugin'
import { CollapsiblePlugin } from '@/components/rich-text/plugins/collapsible-plugin'
import { ComponentPickerMenuPlugin } from '@/components/rich-text/plugins/component-picker-plugin'
import { ContextMenuPlugin } from '@/components/rich-text/plugins/context-menu-plugin'
import { DragDropPastePlugin } from '@/components/rich-text/plugins/drag-drop-paste-plugin'
import { DraggableBlockPlugin } from '@/components/rich-text/plugins/draggable-block-plugin'
import { AutoEmbedPlugin } from '@/components/rich-text/plugins/embeds/auto-embed-plugin'
import { FigmaPlugin } from '@/components/rich-text/plugins/embeds/figma-plugin'
import { TwitterPlugin } from '@/components/rich-text/plugins/embeds/twitter-plugin'
import { YouTubePlugin } from '@/components/rich-text/plugins/embeds/youtube-plugin'
import { EmojiPickerPlugin } from '@/components/rich-text/plugins/emoji-picker-plugin'
import { EmojisPlugin } from '@/components/rich-text/plugins/emojis-plugin'
import { EquationsPlugin } from '@/components/rich-text/plugins/equations-plugin'
import { ExcalidrawPlugin } from '@/components/rich-text/plugins/excalidraw-plugin'
import { FloatingLinkEditorPlugin } from '@/components/rich-text/plugins/floating-link-editor-plugin'
import { FloatingTextFormatToolbarPlugin } from '@/components/rich-text/plugins/floating-text-format-toolbar-plugin'
import { ImagesPlugin } from '@/components/rich-text/plugins/images-plugin'
import { InlineImagePlugin } from '@/components/rich-text/plugins/inline-image-plugin'
import { KeywordsPlugin } from '@/components/rich-text/plugins/keywords-plugin'
import { LayoutPlugin } from '@/components/rich-text/plugins/layout-plugin'
import { LinkPlugin } from '@/components/rich-text/plugins/link-plugin'
import { ListMaxIndentLevelPlugin } from '@/components/rich-text/plugins/list-max-indent-level-plugin'
import { MentionsPlugin } from '@/components/rich-text/plugins/mentions-plugin'
import { PageBreakPlugin } from '@/components/rich-text/plugins/page-break-plugin'
import { PollPlugin } from '@/components/rich-text/plugins/poll-plugin'
import { TabFocusPlugin } from '@/components/rich-text/plugins/tab-focus-plugin'
import { TableActionMenuPlugin } from '@/components/rich-text/plugins/table-action-menu-plugin'
import { TableCellResizerPlugin } from '@/components/rich-text/plugins/table-cell-resizer-plugin'
import { TableHoverActionsPlugin } from '@/components/rich-text/plugins/table-hover-actions-plugin'
import { ToolbarPlugin } from '@/components/rich-text/plugins/toolbar/toolbar-plugin'
import { MARKDOWN_TRANSFORMERS } from '@/components/rich-text/transformers/markdown-transformers'
import { ContentEditable } from '@/components/rich-text/editor-ui/content-editable'
import { cn } from '@/lib/utils'
const placeholder = 'Press / for commands...'

export function Plugins({ maxLength = 500, className }: { maxLength?: number, className?: string }) {
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null)

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem)
    }
  }

  return (
    <div className="relative">
      <ToolbarPlugin>
        {({ blockType }) => (
          <div className="vertical-align-middle sticky top-0 z-10 flex gap-2 overflow-auto border-b p-1 bg-card">
            <HistoryToolbarPlugin />
            <Separator orientation="vertical" className="h-8" />
            <BlockFormatDropDown>
              <FormatParagraph />
              <FormatHeading levels={['h1', 'h2', 'h3']} />
              <FormatNumberedList />
              <FormatBulletedList />
              <FormatCheckList />
              <FormatCodeBlock />
              <FormatQuote />
            </BlockFormatDropDown>
            {blockType === 'code' ? (
              <CodeLanguageToolbarPlugin />
            ) : (
              <>
                <FontFamilyToolbarPlugin />
                <FontSizeToolbarPlugin />
                <Separator orientation="vertical" className="h-8" />
                <FontFormatToolbarPlugin format="bold" />
                <FontFormatToolbarPlugin format="italic" />
                <FontFormatToolbarPlugin format="underline" />
                <FontFormatToolbarPlugin format="strikethrough" />
                <Separator orientation="vertical" className="h-8" />
                <SubSuperToolbarPlugin />
                <LinkToolbarPlugin />
                <Separator orientation="vertical" className="h-8" />
                <ClearFormattingToolbarPlugin />
                <Separator orientation="vertical" className="h-8" />
                <FontColorToolbarPlugin />
                <FontBackgroundToolbarPlugin />
                <Separator orientation="vertical" className="h-8" />
                <ElementFormatToolbarPlugin />
                <Separator orientation="vertical" className="h-8" />
                <BlockInsertPlugin>
                  <InsertHorizontalRule />
                  <InsertPageBreak />
                  <InsertImage />
                  <InsertInlineImage />
                  <InsertCollapsibleContainer />
                  <InsertExcalidraw />
                  <InsertTable />
                  <InsertPoll />
                  <InsertColumnsLayout />
                  <InsertEmbeds />
                </BlockInsertPlugin>
              </>
            )}
          </div>
        )}
      </ToolbarPlugin>
      <div className="relative">
        <AutoFocusPlugin />
        <RichTextPlugin
          contentEditable={
            <div className="">
              <div className="" ref={onRef}>
                <ContentEditable placeholder={placeholder} className={cn('ContentEditable__root relative block min-h-72 overflow-auto px-8 py-4 focus:outline-none', className)} />
              </div>
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />

        <ClickableLinkPlugin />
        <CheckListPlugin />
        <HorizontalRulePlugin />
        <TablePlugin />
        <ListPlugin />
        <TabIndentationPlugin />
        <HashtagPlugin />
        <HistoryPlugin />

        <MentionsPlugin />
        <PageBreakPlugin />
        <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
        <KeywordsPlugin />
        <EmojisPlugin />
        <ImagesPlugin />
        <InlineImagePlugin />
        <ExcalidrawPlugin />
        <TableCellResizerPlugin />
        <TableHoverActionsPlugin anchorElem={floatingAnchorElem} />
        <TableActionMenuPlugin
          anchorElem={floatingAnchorElem}
          cellMerge={true}
        />
        <PollPlugin />
        <LayoutPlugin />
        <EquationsPlugin />
        <CollapsiblePlugin />

        <AutoEmbedPlugin />
        <FigmaPlugin />
        <TwitterPlugin />
        <YouTubePlugin />

        <CodeHighlightPlugin />
        <CodeActionMenuPlugin anchorElem={floatingAnchorElem} />

        <MarkdownShortcutPlugin transformers={MARKDOWN_TRANSFORMERS} />
        <TabFocusPlugin />
        <AutocompletePlugin />
        <AutoLinkPlugin />
        <LinkPlugin />

        <ComponentPickerMenuPlugin />
        <ContextMenuPlugin />
        <DragDropPastePlugin />
        <EmojiPickerPlugin />

        <FloatingLinkEditorPlugin anchorElem={floatingAnchorElem} />
        <FloatingTextFormatToolbarPlugin anchorElem={floatingAnchorElem} />

        <ListMaxIndentLevelPlugin />
      </div>
      <div className="clear-both flex h-10 items-center justify-between border-t p-1">
        <MaxLengthPlugin maxLength={maxLength} />
        <CharacterLimitPlugin maxLength={maxLength} charset="UTF-16" />
        <div className="flex justify-end">
          <SpeechToTextPlugin />
          <ShareContentPlugin />
          <ImportExportPlugin />
          <MarkdownTogglePlugin shouldPreserveNewLinesInMarkdown={true} />
          <EditModeTogglePlugin />
          <>
            <ClearEditorActionPlugin />
            <ClearEditorPlugin />
          </>
          <TreeViewPlugin />
        </div>
      </div>
    </div>
  )
}
