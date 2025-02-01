"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import { ComponentPropsWithoutRef, useState } from "react"
import { cn } from "@/lib/utils"
import { extensions } from "@/lib/utils/tiptap-extentions"
import { RichTextEditorToolbar } from "./rich-text-editor-toolbar"
import { Separator } from "@repo/ui/components/separator"
export interface RichTextEditorProps extends Omit<ComponentPropsWithoutRef<"div">, "onChange"> {
  onChange: (content: string) => void
  initialContent?: string
}

export function RichTextEditor({ onChange, initialContent = "<p>Start typing here...</p>", className, ...props }: RichTextEditorProps) {
  const editor = useEditor({
    extensions,
    content: initialContent,
    editorProps: {
      attributes: {
        class: "prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!editor) {
    return null
  }

  return (
    <div className={cn("border rounded-lg shadow-sm py-2", className)} {...props}>
      <RichTextEditorToolbar editor={editor} className="px-2" />
      <Separator className="my-1" />
      <EditorContent editor={editor} className="px-2" />
    </div>
  )
}