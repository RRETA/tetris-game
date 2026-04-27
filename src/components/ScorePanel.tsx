interface ScorePanelProps {
  score: number;
  lines: number;
  level: number;
}

function StatBox({ label, value }: { label: string; value: number | string }) {
  return (
    <div
      style={{
        background: '#0d0d1a',
        border: '1px solid #1a1a3a',
        padding: '10px 14px',
        marginBottom: 8,
      }}
    >
      <div style={{ fontSize: 10, letterSpacing: 3, color: '#555', fontFamily: 'monospace', textTransform: 'uppercase', marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, color: '#e0d0ff', fontFamily: 'monospace', letterSpacing: 2 }}>
        {value}
      </div>
    </div>
  );
}

export function ScorePanel({ score, lines, level }: ScorePanelProps) {
  return (
    <div style={{ width: 110 }}>
      <StatBox label="Score" value={score.toLocaleString()} />
      <StatBox label="Lines" value={lines} />
      <StatBox label="Level" value={level} />
    </div>
  );
}
