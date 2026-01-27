/**
 * 俄罗斯方块游戏引擎
 * 包含核心游戏逻辑
 */

// 棋盘尺寸
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

// 方块类型
export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

// 方块形状定义
export interface TetrominoShape {
  shape: number[][];
  color: string;
}

// 当前位置的方块
interface Piece {
  type: TetrominoType;
  x: number;
  y: number;
}

// 棋盘类型（存储颜色字符串，null 表示空）
export type Board = (string | null)[][];

/**
 * 俄罗斯方块游戏引擎
 * 处理游戏的核心逻辑
 */
export class TetrisEngine {
  private board: Board;
  private currentPiece: Piece | null;
  private pieceQueue: TetrominoType[]; // 方块队列
  private readonly tetrominoes: Record<TetrominoType, TetrominoShape>;

  constructor(
    board?: Board,
    currentPiece?: Piece | null,
    pieceQueue?: TetrominoType[]
  ) {
    this.board = board || this.createEmptyBoard();
    this.currentPiece = currentPiece || null;
    // 初始化队列，至少保留7个方块
    this.pieceQueue = pieceQueue || Array(7).fill(null).map(() => this.getRandomTetromino());

    this.tetrominoes = {
      I: { shape: [[1, 1, 1, 1]], color: '#00d4ff' },
      O: { shape: [[1, 1], [1, 1]], color: '#ffd700' },
      T: { shape: [[0, 1, 0], [1, 1, 1]], color: '#b14aed' },
      S: { shape: [[0, 1, 1], [1, 1, 0]], color: '#52ff7f' },
      Z: { shape: [[1, 1, 0], [0, 1, 1]], color: '#ff5252' },
      J: { shape: [[1, 0, 0], [1, 1, 1]], color: '#4a9eff' },
      L: { shape: [[0, 0, 1], [1, 1, 1]], color: '#ff9f43' },
    };

    // 如果没有当前方块，生成一个
    if (!this.currentPiece) {
      this.spawnPiece();
    }
  }

  /**
   * 创建空棋盘
   */
  private createEmptyBoard(): Board {
    return Array(BOARD_HEIGHT)
      .fill(null)
      .map(() => Array(BOARD_WIDTH).fill(null));
  }

  /**
   * 获取随机方块类型
   */
  private getRandomTetromino(): TetrominoType {
    const types: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
    return types[Math.floor(Math.random() * types.length)];
  }

  /**
   * 生成新方块
   */
  spawnPiece(): void {
    if (this.pieceQueue.length === 0) {
      this.pieceQueue.push(this.getRandomTetromino());
    }
    this.currentPiece = {
      type: this.pieceQueue[0],
      x: Math.floor(BOARD_WIDTH / 2) - 1,
      y: 0,
    };
    // 移除已使用的方块，并补充新方块
    this.pieceQueue.shift();
    this.pieceQueue.push(this.getRandomTetromino());
  }

  /**
   * 获取当前方块
   */
  getCurrentPiece(): Piece | null {
    return this.currentPiece;
  }

  /**
   * 获取当前方块的完整信息（包含形状和颜色）
   */
  getCurrentPieceInfo(): { shape: number[][]; color: string } | null {
    if (!this.currentPiece) return null;
    return {
      shape: this.tetrominoes[this.currentPiece.type].shape,
      color: this.tetrominoes[this.currentPiece.type].color,
    };
  }

  /**
   * 获取幽灵方块位置（方块落到底部的位置）
   * @returns 幽灵方块的 y 坐标（相对于当前方块位置），null 表示无当前方块
   */
  getGhostPosition(): number | null {
    if (!this.currentPiece) return null;
    const shape = this.tetrominoes[this.currentPiece.type].shape;
    let ghostY = this.currentPiece.y;

    while (!this.checkCollision(this.currentPiece.x, ghostY + 1, shape)) {
      ghostY++;
    }

    return ghostY;
  }

  /**
   * 获取下一个方块类型（队列中的第一个）
   */
  getNextPieceType(): TetrominoType {
    return this.pieceQueue[0];
  }

  /**
   * 获取方块队列
   * @param count 获取的数量，默认1个
   */
  getPieceQueue(count: number = 1): TetrominoType[] {
    return this.pieceQueue.slice(0, count);
  }

  /**
   * 获取棋盘
   */
  getBoard(): Board {
    return this.board;
  }

