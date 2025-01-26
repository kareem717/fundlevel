"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import {
  Bold,
  Italic,
  UnderlineIcon,
  Heading1,
  Heading2,
  AlignLeft,
  AlignJustify,
  AlignRight,
  AlignCenter,
} from "lucide-react"
import { ComponentPropsWithoutRef, useState } from "react"
import { cn } from "@/lib/utils"
import { Toggle } from "@repo/ui/components/toggle"
import TextAlign from '@tiptap/extension-text-align'

export interface RichTextEditorProps extends Omit<ComponentPropsWithoutRef<"div">, "onChange"> {
  onChange: (content: string) => void
  initialContent?: string
}

export function RichTextEditor({ onChange, initialContent = "<p>Start typing here..</p>", className, ...props }: RichTextEditorProps) {
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right" | "justify">("justify")

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
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

  const handleTextAlign = () => {
    const nextAlign = textAlign === "left" ? "center"
      : textAlign === "center" ? "right"
        : textAlign === "right" ? "justify"
          : "left";

    setTextAlign(nextAlign);
    editor.chain().focus().setTextAlign(nextAlign).run();
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
          onClick={() => handleTextAlign()}
        >
          {textAlign === "left" ? <AlignLeft className="size-4" /> :
            textAlign === "center" ? <AlignCenter className="size-4" /> :
              textAlign === "right" ? <AlignRight className="size-4" /> :
                <AlignJustify className="size-4" />}
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