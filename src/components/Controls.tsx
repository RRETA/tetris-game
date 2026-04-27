interface ControlsProps {
  onLeft: () => void;
  onRight: () => void;
  onDown: () => void;
  onRotate: () => void;
  onDrop: () => void;
  onPause: () => void;
  onRestart: () => void;
  paused: boolean;
  gameOver: boolean;
}

function Btn({ label, sub, onClick, wide }: { label: string; sub?: string; onClick: () => void; wide?: boolean }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: '#12122a',
        border: '1px solid #2a2a5a',
        color: '#c0b0ff',
        fontFamily: 'monospace',
        fontSize: sub ? 10 : 18,
        fontWeight: 700,
        width: wide ? '100%' : 52,
        height: 44,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 1,
        gap: 2,
        userSelect: 'none',
        WebkitUserSelect: 'none',
        touchAction: 'manipulation',
        transition: 'background 0.1s',
      }}
      onPointerDown={e => {
        (e.currentTarget as HTMLButtonElement).style.background = '#1e1e44';
      }}
      onPointerUp={e => {
        (e.currentTarget as HTMLButtonElement).style.background = '#12122a';
      }}
      onPointerLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.background = '#12122a';
      }}
    >
      <span style={{ fontSize: wide ? 13 : 18 }}>{label}</span>
      {sub && <span style={{ fontSize: 9, color: '#666', marginTop: 1 }}>{sub}</span>}
    </button>
  );
}

export function Controls({ onLeft, onRight, onDown, onRotate, onDrop, onPause, onRestart, paused, gameOver }: ControlsProps) {
  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ fontSize: 10, letterSpacing: 3, color: '#444', fontFamily: 'monospace', textTransform: 'uppercase', marginBottom: 10, textAlign: 'center' }}>
        Controls
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
        <Btn label="↑" sub="Rotate" onClick={onRotate} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 4 }}>
        <Btn label="←" onClick={onLeft} />
        <Btn label="↓" sub="Down" onClick={onDown} />
        <Btn label="→" onClick={onRight} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
        <Btn label="⬇ Drop" wide onClick={onDrop} />
      </div>

      <div style={{ display: 'flex', gap: 4 }}>
        <button
          onClick={onPause}
          disabled={gameOver}
          style={{
            flex: 1,
            background: paused ? '#1a0a30' : '#0d0d1a',
            border: `1px solid ${paused ? '#aa00ff' : '#1a1a3a'}`,
            color: paused ? '#aa00ff' : '#888',
            fontFamily: 'monospace',
            fontSize: 11,
            letterSpacing: 2,
            padding: '8px 0',
            cursor: gameOver ? 'not-allowed' : 'pointer',
            textTransform: 'uppercase',
          }}
        >
          {paused ? 'Resume' : 'Pause'}
        </button>
        <button
          onClick={onRestart}
          style={{
            flex: 1,
            background: '#0d0d1a',
            border: '1px solid #1a1a3a',
            color: '#888',
            fontFamily: 'monospace',
            fontSize: 11,
            letterSpacing: 2,
            padding: '8px 0',
            cursor: 'pointer',
            textTransform: 'uppercase',
          }}
        >
          Restart
        </button>
      </div>
    </div>
  );
}
