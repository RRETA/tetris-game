import { Tetromino } from '../game/tetrominos';

interface NextPieceProps {
  piece: Tetromino;
}

const PREVIEW_CELL = 24;
const PREVIEW_SIZE = 4;

export function NextPiece({ piece }: NextPieceProps) {
  const offsetRow = Math.floor((PREVIEW_SIZE - piece.shape.length) / 2);
  const offsetCol = Math.floor((PREVIEW_SIZE - piece.shape[0].length) / 2);

  return (
    <div>
      <div
        style={{
          fontSize: 10,
          letterSpacing: 3,
          color: '#555',
          fontFamily: 'monospace',
          marginBottom: 8,
          textTransform: 'uppercase',
        }}
      >
        Next
      </div>
      <div
        style={{
          width: PREVIEW_SIZE * PREVIEW_CELL,
          height: PREVIEW_SIZE * PREVIEW_CELL,
          background: '#0d0d1a',
          border: '1px solid #1a1a3a',
          position: 'relative',
        }}
      >
        {Array.from({ length: PREVIEW_SIZE }).map((_, r) =>
          Array.from({ length: PREVIEW_SIZE }).map((_, c) => {
            const pieceRow = r - offsetRow;
            const pieceCol = c - offsetCol;
            const isFilled =
              pieceRow >= 0 &&
              pieceRow < piece.shape.length &&
              pieceCol >= 0 &&
              pieceCol < piece.shape[0].length &&
              piece.shape[pieceRow][pieceCol] === 1;

            return (
              <div
                key={`${r}-${c}`}
                style={{
                  position: 'absolute',
                  left: c * PREVIEW_CELL,
                  top: r * PREVIEW_CELL,
                  width: PREVIEW_CELL - 1,
                  height: PREVIEW_CELL - 1,
                  background: isFilled ? piece.color : 'transparent',
                  boxShadow: isFilled
                    ? `inset 0 0 0 2px ${piece.color}cc, inset 2px 2px 0 rgba(255,255,255,0.35), inset -2px -2px 0 rgba(0,0,0,0.4)`
                    : 'none',
                }}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
