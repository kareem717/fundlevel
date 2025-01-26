
"use client"

import { useEditor, EditorContent, type Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { ComponentPropsWithoutRef, Suspense } from "react"

export interface RichTextDisplayProps extends ComponentPropsWithoutRef<"div"> {
  content: string
}

//TODO: fix flashes
export function RichTextDisplay({ content, className, ...props }: RichTextDisplayProps) {
  const editor = useEditor({
    extensions: [StarterKit],
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