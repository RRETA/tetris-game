import { memo } from 'react';
import { Tetromino } from '../game/tetrominos';

interface NextPieceProps {
  piece: Tetromino;
}

const PREVIEW_SIZE = 4;
const previewCells = Array.from({ length: PREVIEW_SIZE * PREVIEW_SIZE }, (_, index) => ({
  row: Math.floor(index / PREVIEW_SIZE),
  col: index % PREVIEW_SIZE,
}));

export const NextPiece = memo(function NextPiece({ piece }: NextPieceProps) {
  const offsetRow = Math.floor((PREVIEW_SIZE - piece.shape.length) / 2);
  const offsetCol = Math.floor((PREVIEW_SIZE - piece.shape[0].length) / 2);

  return (
    <section className="next-piece" aria-labelledby="next-piece-title">
      <h2 id="next-piece-title" className="panel-title">
        Next
      </h2>

      <div className="preview-grid" aria-label={`Next piece: ${piece.type}`}>
        {previewCells.map(({ row, col }) => {
          const pieceRow = row - offsetRow;
          const pieceCol = col - offsetCol;
          const isFilled =
            pieceRow >= 0 &&
            pieceRow < piece.shape.length &&
            pieceCol >= 0 &&
            pieceCol < piece.shape[0].length &&
            piece.shape[pieceRow][pieceCol] === 1;

          return (
            <span
              aria-hidden="true"
              className={isFilled ? 'preview-grid__cell preview-grid__cell--filled' : 'preview-grid__cell'}
              key={`${row}-${col}`}
              style={
                isFilled
                  ? {
                      '--cell-color': piece.color,
                      '--cell-shadow': piece.shadow,
                    } as React.CSSProperties
                  : undefined
              }
            />
          );
        })}
      </div>
    </section>
  );
});
