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
import { ErrorBoundary } from 'react-error-boundary'
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
}

export function LexicalViewer({
  className,
  editorState,
  ...props
}: LexicalViewerProps) {
  return (
    <div className={cn("overflow-hidden rounded-lg border bg-background shadow", className)} {...props}>
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
              className="min-h-[50px] px-4 py-2 focus:outline-none cursor-default"
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
