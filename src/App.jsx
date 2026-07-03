import { useState } from "react";
import { Header } from "./components/layout/Header.jsx";
import { Reference } from "./components/reference/Reference.jsx";
import { Trainer } from "./components/trainer/Trainer.jsx";

export default function App() {
  const [tab, setTab] = useState("treino");

  return (
    <div className="min-h-screen w-full bg-stone-950 text-stone-100 font-sans">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
        <Header tab={tab} onTabChange={setTab} />
        {tab === "treino" ? <Trainer /> : <Reference />}
      </div>
    </div>
  );
}
