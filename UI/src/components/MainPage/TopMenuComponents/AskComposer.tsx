// src/components/MainPage/AskComposer.tsx
import { useRef, useState } from "react";

type Props = {
  placeholder?: string;
  defaultValue?: string;
  onSend?: (text: string) => void;
  disabled?: boolean;
  className?: string;
  maxLength?: number; // <— NUEVO
};

export default function AskComposer({
  placeholder = "search a book",
  defaultValue = "",
  onSend,
  disabled = false,
  className = "",
  maxLength = 120, // <— NUEVO (por defecto)
}: Props) {
  const [text, setText] = useState(defaultValue);
  const taRef = useRef<HTMLTextAreaElement>(null);

  const submit = () => {
    if (disabled) return;
    const value = text.trim();   // puede ser ""
    onSend?.(value);             // ← ahora sí enviamos aunque esté vacío
    setText("");
  };


  const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
      }
    };

  const onChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    // fuerza 1 renglón y respeta maxLength
    const raw = e.target.value.replace(/\r?\n/g, " ");
    setText(raw.slice(0, maxLength));
  };

  return (
    <div className={className} aria-label="Ask composer">
      <div className="relative rounded-2xl bg-[#E6E6E6] shadow-sm ring-1 ring-black/10">
        <textarea
          ref={taRef}
          rows={1}
          value={text}
          disabled={disabled}
          placeholder={placeholder}
          spellCheck
          onKeyDown={onKeyDown}
          onChange={onChange}
          maxLength={maxLength} // <— también a nivel de atributo
          className="w-full resize-none border-0 bg-transparent focus:outline-none
                     text-[20px] leading-6 text-[#1a1a1a] placeholder:text-[#66b3a3]
                     px-4 py-3 pr-16"
        />
        <button
          type="button"
          onClick={submit}
          disabled={disabled || text.trim().length === 0}
          className="absolute right-3 bottom-2 h-10 w-12 rounded-xl flex items-center justify-center
                     bg-[#007B61] hover:bg-[#00A482] disabled:opacity-50 text-white shadow-sm
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
          aria-label="Send"
          title="Send (Enter)"
        >
          ➤
        </button>
      </div>
    </div>
  );
}
