import { BookOpen, Guitar, Target } from "lucide-react";
import { TabButton } from "../ui/TabButton.jsx";

export function Header({ tab, onTabChange }) {
  return (
    <header className="flex items-center justify-between gap-3 mb-5">
      <div className="flex items-center gap-3">
        <div className="grid place-items-center w-10 h-10 rounded-lg bg-amber-500/15 text-amber-400">
          <Guitar className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight leading-none">
            Estúdio CAGED
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Treine as formas e consulte os acordes
          </p>
        </div>
      </div>
      <nav className="flex rounded-lg bg-stone-900 border border-stone-800 p-1 text-sm">
        <TabButton
          active={tab === "treino"}
          onClick={() => onTabChange("treino")}
          icon={<Target className="w-4 h-4" />}
        >
          Treino
        </TabButton>
        <TabButton
          active={tab === "consulta"}
          onClick={() => onTabChange("consulta")}
          icon={<BookOpen className="w-4 h-4" />}
        >
          Consulta
        </TabButton>
      </nav>
    </header>
  );
}
