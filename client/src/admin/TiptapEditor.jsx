import { useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { Youtube } from "@tiptap/extension-youtube";
import { TableKit } from "@tiptap/extension-table";
import { Placeholder } from "@tiptap/extension-placeholder";
import { toast } from "sonner";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Heading2, Heading3,
  List, ListOrdered, Quote, Code2, Minus, Link2, Image as ImageIcon,
  Table as TableIcon, Youtube as YoutubeIcon, Undo2, Redo2,
} from "lucide-react";
import { uploadImage } from "@/lib/api";

// TipTap rich-text editor — HTML chiqaradi (serverda sanitize qilinadi).
// Toolbar: H2/H3, bold/italic/underline, ro'yxatlar, quote, kod, divider,
// link, rasm (yuklash), jadval, video (YouTube).
export default function TiptapEditor({ value, onChange, placeholder }) {
  const lastValue = useRef(value || "");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        link: { openOnClick: false, autolink: true, HTMLAttributes: { rel: "noopener noreferrer" } },
      }),
      Image.configure({ HTMLAttributes: { loading: "lazy" } }),
      Youtube.configure({ width: 640, height: 360, nocookie: true }),
      TableKit.configure({ table: { resizable: true } }),
      Placeholder.configure({ placeholder: placeholder || "Maqola matnini yozing…" }),
    ],
    content: value || "",
    editorProps: {
      attributes: { class: "article-prose tiptap-content focus:outline-none" },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      lastValue.current = html;
      onChange(html);
    },
  });

  // Tashqi qiymat o'zgarsa (masalan, tahrirlash uchun yuklanganda) — sinxronlaymiz.
  useEffect(() => {
    if (!editor) return;
    if ((value || "") !== lastValue.current) {
      lastValue.current = value || "";
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) return null;

  const addLink = () => {
    const prev = editor.getAttributes("link").href || "";
    const url = window.prompt("Havola manzili (URL):", prev);
    if (url === null) return;
    if (url === "") return editor.chain().focus().unsetLink().run();
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const addImage = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const url = await uploadImage(file);
      editor.chain().focus().setImage({ src: url }).run();
    } catch (err) {
      toast.error(err.message || "Rasm yuklanmadi");
    }
  };

  const addYoutube = () => {
    const url = window.prompt("YouTube video havolasi:");
    if (url) editor.commands.setYoutubeVideo({ src: url });
  };

  const insertTable = () =>
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();

  return (
    <div className="rounded-xl border border-navy/15 dark:border-white/15">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-navy/10 p-1.5 dark:border-white/10">
        <Btn on={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Sarlavha 2"><Heading2 className="h-[18px] w-[18px]" /></Btn>
        <Btn on={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Sarlavha 3"><Heading3 className="h-[18px] w-[18px]" /></Btn>
        <Sep />
        <Btn on={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Qalin"><Bold className="h-[17px] w-[17px]" /></Btn>
        <Btn on={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Kursiv"><Italic className="h-[17px] w-[17px]" /></Btn>
        <Btn on={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Tagchiziq"><UnderlineIcon className="h-[17px] w-[17px]" /></Btn>
        <Btn on={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Chizilgan"><Strikethrough className="h-[17px] w-[17px]" /></Btn>
        <Sep />
        <Btn on={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Ro'yxat"><List className="h-[18px] w-[18px]" /></Btn>
        <Btn on={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Raqamli ro'yxat"><ListOrdered className="h-[18px] w-[18px]" /></Btn>
        <Btn on={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Iqtibos"><Quote className="h-[17px] w-[17px]" /></Btn>
        <Btn on={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} title="Kod bloki"><Code2 className="h-[17px] w-[17px]" /></Btn>
        <Btn on={() => editor.chain().focus().setHorizontalRule().run()} title="Ajratuvchi chiziq"><Minus className="h-[18px] w-[18px]" /></Btn>
        <Sep />
        <Btn on={addLink} active={editor.isActive("link")} title="Havola"><Link2 className="h-[17px] w-[17px]" /></Btn>
        <label className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-500 hover:bg-navy/[.06] hover:text-navy dark:text-slate-300 dark:hover:bg-white/[.06] dark:hover:text-white" title="Rasm">
          <ImageIcon className="h-[17px] w-[17px]" />
          <input type="file" accept="image/*" onChange={addImage} className="hidden" />
        </label>
        <Btn on={insertTable} title="Jadval"><TableIcon className="h-[17px] w-[17px]" /></Btn>
        <Btn on={addYoutube} title="YouTube video"><YoutubeIcon className="h-[18px] w-[18px]" /></Btn>
        <Sep />
        <Btn on={() => editor.chain().focus().undo().run()} title="Ortga"><Undo2 className="h-[17px] w-[17px]" /></Btn>
        <Btn on={() => editor.chain().focus().redo().run()} title="Oldinga"><Redo2 className="h-[17px] w-[17px]" /></Btn>
      </div>
      <EditorContent editor={editor} className="tiptap-scroll max-h-[560px] overflow-y-auto px-4 py-3" />
    </div>
  );
}

function Btn({ on, active, title, children }) {
  return (
    <button
      type="button"
      onClick={on}
      title={title}
      className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
        active
          ? "bg-azure/15 text-azure"
          : "text-slate-500 hover:bg-navy/[.06] hover:text-navy dark:text-slate-300 dark:hover:bg-white/[.06] dark:hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function Sep() {
  return <span className="mx-1 h-5 w-px bg-navy/10 dark:bg-white/10" />;
}
