export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';
export type TetrominoShape = number[][];

export interface Tetromino {
  type: TetrominoType;
  shape: TetrominoShape;
  color: string;
  shadow: string;
}

export const TETROMINOS: Record<TetrominoType, Tetromino> = {
  I: {
    type: 'I',
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    color: '#00e5ff',
    shadow: '#004d57',
  },
  O: {
    type: 'O',
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: '#ffd600',
    shadow: '#574800',
  },
  T: {
    type: 'T',
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: '#aa00ff',
    shadow: '#3a0057',
  },
  S: {
    type: 'S',
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: '#00e676',
    shadow: '#004d26',
  },
  Z: {
    type: 'Z',
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    color: '#ff1744',
    shadow: '#570009',
  },
  J: {
    type: 'J',
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: '#2979ff',
    shadow: '#0d2d7a',
  },
  L: {
    type: 'L',
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: '#ff6d00',
    shadow: '#572500',
  },
};

export const TETROMINO_TYPES: readonly TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

function cloneTetromino(tetromino: Tetromino): Tetromino {
  return {
    ...tetromino,
    shape: tetromino.shape.map((row) => [...row]),
  };
}

export function getRandomTetromino(): Tetromino {
  const type = TETROMINO_TYPES[Math.floor(Math.random() * TETROMINO_TYPES.length)];
  return cloneTetromino(TETROMINOS[type]);
}

export function rotateTetromino(shape: TetrominoShape): TetrominoShape {
  const rows = shape.length;
  const cols = shape[0].length;
  const rotated: TetrominoShape = Array.from({ length: cols }, () => Array(rows).fill(0));

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      rotated[col][rows - 1 - row] = shape[row][col];
    }
  }

  return rotated;
}
