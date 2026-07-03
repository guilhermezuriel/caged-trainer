const WIDTH = 104;
const HEIGHT = 128;
const PAD_X = 16;
const PAD_TOP = 30;
const ROWS = 4;

const COL_GAP = (WIDTH - 2 * PAD_X) / 5;
const ROW_GAP = (HEIGHT - PAD_TOP - 12) / ROWS;

const COLORS = {
  line: "#57534e",
  nut: "#d6d3d1",
  dot: "#fbbf24",
  text: "#a8a29e",
};

const stringX = (i) => PAD_X + i * COL_GAP;

export function ChordDiagram({ frets }) {
  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      width="104"
      height="128"
      role="img"
      aria-label="Diagrama de acorde"
    >
      <rect
        x={PAD_X}
        y={PAD_TOP - 3}
        width={WIDTH - 2 * PAD_X}
        height={3}
        fill={COLORS.nut}
      />

      {Array.from({ length: ROWS }, (_, r) => (
        <line
          key={r}
          x1={PAD_X}
          y1={PAD_TOP + (r + 1) * ROW_GAP}
          x2={WIDTH - PAD_X}
          y2={PAD_TOP + (r + 1) * ROW_GAP}
          stroke={COLORS.line}
          strokeWidth="1"
        />
      ))}

      {Array.from({ length: 6 }, (_, i) => (
        <line
          key={i}
          x1={stringX(i)}
          y1={PAD_TOP}
          x2={stringX(i)}
          y2={PAD_TOP + ROWS * ROW_GAP}
          stroke={COLORS.line}
          strokeWidth="1"
        />
      ))}

      {frets.map((v, i) => {
        const x = stringX(i);
        if (v === "x") {
          return (
            <text
              key={i}
              x={x}
              y={PAD_TOP - 8}
              fontSize="11"
              fill={COLORS.text}
              textAnchor="middle"
            >
              ×
            </text>
          );
        }
        if (v === 0) {
          return (
            <circle
              key={i}
              cx={x}
              cy={PAD_TOP - 11}
              r="4"
              fill="none"
              stroke={COLORS.text}
              strokeWidth="1.2"
            />
          );
        }
        const cy = PAD_TOP + (v - 0.5) * ROW_GAP;
        return <circle key={i} cx={x} cy={cy} r="6.5" fill={COLORS.dot} />;
      })}
    </svg>
  );
}