  /**
   * 检查碰撞
   */
  private checkCollision(x: number, y: number, shape: number[][]): boolean {
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const newX = x + col;
          const newY = y + row;

          // 检查边界
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
            return true;
          }

          // 检查棋盘上的方块
          if (newY >= 0 && this.board[newY][newX] !== null) {
            return true;
          }
        }
      }
    }
    return false;
  }

  /**
   * 向左移动
   */
  moveLeft(): boolean {
    if (!this.currentPiece) return false;
    const shape = this.tetrominoes[this.currentPiece.type].shape;

    if (!this.checkCollision(this.currentPiece.x - 1, this.currentPiece.y, shape)) {
      this.currentPiece.x--;
      return true;
    }
    return false;
  }

  /**
   * 向右移动
   */
  moveRight(): boolean {
    if (!this.currentPiece) return false;
    const shape = this.tetrominoes[this.currentPiece.type].shape;

    if (!this.checkCollision(this.currentPiece.x + 1, this.currentPiece.y, shape)) {
      this.currentPiece.x++;
      return true;
    }
    return false;
  }

  /**
   * 向下移动
   */
  moveDown(): boolean {
    if (!this.currentPiece) return false;
    const shape = this.tetrominoes[this.currentPiece.type].shape;

    if (!this.checkCollision(this.currentPiece.x, this.currentPiece.y + 1, shape)) {
      this.currentPiece.y++;
      return true;
    }
    return false;
  }

  /**
   * 硬降 - 方块直接落到底部
   * @returns 下降的行数
   */
  hardDrop(): number {
    if (!this.currentPiece) return 0;
    const shape = this.tetrominoes[this.currentPiece.type].shape;
    let dropDistance = 0;

    while (!this.checkCollision(this.currentPiece.x, this.currentPiece.y + 1, shape)) {
      this.currentPiece.y++;
      dropDistance++;
    }

    return dropDistance;
  }

  /**
   * 旋转方块
   */
  rotate(): boolean {
    if (!this.currentPiece) return false;
    const shape = this.tetrominoes[this.currentPiece.type].shape;

    // 旋转矩阵
    const rotated = shape[0].map((_, i) =>
      shape.map((row) => row[i]).reverse()
    );

    // 尝试旋转
    if (!this.checkCollision(this.currentPiece.x, this.currentPiece.y, rotated)) {
      this.tetrominoes[this.currentPiece.type].shape = rotated;
      return true;
    }

    // 尝试墙踢（wall kick）
    // 向左踢
    if (!this.checkCollision(this.currentPiece.x - 1, this.currentPiece.y, rotated)) {
      this.currentPiece.x--;
      this.tetrominoes[this.currentPiece.type].shape = rotated;
      return true;
    }

    // 向右踢
    if (!this.checkCollision(this.currentPiece.x + 1, this.currentPiece.y, rotated)) {
      this.currentPiece.x++;
      this.tetrominoes[this.currentPiece.type].shape = rotated;
      return true;
    }

    return false;
  }

  /**
   * 锁定方块
   */
  lockPiece(): void {
    if (!this.currentPiece) return;
    const shape = this.tetrominoes[this.currentPiece.type].shape;
    const color = this.tetrominoes[this.currentPiece.type].color;

    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const x = this.currentPiece!.x + col;
          const y = this.currentPiece!.y + row;
          if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
            this.board[y][x] = color;
          }
        }
      }
    }

    this.currentPiece = null;
  }

  /**
   * 消除满行
   * @returns 消除的行数
   */
  clearLines(): number {
    let linesCleared = 0;

    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
      if (this.board[y].every((cell) => cell !== null)) {
        // 移除满行
        this.board.splice(y, 1);
        // 在顶部添加新行
        this.board.unshift(Array(BOARD_WIDTH).fill(null));
        linesCleared++;
        // 重新检查当前行（因为上面的行下来了）
        y++;
      }
    }

    return linesCleared;
  }

  /**
   * 检查游戏是否结束
   */
  isGameOver(): boolean {
    // 检查第一行是否有方块
    return this.board[0].some((cell) => cell !== null);
  }

  /**
   * 深度复制引擎状态
   */
  clone(): TetrisEngine {
    return new TetrisEngine(
      this.board.map((row) => [...row]),
      this.currentPiece ? { ...this.currentPiece } : null,
      [...this.pieceQueue]
    );
  }
}
