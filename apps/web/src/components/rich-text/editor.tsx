'use client'

import {
  InitialConfigType,
  InitialEditorStateType,
  LexicalComposer,
} from '@lexical/react/LexicalComposer'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { EditorState, SerializedEditorState } from 'lexical'

import { FloatingLinkContext } from '@/components/rich-text/context/floating-link-context'
import { SharedAutocompleteContext } from '@/components/rich-text/context/shared-autocomplete-context'
import { editorTheme } from '@/components/rich-text/themes/editor-theme'
import { TooltipProvider } from '@workspace/ui/components/tooltip'

import { nodes } from './nodes'
import { Plugins } from './plugins'
import { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

const editorConfig: InitialConfigType = {
  namespace: 'Editor',
  theme: editorTheme,
  nodes,
  onError: (error: Error) => {
    console.error(error)
  },
}

export interface LexicalEditorProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onChange'> {
  initialEditorState?: InitialEditorStateType
  onChange?: (editorState: EditorState) => void
  onSerializedChange?: (editorSerializedState: SerializedEditorState) => void
  maxLength?: number
  contentClassName?: string
}

export function LexicalEditor({
  initialEditorState,
  onChange,
  onSerializedChange,
  className,
  maxLength,
  contentClassName,
  ...props
}: LexicalEditorProps) {
  return (
    <div className={cn("overflow-hidden rounded-lg border bg-background shadow", className)} {...props}>
      <LexicalComposer
        initialConfig={{
          ...editorConfig,
          ...(initialEditorState ? { editorState: initialEditorState } : {}),
        }}
      >
        <TooltipProvider>
          <SharedAutocompleteContext>
            <FloatingLinkContext>
              <Plugins maxLength={maxLength} className={contentClassName} />
              <OnChangePlugin
                ignoreSelectionChange={true}
                onChange={(editorState) => {
                  onChange?.(editorState)
                  onSerializedChange?.(editorState.toJSON())
                }}
              />
            </FloatingLinkContext>
          </SharedAutocompleteContext>
        </TooltipProvider>
      </LexicalComposer>
    </div>
  )
}
