import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import {
  MdFormatBold,
  MdFormatItalic,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdCode,
  MdFormatQuote,
} from "react-icons/md";
import { cn } from "@/lib/utils";

interface TipTapEditorProps {
  value?: string;
  onChange: (html: string) => void;
  error?: string;
  placeholder?: string;
}

const ToolbarButton = ({
  onClick,
  isActive = false,
  title,
  children,
}: {
  onClick: () => void;
  isActive?: boolean;
  title: string;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    className={cn(
      "p-1.5 rounded-md transition-colors",
      isActive
        ? "bg-brand-500/15 text-brand-400"
        : "text-muted-foreground hover:text-foreground hover:bg-secondary",
    )}
  >
    {children}
  </button>
);

export const TipTapEditor = ({
  value,
  onChange,
  error,
  placeholder = "Describe the issue in detail...",
}: TipTapEditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || `<p></p>`,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html === "<p></p>" ? "" : html);
    },
    editorProps: {
      attributes: {
        class:
          "outline-none min-h-[260px] px-4 py-3 text-sm leading-relaxed text-foreground",
      },
    },
  });

  useEffect(() => {
    if (editor && value && editor.getHTML() !== value) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  if (!editor) return null;

  return (
    <div
      className={cn(
        "rounded-xl border overflow-hidden",
        "transition-all duration-150",
        error
          ? "border-red-500/40"
          : "border-border focus-within:border-brand-500/50 focus-within:shadow-[0_0_0_3px_rgba(99,102,241,0.08)]",
      )}
    >
      <div className="flex items-center gap-0.5 px-2 py-2 border-b border-border bg-secondary/50">
        <ToolbarButton
          title="Bold (Ctrl+B)"
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
        >
          <MdFormatBold size={17} />
        </ToolbarButton>
        <ToolbarButton
          title="Italic (Ctrl+I)"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
        >
          <MdFormatItalic size={17} />
        </ToolbarButton>
        <ToolbarButton
          title="Inline Code"
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive("code")}
        >
          <MdCode size={17} />
        </ToolbarButton>

        <div className="w-px h-4 bg-border mx-1" />

        <ToolbarButton
          title="Bullet List"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
        >
          <MdFormatListBulleted size={17} />
        </ToolbarButton>
        <ToolbarButton
          title="Numbered List"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
        >
          <MdFormatListNumbered size={17} />
        </ToolbarButton>
        <ToolbarButton
          title="Blockquote"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
        >
          <MdFormatQuote size={17} />
        </ToolbarButton>

        <div className="ml-auto text-[10px] text-muted-foreground font-mono px-2">
          {editor.getText().trim().split(/\s+/).filter(Boolean).length} words
        </div>
      </div>

      <div className="relative bg-secondary/20">
        <EditorContent editor={editor} />

        {editor.isEmpty && (
          <div
            className="
            absolute top-0 left-0 right-0
            px-4 py-3 text-sm text-muted-foreground/50
            pointer-events-none select-none
            whitespace-pre-line
          "
          >
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
};
