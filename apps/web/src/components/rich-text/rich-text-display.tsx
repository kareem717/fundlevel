
"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import { ComponentPropsWithoutRef } from "react"
import { extensions } from "@/lib/utils/tiptap-extentions"
export interface RichTextDisplayProps extends ComponentPropsWithoutRef<"div"> {
  content: string
}

//TODO: fix flashes
export function RichTextDisplay({ content, ...props }: RichTextDisplayProps) {
  const editor = useEditor({
    extensions,
    content,
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