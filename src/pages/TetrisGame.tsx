import { useReducer, useEffect, useCallback, useRef } from 'react';
import { gameReducer, createInitialState, calcDropInterval } from '../game/engine';
import { TetrisBoard } from '../components/TetrisBoard';
import { NextPiece } from '../components/NextPiece';
import { ScorePanel } from '../components/ScorePanel';
import { Controls } from '../components/Controls';

export function TetrisGame() {
  const [state, dispatch] = useReducer(gameReducer, createInitialState());
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  const startTick = useCallback(() => {
    if (tickRef.current) clearInterval(tickRef.current);
    const interval = calcDropInterval(stateRef.current.level);
    tickRef.current = setInterval(() => {
      if (!stateRef.current.paused && !stateRef.current.gameOver) {
        dispatch({ type: 'TICK' });
      }
    }, interval);
  }, []);

  useEffect(() => {
    startTick();
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [state.level, startTick]);

  useEffect(() => {
    if (state.gameOver && tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, [state.gameOver]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          dispatch({ type: 'MOVE_LEFT' });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          dispatch({ type: 'MOVE_RIGHT' });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          dispatch({ type: 'MOVE_DOWN' });
          break;
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          dispatch({ type: 'ROTATE' });
          break;
        case ' ':
          e.preventDefault();
          dispatch({ type: 'HARD_DROP' });
          break;
        case 'p':
        case 'P':
          dispatch({ type: 'TOGGLE_PAUSE' });
          break;
        case 'r':
        case 'R':
          dispatch({ type: 'RESTART' });
          break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #08081a 0%, #0f0820 50%, #080818 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        fontFamily: 'monospace',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 900,
            letterSpacing: 12,
            color: '#aa00ff',
            textShadow: '0 0 30px #aa00ff, 0 0 60px #5500aa',
            marginBottom: 20,
            fontFamily: 'monospace',
            textTransform: 'uppercase',
          }}
        >
          TETRIS
        </h1>

        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <ScorePanel score={state.score} lines={state.lines} level={state.level} />
            <NextPiece piece={state.nextPiece} />
          </div>

          <TetrisBoard
            board={state.board}
            currentPiece={state.currentPiece}
            currentX={state.currentX}
            currentY={state.currentY}
            gameOver={state.gameOver}
            paused={state.paused}
          />

          <div style={{ width: 160 }}>
            <Controls
              onLeft={() => dispatch({ type: 'MOVE_LEFT' })}
              onRight={() => dispatch({ type: 'MOVE_RIGHT' })}
              onDown={() => dispatch({ type: 'MOVE_DOWN' })}
              onRotate={() => dispatch({ type: 'ROTATE' })}
              onDrop={() => dispatch({ type: 'HARD_DROP' })}
              onPause={() => dispatch({ type: 'TOGGLE_PAUSE' })}
              onRestart={() => dispatch({ type: 'RESTART' })}
              paused={state.paused}
              gameOver={state.gameOver}
            />

            <div
              style={{
                marginTop: 20,
                padding: '10px 12px',
                background: '#0d0d1a',
                border: '1px solid #1a1a3a',
              }}
            >
              <div style={{ fontSize: 10, letterSpacing: 3, color: '#444', textTransform: 'uppercase', marginBottom: 6 }}>Keyboard</div>
              {[
                ['←/→', 'Move'],
                ['↑ / W', 'Rotate'],
                ['↓ / S', 'Soft drop'],
                ['Space', 'Hard drop'],
                ['P', 'Pause'],
                ['R', 'Restart'],
              ].map(([key, action]) => (
                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#666', marginBottom: 3 }}>
                  <span style={{ color: '#888' }}>{key}</span>
                  <span>{action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
