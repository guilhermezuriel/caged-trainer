import { NOTES_PT, OPEN_PITCH, STRING_NUM } from "../../constants/notes.js";
import { INLAYS, NUM_FRETS } from "../../constants/shapes.js";
import { noteAt } from "../../utils/music.js";
import { FretCell } from "./FretCell.jsx";

const STRING_ROWS = [5, 4, 3, 2, 1, 0];
const FRETS = Array.from({ length: NUM_FRETS + 1 }, (_, f) => f);

export function Fretboard({
  board,
  correct,
  rootIdx,
  checked,
  perString,
  showAnswer,
  showNotes,
  onPlace,
}) {
  return (
    <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-3 overflow-x-auto">
      <div className="min-w-max">
        <FretHeader />
        {STRING_ROWS.map((i) => (
          <StringRow
            key={i}
            stringIdx={i}
            board={board}
            correct={correct}
            rootIdx={rootIdx}
            checked={checked}
            right={perString[i]}
            showAnswer={showAnswer}
            showNotes={showNotes}
            onPlace={onPlace}
          />
        ))}
      </div>
    </div>
  );
}

function FretHeader() {
  return (
    <div className="flex select-none">
      <div className="w-14 shrink-0" />
      <div className="w-9 shrink-0 text-center text-[10px] text-stone-600 pb-1">
        ✕
      </div>
      {FRETS.map((f) => (
        <div
          key={f}
          className="w-9 shrink-0 text-center text-[10px] text-stone-500 pb-1 tabular-nums relative"
        >
          {f}
          {(INLAYS.has(f) || f === 12) && (
            <span className="absolute left-1/2 -translate-x-1/2 top-3 flex gap-0.5">
              <span className="w-1 h-1 rounded-full bg-stone-600" />
              {f === 12 && <span className="w-1 h-1 rounded-full bg-stone-600" />}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function StringRow({
  stringIdx,
  board,
  correct,
  rootIdx,
  checked,
  right,
  showAnswer,
  showNotes,
  onPlace,
}) {
  const thick = stringIdx <= 2 ? "h-0.5" : "h-px";
  const muted = board[stringIdx] === "x";
  const answerMuted = (showAnswer || checked) && correct[stringIdx] === "x";

  return (
    <div className="flex items-stretch">
      <div className="w-14 shrink-0 flex items-center justify-end pr-2 text-xs">
        <span className="tabular-nums font-medium text-stone-400">
          {STRING_NUM[stringIdx]}
        </span>
        <span className="ml-1 text-stone-600">
          {NOTES_PT[OPEN_PITCH[stringIdx]]}
        </span>
      </div>

      <button
        onClick={() => onPlace(stringIdx, "x")}
        className="w-9 h-11 shrink-0 grid place-items-center border-r border-stone-800"
        title="Abafar"
      >
        {muted ? (
          <span className="text-lg font-bold text-rose-400 leading-none">×</span>
        ) : answerMuted ? (
          <span className="text-lg font-bold text-amber-400/50 leading-none">×</span>
        ) : (
          <span className="text-sm text-stone-700 leading-none">×</span>
        )}
      </button>

      {FRETS.map((f) => (
        <FretCell
          key={f}
          isOpen={f === 0}
          thick={thick}
          user={board[stringIdx] === f}
          isRoot={rootIdx === stringIdx}
          correctHere={correct[stringIdx] === f}
          showAnswer={showAnswer}
          checked={checked}
          right={right}
          note={showNotes ? noteAt(stringIdx, f) : null}
          onClick={() => onPlace(stringIdx, f)}
        />
      ))}
    </div>
  );
}
