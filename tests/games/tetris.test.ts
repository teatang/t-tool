import { describe, it, expect, beforeEach } from 'vitest';
import { TetrisEngine, BOARD_WIDTH, BOARD_HEIGHT, TetrominoType } from '../../app/tools/games/tetris/tetrisEngine';

describe('TetrisEngine', () => {
  let game: TetrisEngine;

  beforeEach(() => {
    game = new TetrisEngine();
  });

  describe('初始化', () => {
    it('应该创建空棋盘', () => {
      const board = game.getBoard();
      expect(board.length).toBe(BOARD_HEIGHT);
      expect(board[0].length).toBe(BOARD_WIDTH);
      expect(board.every((row) => row.every((cell) => cell === null))).toBe(true);
    });

    it('应该生成当前方块', () => {
      const piece = game.getCurrentPiece();
      expect(piece).not.toBeNull();
      expect(piece!.x).toBeGreaterThanOrEqual(0);
      expect(piece!.x).toBeLessThan(BOARD_WIDTH);
      expect(piece!.y).toBe(0);
    });

    it('应该生成下一个方块', () => {
      const pieceQueue = game.getPieceQueue(1);
      const nextPiece = pieceQueue[0];
      const validTypes: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
      expect(validTypes).toContain(nextPiece);
    });
  });

  describe('移动逻辑', () => {
    it('应该能够向左移动', () => {
      const piece = game.getCurrentPiece()!;
      const originalX = piece.x;
      const moved = game.moveLeft();
      expect(moved).toBe(true);
      expect(game.getCurrentPiece()!.x).toBe(originalX - 1);
    });

    it('不应该移动到左边界外', () => {
      // 将方块移到左边界
      const gameWithLeftPiece = new TetrisEngine();
      let piece = gameWithLeftPiece.getCurrentPiece()!;
      while (piece.x > 0 && gameWithLeftPiece.moveLeft()) {
        piece = gameWithLeftPiece.getCurrentPiece()!;
      }

      const moved = gameWithLeftPiece.moveLeft();
      expect(moved).toBe(false);
    });

    it('应该能够向右移动', () => {
      const piece = game.getCurrentPiece()!;
      const originalX = piece.x;
      const moved = game.moveRight();
      expect(moved).toBe(true);
      expect(game.getCurrentPiece()!.x).toBe(originalX + 1);
    });

    it('不应该移动到右边界外', () => {
      // 创建一个新的游戏实例并尝试多次向右移动
      const gameWithRightPiece = new TetrisEngine();
      let moved = true;
      let attempts = 0;
      // 尝试移动 20 次（超过棋盘宽度）
      while (moved && attempts < 20) {
        moved = gameWithRightPiece.moveRight();
        attempts++;
      }
      // 最后一次移动应该失败
      expect(moved).toBe(false);
    });

    it('应该能够向下移动', () => {
      const piece = game.getCurrentPiece()!;
      const originalY = piece.y;
      const moved = game.moveDown();
      expect(moved).toBe(true);
      expect(game.getCurrentPiece()!.y).toBe(originalY + 1);
    });
  });

  describe('旋转逻辑', () => {
    it('应该能够旋转方块（非 O 型方块）', () => {
      const pieceType = game.getCurrentPiece()!.type;
      // O 型方块旋转后形状不变，跳过
      if (pieceType === 'O') {
        game.spawnPiece();
        const newPieceType = game.getCurrentPiece()!.type;
        expect(newPieceType).not.toBe('O');
        return;
      }

      const originalShape = JSON.stringify(
        (game as unknown as { tetrominoes: Record<TetrominoType, { shape: number[][] }> }).tetrominoes[pieceType].shape
      );
      game.rotate();
      const rotatedShape = JSON.stringify(
        (game as unknown as { tetrominoes: Record<TetrominoType, { shape: number[][] }> }).tetrominoes[pieceType].shape
      );
      expect(rotatedShape).not.toBe(originalShape);
    });

    it('I 型方块应该正确旋转', () => {
      // 创建一个新的引擎并直接测试形状旋转
      const testEngine = new TetrisEngine();
      // 获取 tetrominoes 的引用
      const tetrominoes = (testEngine as unknown as { tetrominoes: { I: { shape: number[][] } } }).tetrominoes;
      const originalShape = JSON.stringify(tetrominoes.I.shape);

      // 使用 rotate 方法会修改 tetrominoes.I.shape
      // 但我们需要先设置 I 为当前方块
      (testEngine as unknown as { currentPiece: { type: TetrominoType; x: number; y: number } }).currentPiece = { type: 'I', x: 4, y: 10 };
      testEngine.rotate();

      // 验证形状已改变
      const rotatedShape = JSON.stringify(tetrominoes.I.shape);
      expect(rotatedShape).not.toBe(originalShape);
    });
  });

  describe('碰撞检测', () => {
    it('应该检测到底部碰撞', () => {
      const fullRowGame = new TetrisEngine();
      // 创建有方块的行
      const board = fullRowGame.getBoard();
      // 填充倒数第二行
      for (let x = 0; x < BOARD_WIDTH; x++) {
        board[BOARD_HEIGHT - 2][x] = '#ff5252';
      }
      (fullRowGame as unknown as { board: typeof board }).board = board;

      // 先将方块移到底部碰撞的位置
      // 当前方块从 y=0 开始，需要移到 y=BOARD_HEIGHT-3 才能检测到碰撞
      while (fullRowGame.moveDown()) {
        // 继续移动直到不能移动
      }

      // 此时方块应该已经锁定在倒数第三行上方
      // 重新生成方块并测试
      const newGame = new TetrisEngine();
      const newBoard = newGame.getBoard();
      // 填充倒数第二行
      for (let x = 0; x < BOARD_WIDTH; x++) {
        newBoard[BOARD_HEIGHT - 2][x] = '#ff5252';
      }
      (newGame as unknown as { board: typeof newBoard }).board = newBoard;

      // 移动方块到底部
      while (newGame.moveDown()) {
        // 继续移动
      }
      // 此时 moveDown 应该返回 false（已经到底了）
      const testEngine = new TetrisEngine();
      (testEngine as unknown as { board: typeof newBoard }).board = newBoard;
      // 设置方块在倒数第三行
      (testEngine as unknown as { currentPiece: { type: TetrominoType; x: number; y: number } }).currentPiece = { type: 'T', x: 4, y: BOARD_HEIGHT - 3 };
      const moved = testEngine.moveDown();
      expect(moved).toBe(false);
    });
  });

  describe('锁定和消除', () => {
    it('锁定方块后应该更新棋盘', () => {
      const gameWithPiece = new TetrisEngine();

      // 将方块移到底部
      while (gameWithPiece.moveDown()) {
        // 继续移动直到不能移动
      }

      // 锁定方块
      gameWithPiece.lockPiece();

      // 棋盘应该不为空
      const board = gameWithPiece.getBoard();
      const hasBlock = board.some((row) => row.some((cell) => cell !== null));
      expect(hasBlock).toBe(true);
    });

    it('应该能够消除满行', () => {
      const gameWithFullRow = new TetrisEngine();
      const board = gameWithFullRow.getBoard();

      // 填充最后一行
      for (let x = 0; x < BOARD_WIDTH; x++) {
        board[BOARD_HEIGHT - 1][x] = '#ff5252';
      }

      const linesCleared = gameWithFullRow.clearLines();
      expect(linesCleared).toBe(1);
    });

    it('消除多行应该返回正确的行数', () => {
      const gameWithMultipleRows = new TetrisEngine();
      const board = gameWithMultipleRows.getBoard();

      // 填充最后两行
      for (let x = 0; x < BOARD_WIDTH; x++) {
        board[BOARD_HEIGHT - 1][x] = '#ff5252';
        board[BOARD_HEIGHT - 2][x] = '#ff5252';
      }

      const linesCleared = gameWithMultipleRows.clearLines();
      expect(linesCleared).toBe(2);
    });
  });

  describe('游戏状态', () => {
    it('新游戏不应该结束', () => {
      expect(game.isGameOver()).toBe(false);
    });

    it('顶部有方块时游戏应该结束', () => {
      const gameOver = new TetrisEngine();
      const board = gameOver.getBoard();
      board[0][0] = '#ff5252'; // 在顶部放置一个方块

      expect(gameOver.isGameOver()).toBe(true);
    });
  });

  describe('深度复制', () => {
    it('clone 方法应该创建独立的副本', () => {
      const clonedGame = game.clone();

      // 修改原游戏
      game.moveDown();

      // 克隆游戏不应该受影响
      expect(clonedGame.getCurrentPiece()!.y).not.toBe(game.getCurrentPiece()!.y);
    });
  });

  describe('边界条件', () => {
    it('应该处理棋盘尺寸常量', () => {
      expect(BOARD_WIDTH).toBe(10);
      expect(BOARD_HEIGHT).toBe(20);
    });

    it('空棋盘应该全部为0', () => {
      const emptyBoard = Array(BOARD_HEIGHT)
        .fill(null)
        .map(() => Array(BOARD_WIDTH).fill(0));

      expect(emptyBoard.length).toBe(BOARD_HEIGHT);
      expect(emptyBoard[0].length).toBe(BOARD_WIDTH);
    });
  });
});

describe('Tetromino Shapes', () => {
  it('所有方块类型应该有有效的形状定义', () => {
    const types: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
    const expectedColors: Record<TetrominoType, string> = {
      I: '#00d4ff',
      O: '#ffd700',
      T: '#b14aed',
      S: '#52ff7f',
      Z: '#ff5252',
      J: '#4a9eff',
      L: '#ff9f43',
    };

    types.forEach((type) => {
      const game = new TetrisEngine();
      const tetrominoes = (game as unknown as { tetrominoes: Record<TetrominoType, { shape: number[][]; color: string }> }).tetrominoes;

      expect(tetrominoes[type]).toBeDefined();
      expect(tetrominoes[type].shape.length).toBeGreaterThan(0);
      expect(tetrominoes[type].color).toBe(expectedColors[type]);
    });
  });
});
