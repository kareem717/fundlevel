import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";

export const extensions = [
	StarterKit,
	Highlight,
	Typography,
	TextAlign.configure({
		types: ["heading", "paragraph"],
	}),
	Underline,
];