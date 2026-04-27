import { Tetromino, getRandomTetromino, rotateTetromino } from './tetrominos';

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export type Cell = { color: string; shadow: string } | null;
export type Board = Cell[][];

export interface GameState {
  board: Board;
  currentPiece: Tetromino;
  currentX: number;
  currentY: number;
  nextPiece: Tetromino;
  score: number;
  lines: number;
  level: number;
  gameOver: boolean;
  paused: boolean;
}

export function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(null));
}

export function isValidPosition(board: Board, shape: number[][], x: number, y: number): boolean {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (!shape[r][c]) continue;
      const newY = y + r;
      const newX = x + c;
      if (newX < 0 || newX >= BOARD_WIDTH) return false;
      if (newY >= BOARD_HEIGHT) return false;
      if (newY >= 0 && board[newY][newX] !== null) return false;
    }
  }
  return true;
}

export function placePiece(board: Board, piece: Tetromino, x: number, y: number): Board {
  const newBoard = board.map(row => [...row]);
  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (!piece.shape[r][c]) continue;
      const ny = y + r;
      const nx = x + c;
      if (ny >= 0) {
        newBoard[ny][nx] = { color: piece.color, shadow: piece.shadow };
      }
    }
  }
  return newBoard;
}

export function clearLines(board: Board): { board: Board; linesCleared: number } {
  const newBoard: Board = [];
  let linesCleared = 0;
  for (let r = 0; r < BOARD_HEIGHT; r++) {
    if (board[r].every(cell => cell !== null)) {
      linesCleared++;
    } else {
      newBoard.push([...board[r]]);
    }
  }
  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array(BOARD_WIDTH).fill(null));
  }
  return { board: newBoard, linesCleared };
}

export function getGhostY(board: Board, shape: number[][], x: number, y: number): number {
  let ghostY = y;
  while (isValidPosition(board, shape, x, ghostY + 1)) {
    ghostY++;
  }
  return ghostY;
}

export function calcScore(linesCleared: number, level: number): number {
  const basePoints = [0, 100, 300, 500, 800];
  return (basePoints[linesCleared] ?? 0) * (level + 1);
}

export function calcLevel(lines: number): number {
  return Math.floor(lines / 10);
}

export function calcDropInterval(level: number): number {
  return Math.max(100, 800 - level * 70);
}

export function getStartX(piece: Tetromino): number {
  return Math.floor((BOARD_WIDTH - piece.shape[0].length) / 2);
}

export function createInitialState(): GameState {
  const currentPiece = getRandomTetromino();
  const nextPiece = getRandomTetromino();
  return {
    board: createEmptyBoard(),
    currentPiece,
    currentX: getStartX(currentPiece),
    currentY: -2,
    nextPiece,
    score: 0,
    lines: 0,
    level: 0,
    gameOver: false,
    paused: false,
  };
}

export type GameAction =
  | { type: 'MOVE_LEFT' }
  | { type: 'MOVE_RIGHT' }
  | { type: 'MOVE_DOWN' }
  | { type: 'ROTATE' }
  | { type: 'HARD_DROP' }
  | { type: 'TICK' }
  | { type: 'TOGGLE_PAUSE' }
  | { type: 'RESTART' };

export function gameReducer(state: GameState, action: GameAction): GameState {
  if (action.type === 'RESTART') return createInitialState();
  if (action.type === 'TOGGLE_PAUSE') return { ...state, paused: !state.paused };
  if (state.gameOver || state.paused) return state;

  switch (action.type) {
    case 'MOVE_LEFT': {
      if (isValidPosition(state.board, state.currentPiece.shape, state.currentX - 1, state.currentY)) {
        return { ...state, currentX: state.currentX - 1 };
      }
      return state;
    }
    case 'MOVE_RIGHT': {
      if (isValidPosition(state.board, state.currentPiece.shape, state.currentX + 1, state.currentY)) {
        return { ...state, currentX: state.currentX + 1 };
      }
      return state;
    }
    case 'MOVE_DOWN':
    case 'TICK': {
      if (isValidPosition(state.board, state.currentPiece.shape, state.currentX, state.currentY + 1)) {
        return { ...state, currentY: state.currentY + 1 };
      }
      return lockPiece(state);
    }
    case 'ROTATE': {
      const rotated = rotateTetromino(state.currentPiece.shape);
      const kicks = [0, -1, 1, -2, 2];
      for (const kick of kicks) {
        if (isValidPosition(state.board, rotated, state.currentX + kick, state.currentY)) {
          return {
            ...state,
            currentPiece: { ...state.currentPiece, shape: rotated },
            currentX: state.currentX + kick,
          };
        }
      }
      return state;
    }
    case 'HARD_DROP': {
      const ghostY = getGhostY(state.board, state.currentPiece.shape, state.currentX, state.currentY);
      const droppedState = { ...state, currentY: ghostY };
      return lockPiece(droppedState);
    }
    default:
      return state;
  }
}

function lockPiece(state: GameState): GameState {
  const newBoard = placePiece(state.board, state.currentPiece, state.currentX, state.currentY);
  const { board: clearedBoard, linesCleared } = clearLines(newBoard);
  const newLines = state.lines + linesCleared;
  const newLevel = calcLevel(newLines);
  const newScore = state.score + calcScore(linesCleared, state.level);

  const nextPiece = state.nextPiece;
  const nextX = getStartX(nextPiece);
  const nextY = -2;

  const isOver = !isValidPosition(clearedBoard, nextPiece.shape, nextX, nextY + 2);

  return {
    ...state,
    board: clearedBoard,
    currentPiece: nextPiece,
    currentX: nextX,
    currentY: nextY,
    nextPiece: getRandomTetromino(),
    score: newScore,
    lines: newLines,
    level: newLevel,
    gameOver: isOver,
  };
}
