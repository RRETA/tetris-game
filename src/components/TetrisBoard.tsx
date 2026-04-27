import { memo, type CSSProperties } from 'react';
import { Board, BOARD_HEIGHT, BOARD_WIDTH, getGhostY } from '../game/engine';
import { Tetromino } from '../game/tetrominos';

interface TetrisBoardProps {
  board: Board;
  currentPiece: Tetromino;
  currentX: number;
  currentY: number;
  gameOver: boolean;
  paused: boolean;
}

interface RenderCell {
  color: string;
  shadow: string;
  isGhost?: boolean;
  isCurrent?: boolean;
}

function buildDisplayBoard({ board, currentPiece, currentX, currentY }: Pick<TetrisBoardProps, 'board' | 'currentPiece' | 'currentX' | 'currentY'>): RenderCell[][] {
  const displayBoard: RenderCell[][] = board.map((row) =>
    row.map((cell) => (cell ? { ...cell } : { color: '', shadow: '' })),
  );

  const ghostY = getGhostY(board, currentPiece.shape, currentX, currentY);

  for (let row = 0; row < currentPiece.shape.length; row += 1) {
    for (let col = 0; col < currentPiece.shape[row].length; col += 1) {
      if (!currentPiece.shape[row][col]) continue;

      const boardY = ghostY + row;
      const boardX = currentX + col;

      if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH && !displayBoard[boardY][boardX].color) {
        displayBoard[boardY][boardX] = {
          color: currentPiece.color,
          shadow: currentPiece.shadow,
          isGhost: true,
        };
      }
    }
  }

  for (let row = 0; row < currentPiece.shape.length; row += 1) {
    for (let col = 0; col < currentPiece.shape[row].length; col += 1) {
      if (!currentPiece.shape[row][col]) continue;

      const boardY = currentY + row;
      const boardX = currentX + col;

      if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
        displayBoard[boardY][boardX] = {
          color: currentPiece.color,
          shadow: currentPiece.shadow,
          isCurrent: true,
        };
      }
    }
  }

  return displayBoard;
}

function getCellClassName(cell: RenderCell, row: number, col: number): string {
  if (!cell.color) return `board-cell board-cell--empty ${row % 2 === col % 2 ? 'board-cell--shade-a' : 'board-cell--shade-b'}`;
  if (cell.isGhost) return 'board-cell board-cell--ghost';
  if (cell.isCurrent) return 'board-cell board-cell--current';
  return 'board-cell board-cell--locked';
}

export const TetrisBoard = memo(function TetrisBoard({ board, currentPiece, currentX, currentY, gameOver, paused }: TetrisBoardProps) {
  const displayBoard = buildDisplayBoard({ board, currentPiece, currentX, currentY });
  const overlayText = gameOver ? 'Game over' : paused ? 'Paused' : null;

  return (
    <section className="board-shell" aria-labelledby="game-board-title">
      <h2 id="game-board-title" className="sr-only">
        Tetris game board
      </h2>

      <div
        className="game-board"
        role="grid"
        aria-label="Tetris board with 10 columns and 20 rows"
        style={
          {
            '--board-width': BOARD_WIDTH,
            '--board-height': BOARD_HEIGHT,
          } as CSSProperties
        }
      >
        {displayBoard.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const cellStyle = cell.color
              ? ({ '--cell-color': cell.color, '--cell-shadow': cell.shadow } as CSSProperties)
              : undefined;

            return (
              <span
                aria-hidden="true"
                className={getCellClassName(cell, rowIndex, colIndex)}
                key={`${rowIndex}-${colIndex}`}
                role="gridcell"
                style={cellStyle}
              />
            );
          }),
        )}

        {overlayText ? (
          <div className="board-overlay" role="status" aria-live="assertive">
            <span className="board-overlay__title">{overlayText}</span>
            <span className="board-overlay__hint">Press {gameOver ? 'R to restart' : 'P to resume'}</span>
          </div>
        ) : null}
      </div>
    </section>
  );
});
