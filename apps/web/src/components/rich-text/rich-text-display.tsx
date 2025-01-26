
"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import { ComponentPropsWithoutRef } from "react"

export interface RichTextDisplayProps extends ComponentPropsWithoutRef<"div"> {
  content: string
}

//TODO: fix flashes
export function RichTextDisplay({ content, ...props }: RichTextDisplayProps) {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: content,
    editable: false,
    shouldRerenderOnTransaction: false,
  })

  if (!editor) {
    return null
  }

  return (
    <div {...props}>
      <EditorContent editor={editor} />
    </div>
  )
}