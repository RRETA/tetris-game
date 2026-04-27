import { Board, Cell, BOARD_WIDTH, BOARD_HEIGHT, getGhostY } from '../game/engine';
import { Tetromino } from '../game/tetrominos';

interface TetrisBoardProps {
  board: Board;
  currentPiece: Tetromino;
  currentX: number;
  currentY: number;
  gameOver: boolean;
  paused: boolean;
}

const CELL_SIZE = 30;

export function TetrisBoard({ board, currentPiece, currentX, currentY, gameOver, paused }: TetrisBoardProps) {
  const ghostY = getGhostY(board, currentPiece.shape, currentX, currentY);

  const displayBoard: { color: string; shadow: string; isGhost?: boolean; isCurrent?: boolean }[][] =
    board.map(row => row.map(cell => cell ? { ...cell } : { color: '', shadow: '' }));

  for (let r = 0; r < currentPiece.shape.length; r++) {
    for (let c = 0; c < currentPiece.shape[r].length; c++) {
      if (!currentPiece.shape[r][c]) continue;
      const gy = ghostY + r;
      const gx = currentX + c;
      if (gy >= 0 && gy < BOARD_HEIGHT && gx >= 0 && gx < BOARD_WIDTH) {
        if (!displayBoard[gy][gx].color) {
          displayBoard[gy][gx] = { color: currentPiece.color, shadow: currentPiece.shadow, isGhost: true };
        }
      }
    }
  }

  for (let r = 0; r < currentPiece.shape.length; r++) {
    for (let c = 0; c < currentPiece.shape[r].length; c++) {
      if (!currentPiece.shape[r][c]) continue;
      const ny = currentY + r;
      const nx = currentX + c;
      if (ny >= 0 && ny < BOARD_HEIGHT && nx >= 0 && nx < BOARD_WIDTH) {
        displayBoard[ny][nx] = { color: currentPiece.color, shadow: currentPiece.shadow, isCurrent: true };
      }
    }
  }

  return (
    <div
      style={{
        position: 'relative',
        width: BOARD_WIDTH * CELL_SIZE,
        height: BOARD_HEIGHT * CELL_SIZE,
        background: '#0d0d1a',
        border: '2px solid #1a1a3a',
        boxShadow: '0 0 40px rgba(100, 0, 200, 0.3)',
      }}
    >
      {displayBoard.map((row, r) =>
        row.map((cell, c) => {
          const isEmpty = !cell.color;
          if (isEmpty) {
            return (
              <div
                key={`${r}-${c}`}
                style={{
                  position: 'absolute',
                  left: c * CELL_SIZE,
                  top: r * CELL_SIZE,
                  width: CELL_SIZE - 1,
                  height: CELL_SIZE - 1,
                  background: r % 2 === c % 2 ? '#0f0f22' : '#0d0d1a',
                }}
              />
            );
          }

          if (cell.isGhost) {
            return (
              <div
                key={`${r}-${c}`}
                style={{
                  position: 'absolute',
                  left: c * CELL_SIZE,
                  top: r * CELL_SIZE,
                  width: CELL_SIZE - 1,
                  height: CELL_SIZE - 1,
                  border: `2px solid ${cell.color}55`,
                  background: `${cell.shadow}44`,
                }}
              />
            );
          }

          return (
            <div
              key={`${r}-${c}`}
              style={{
                position: 'absolute',
                left: c * CELL_SIZE,
                top: r * CELL_SIZE,
                width: CELL_SIZE - 1,
                height: CELL_SIZE - 1,
                background: cell.color,
                boxShadow: `inset 0 0 0 2px ${cell.color}cc, inset 2px 2px 0 rgba(255,255,255,0.35), inset -2px -2px 0 rgba(0,0,0,0.4)`,
              }}
            />
          );
        })
      )}

      {(gameOver || paused) && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(3px)',
          }}
        >
          <span
            style={{
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: 4,
              color: gameOver ? '#ff1744' : '#aa00ff',
              textShadow: `0 0 20px ${gameOver ? '#ff1744' : '#aa00ff'}`,
              fontFamily: 'monospace',
            }}
          >
            {gameOver ? 'GAME OVER' : 'PAUSED'}
          </span>
          {gameOver && (
            <span style={{ marginTop: 8, fontSize: 13, color: '#888', fontFamily: 'monospace', letterSpacing: 2 }}>
              Press R to restart
            </span>
          )}
          {paused && (
            <span style={{ marginTop: 8, fontSize: 13, color: '#888', fontFamily: 'monospace', letterSpacing: 2 }}>
              Press P to resume
            </span>
          )}
        </div>
      )}
    </div>
  );
}
