
"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import { Bold, Italic, UnderlineIcon, Heading1, Heading2 } from "lucide-react"
import { ComponentPropsWithoutRef } from "react"
import { cn } from "@/lib/utils"
import { Toggle } from "@repo/ui/components/toggle"

export interface RichTextEditorProps extends Omit<ComponentPropsWithoutRef<"div">, "onChange"> {
  onChange: (content: string) => void
  initialContent?: string
}

export function RichTextEditor({ onChange, initialContent = "<p>Start typing here..</p>", className, ...props }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: initialContent,
    editorProps: {
      attributes: {
        class: "prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none",
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
    <div className={cn("border rounded-lg shadow-sm", className)} {...props}>
      <div className="flex flex-wrap gap-2 p-2 border-b">
        <Toggle
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          pressed={editor.isActive("bold")}
        >
          <Bold className="size-4" />
        </Toggle>
        <Toggle
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          pressed={editor.isActive("italic")}
        >
          <Italic className="size-4" />
        </Toggle>
        <Toggle
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editor.can().chain().focus().toggleUnderline().run()}
          pressed={editor.isActive("underline")}
        >
          <UnderlineIcon className="size-4" />
        </Toggle>
        <Toggle
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          disabled={!editor.can().chain().focus().toggleHeading({ level: 1 }).run()}
          pressed={editor.isActive("heading", { level: 1 })}
        >
          <Heading1 className="size-4" />
        </Toggle>
        <Toggle
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          disabled={!editor.can().chain().focus().toggleHeading({ level: 2 }).run()}
          pressed={editor.isActive("heading", { level: 2 })}
        >
          <Heading2 className="size-4" />
        </Toggle>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}