'use client'

import {
  InitialConfigType,
  InitialEditorStateType,
  LexicalComposer,
} from '@lexical/react/LexicalComposer'
import { editorTheme } from '@/components/rich-text/themes/editor-theme'
import { nodes } from './nodes'
import { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import '@/components/rich-text/themes/editor-theme.css'
import '@/components/rich-text/nodes/page-break-node.css'

const editorConfig: InitialConfigType = {
  namespace: 'Viewer',
  theme: editorTheme,
  nodes,
  onError: (error: Error) => {
    console.error(error)
  },
  editable: false,
}

export interface LexicalViewerProps extends ComponentPropsWithoutRef<'div'> {
  editorState: InitialEditorStateType
  contentClassName?: string
}

export function LexicalViewer({
  className,
  editorState,
  contentClassName,
  ...props
}: LexicalViewerProps) {
  return (
    <div className={cn("overflow-hidden bg-background", className)} {...props}>
      <LexicalComposer
        initialConfig={{
          ...editorConfig,
          editorState,
        }}
      >
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              placeholder=''
              className={cn('ContentEditable__root relative block min-h-72 overflow-auto px-8 py-4 focus:outline-none', contentClassName)}
              aria-placeholder=''
            />
          }
          placeholder={null}
          ErrorBoundary={() => (
            <div>
              <p>Error</p>
            </div>
          )}
        />
      </LexicalComposer>
    </div>
  )
}
