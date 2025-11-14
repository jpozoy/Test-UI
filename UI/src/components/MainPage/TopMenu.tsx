// src/components/MainPage/TopMenu.tsx
import AskComposer from "./TopMenuComponents/AskComposer";
import AvatarMenu from "./TopMenuComponents/AvatarMenu";
import { useNavigate } from "react-router-dom";

type Props = {
    onSearch?: (q: string) => void; // ← NUEVO
  };

export default function TopMenu({ onSearch }: Props) {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#007B61] shadow">
      <div className="mx-auto w-full max-w-[min(96vw,1280px)] h-20 px-6 flex items-center gap-4">
        {/* espacio a la izquierda si luego agregas tabs */}
        <div className="w-[60px] shrink-0" />
        {/* composer centrado */}
        <div className="flex-1 flex justify-center">
          <AskComposer className="w-full max-w-[860px]" onSend={onSearch}/>
        </div>
        {/* avatar a la derecha */}
        <div className="shrink-0">
          <AvatarMenu
            onLogout={() => navigate("/login")}

          />
        </div>
      </div>
    </header>
  );
}
