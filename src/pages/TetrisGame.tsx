import { useCallback, useEffect, useReducer, useRef } from 'react';
import { calcDropInterval, createInitialState, gameReducer } from '../game/engine';
import { Controls } from '../components/Controls';
import { NextPiece } from '../components/NextPiece';
import { ScorePanel } from '../components/ScorePanel';
import { TetrisBoard } from '../components/TetrisBoard';

const KEY_ACTIONS: Record<string, 'MOVE_LEFT' | 'MOVE_RIGHT' | 'MOVE_DOWN' | 'ROTATE' | 'HARD_DROP' | 'TOGGLE_PAUSE' | 'RESTART'> = {
  ArrowLeft: 'MOVE_LEFT',
  a: 'MOVE_LEFT',
  A: 'MOVE_LEFT',
  ArrowRight: 'MOVE_RIGHT',
  d: 'MOVE_RIGHT',
  D: 'MOVE_RIGHT',
  ArrowDown: 'MOVE_DOWN',
  s: 'MOVE_DOWN',
  S: 'MOVE_DOWN',
  ArrowUp: 'ROTATE',
  w: 'ROTATE',
  W: 'ROTATE',
  ' ': 'HARD_DROP',
  p: 'TOGGLE_PAUSE',
  P: 'TOGGLE_PAUSE',
  r: 'RESTART',
  R: 'RESTART',
};

const keyboardHints = [
  ['← / A', 'Move left'],
  ['→ / D', 'Move right'],
  ['↑ / W', 'Rotate'],
  ['↓ / S', 'Soft drop'],
  ['Space', 'Hard drop'],
  ['P', 'Pause'],
  ['R', 'Restart'],
] as const;

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;

  const tagName = target.tagName.toLowerCase();
  return target.isContentEditable || tagName === 'input' || tagName === 'textarea' || tagName === 'select';
}

export function TetrisGame() {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState);
  const stateRef = useRef(state);
  stateRef.current = state;

  const dispatchMove = useCallback((type: keyof typeof KEY_ACTIONS | Parameters<typeof dispatch>[0]['type']) => {
    dispatch({ type: type as Parameters<typeof dispatch>[0]['type'] });
  }, []);

  useEffect(() => {
    if (state.gameOver || state.paused) return undefined;

    const interval = window.setInterval(() => {
      if (!stateRef.current.paused && !stateRef.current.gameOver) {
        dispatch({ type: 'TICK' });
      }
    }, calcDropInterval(state.level));

    return () => window.clearInterval(interval);
  }, [state.level, state.gameOver, state.paused]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return;

      const action = KEY_ACTIONS[event.key];
      if (!action) return;

      event.preventDefault();
      dispatch({ type: action });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <main className="game-page">
      <section className="game-card" aria-labelledby="game-title">
        <header className="game-header">
          <div>
            <p className="eyebrow">React + TypeScript</p>
            <h1 id="game-title" className="game-title">
              Tetris
            </h1>
          </div>
          <p className="game-status" aria-live="polite">
            {state.gameOver ? 'Game over' : state.paused ? 'Paused' : 'Playing'}
          </p>
        </header>

        <div className="game-layout">
          <aside className="side-panel side-panel--left" aria-label="Game statistics">
            <ScorePanel score={state.score} lines={state.lines} level={state.level} />
            <NextPiece piece={state.nextPiece} />
          </aside>

          <TetrisBoard
            board={state.board}
            currentPiece={state.currentPiece}
            currentX={state.currentX}
            currentY={state.currentY}
            gameOver={state.gameOver}
            paused={state.paused}
          />

          <aside className="side-panel side-panel--right" aria-label="Game controls">
            <Controls
              onLeft={() => dispatchMove('MOVE_LEFT')}
              onRight={() => dispatchMove('MOVE_RIGHT')}
              onDown={() => dispatchMove('MOVE_DOWN')}
              onRotate={() => dispatchMove('ROTATE')}
              onDrop={() => dispatchMove('HARD_DROP')}
              onPause={() => dispatchMove('TOGGLE_PAUSE')}
              onRestart={() => dispatchMove('RESTART')}
              paused={state.paused}
              gameOver={state.gameOver}
            />

            <section className="keyboard-card" aria-labelledby="keyboard-title">
              <h2 id="keyboard-title" className="panel-title">
                Keyboard
              </h2>
              <dl className="keyboard-list">
                {keyboardHints.map(([key, action]) => (
                  <div className="keyboard-list__row" key={key}>
                    <dt>{key}</dt>
                    <dd>{action}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}
