// src/components/MainPage/TopMenuComponents/AvatarMenu.tsx
import { useEffect, useRef, useState } from "react";

type Props = { onLogout?: () => void };

export default function AvatarMenu({ onLogout }: Props) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const avatarUrl = `${import.meta.env.BASE_URL}images/cuenta.png`;

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user") || "{}"); } catch { return {}; }
  })();

  const displayName =
    user?.nickname || user?.name || user?.username || "Invitado";

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!open) return;
      const t = e.target as Node;
      if (menuRef.current?.contains(t) || btnRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (open && e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
        className="inline-flex items-center justify-center rounded-lg overflow-hidden w-[60px] h-[60px]
                   bg-[#007B61] hover:bg-[#014637] transition
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
      >
        {/* 👇 sin import; Vite servirá /images/cuenta.png desde public */}
        <img
          src={avatarUrl}
          alt="Perfil"
          className="w-full h-full object-cover bg-[#007B61]"
          draggable={false}
        />
      </button>

      {open && (
        <div
          ref={menuRef}
          role="menu"
          className="absolute right-0 top-14 w-60 rounded-xl shadow-lg z-50
                     bg-[#007B61] ring-1 ring-black/10 text-[#D9D9D9] p-2"
        >
          <div className="px-3 py-2 text-[14px] opacity-90">{displayName}</div>
          <button
            role="menuitem"
            onClick={onLogout}
            className="mt-1 w-full text-left px-3 py-2 rounded-lg
                       bg-[#007B61] hover:bg-[#014637] transition text-[16px] font-medium text-[#D9D9D9]
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}
