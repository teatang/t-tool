'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, Button, Space, Statistic, Typography, message } from 'antd';
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  RedoOutlined,
  LeftOutlined,
  RightOutlined,
  DownOutlined,
  RotateLeftOutlined,
  VerticalAlignBottomOutlined,
} from '@ant-design/icons';
import { useI18n } from '@/contexts/I18nContext';
import { TetrisEngine, TetrominoType, BOARD_WIDTH, BOARD_HEIGHT } from './tetrisEngine';

const { Title, Text } = Typography;

// 方块形状接口
interface TetrominoShape {
  shape: number[][];
  color: string;
}

// 方块类型定义
const TETROMINOES: Record<TetrominoType, TetrominoShape> = {
  I: { shape: [[1, 1, 1, 1]], color: '#00d4ff' },
  O: { shape: [[1, 1], [1, 1]], color: '#ffd700' },
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: '#b14aed' },
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: '#52ff7f' },
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: '#ff5252' },
  J: { shape: [[1, 0, 0], [1, 1, 1]], color: '#4a9eff' },
  L: { shape: [[0, 0, 1], [1, 1, 1]], color: '#ff9f43' },
};

interface TetrisGameProps {
  isDark: boolean;
}

// 绘制单个方块
const drawCell = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
  cellSize: number,
  isDark: boolean
) => {
  const padding = 1;
  const xPos = x * cellSize + padding;
  const yPos = y * cellSize + padding;
  const size = cellSize - padding * 2;

  ctx.fillStyle = color;
  ctx.fillRect(xPos, yPos, size, size);

  // 添加高光效果
  ctx.fillStyle = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.3)';
  ctx.fillRect(xPos, yPos, size, 3);
  ctx.fillRect(xPos, yPos, 3, size);

  // 添加阴影效果
  ctx.fillStyle = isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)';
  ctx.fillRect(xPos + size - 3, yPos, 3, size);
  ctx.fillRect(xPos, yPos + size - 3, size, 3);
};

// 绘制幽灵方块（半透明边框）
const drawGhostCell = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
  cellSize: number
) => {
  const padding = 2;
  const xPos = x * cellSize + padding;
  const yPos = y * cellSize + padding;
  const size = cellSize - padding * 2;

  // 半透明填充
  ctx.fillStyle = color + '40'; // 添加透明度
  ctx.fillRect(xPos, yPos, size, size);

  // 边框
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.strokeRect(xPos, yPos, size, size);
};

// 绘制下一个方块预览
const drawNextPiece = (
  ctx: CanvasRenderingContext2D,
  pieceType: TetrominoType,
  cellSize: number,
  isDark: boolean,
  t: (key: string) => string
) => {
  const tetromino = TETROMINOES[pieceType];
  const startX = BOARD_WIDTH * cellSize + 20;
  const startY = 30;

  ctx.fillStyle = isDark ? '#2a2a2a' : '#fff';
  ctx.fillRect(startX, startY, 80, 80);

  ctx.fillStyle = isDark ? '#666' : '#999';
  ctx.font = '12px sans-serif';
  ctx.fillText(t('tetris.next'), startX, startY - 5);

  for (let y = 0; y < tetromino.shape.length; y++) {
    for (let x = 0; x < tetromino.shape[y].length; x++) {
      if (tetromino.shape[y][x]) {
        drawCell(ctx, (startX / cellSize) + x, (startY / cellSize) + y, tetromino.color, cellSize, isDark);
      }
    }
  }
};

/**
 * 俄罗斯方块游戏组件
 */
export function TetrisGame({ isDark }: TetrisGameProps) {
  const { t } = useI18n();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<TetrisEngine>(new TetrisEngine());
  const animationFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  // 使用 ref 存储状态，避免触发重渲染
  const scoreRef = useRef(0);
  const linesRef = useRef(0);
  const levelRef = useRef(1);

  // 用于触发 React 更新的 state
  const [displayScore, setDisplayScore] = useState(0);
  const [displayLines, setDisplayLines] = useState(0);
  const [displayLevel, setDisplayLevel] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  // 绘制游戏
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentGame = gameRef.current;
    const cellSize = 24;
    const board = currentGame.getBoard();
    const currentPiece = currentGame.getCurrentPiece();
    const nextPieceType = currentGame.getNextPieceType();

    // 清空画布
    ctx.fillStyle = isDark ? '#1a1a1a' : '#f5f5f5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制网格背景
    ctx.strokeStyle = isDark ? '#333' : '#e0e0e0';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= BOARD_WIDTH; x++) {
      ctx.beginPath();
      ctx.moveTo(x * cellSize, 0);
      ctx.lineTo(x * cellSize, BOARD_HEIGHT * cellSize);
      ctx.stroke();
    }
    for (let y = 0; y <= BOARD_HEIGHT; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * cellSize);
      ctx.lineTo(BOARD_WIDTH * cellSize, y * cellSize);
      ctx.stroke();
    }

    // 绘制已固定的方块
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        const color = board[y][x];
        if (color) {
          drawCell(ctx, x, y, color, cellSize, isDark);
        }
      }
    }

    // 获取当前方块信息（用于绘制幽灵方块和当前方块）
    const pieceInfo = currentGame.getCurrentPieceInfo();

    // 绘制幽灵方块（当前方块落到底部的位置）
    const ghostY = currentGame.getGhostPosition();
    if (currentPiece && pieceInfo && ghostY !== null) {
      for (let y = 0; y < pieceInfo.shape.length; y++) {
        for (let x = 0; x < pieceInfo.shape[y].length; x++) {
          if (pieceInfo.shape[y][x]) {
            drawGhostCell(ctx, currentPiece.x + x, ghostY + y, pieceInfo.color, cellSize);
          }
        }
      }
    }

    // 绘制当前方块（使用引擎中的实际形状，支持旋转）
    if (currentPiece && pieceInfo) {
      for (let y = 0; y < pieceInfo.shape.length; y++) {
        for (let x = 0; x < pieceInfo.shape[y].length; x++) {
          if (pieceInfo.shape[y][x]) {
            drawCell(ctx, currentPiece.x + x, currentPiece.y + y, pieceInfo.color, cellSize, isDark);
          }
        }
      }
    }

    // 绘制下一个方块预览
    drawNextPiece(ctx, nextPieceType, cellSize, isDark, t);
  }, [isDark, t]);

  // 游戏循环
  useEffect(() => {
    if (!isPlaying) {
      cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    const gameLoop = (timestamp: number) => {
      // 计算时间差，控制速度 (初始 800ms)
      const speed = Math.max(150, 800 - (levelRef.current - 1) * 50);

      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }

      const elapsed = timestamp - lastTimeRef.current;

      if (elapsed >= speed) {
        const currentGame = gameRef.current;
        const canMove = currentGame.moveDown();

        if (!canMove) {
          currentGame.lockPiece();
          const clearedLines = currentGame.clearLines();
          if (clearedLines > 0) {
            linesRef.current += clearedLines;
            levelRef.current = Math.floor(linesRef.current / 10) + 1;
            scoreRef.current += clearedLines * 100 * levelRef.current;
            setDisplayLines(linesRef.current);
            setDisplayLevel(levelRef.current);
            setDisplayScore(scoreRef.current);
          }

          if (currentGame.isGameOver()) {
            setIsPlaying(false);
            message.error(t('tetris.gameOver'));
            return;
          }

          currentGame.spawnPiece();
        }

        lastTimeRef.current = timestamp;
      }

      // 总是重绘
      draw();

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    lastTimeRef.current = 0;
    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, draw, t]);

  // 重置游戏
  const resetGame = useCallback(() => {
    gameRef.current = new TetrisEngine();
    scoreRef.current = 0;
    linesRef.current = 0;
    levelRef.current = 1;
    setDisplayScore(0);
    setDisplayLines(0);
    setDisplayLevel(1);
    setIsPlaying(false);
    draw();
  }, [draw]);

  // 开始/暂停游戏
  const togglePlay = useCallback(() => {
    const newIsPlaying = !isPlaying;
    setIsPlaying(newIsPlaying);

    if (!newIsPlaying && gameRef.current.isGameOver()) {
      resetGame();
    }
  }, [isPlaying, resetGame]);

  // 移动方块
  const moveLeft = useCallback(() => {
    gameRef.current.moveLeft();
    draw();
  }, [draw]);

  const moveRight = useCallback(() => {
    gameRef.current.moveRight();
    draw();
  }, [draw]);

  const moveDown = useCallback(() => {
    gameRef.current.moveDown();
    draw();
  }, [draw]);

  const rotate = useCallback(() => {
    gameRef.current.rotate();
    draw();
  }, [draw]);

  const hardDrop = useCallback(() => {
    const currentGame = gameRef.current;
    currentGame.hardDrop();
    // 硬降后立即锁定方块
    currentGame.lockPiece();
    const clearedLines = currentGame.clearLines();
    if (clearedLines > 0) {
      linesRef.current += clearedLines;
      levelRef.current = Math.floor(linesRef.current / 10) + 1;
      // 硬降额外奖励：每硬降一行加1分，最高100分
      scoreRef.current += clearedLines * 100 * levelRef.current + 10;
      setDisplayLines(linesRef.current);
      setDisplayLevel(levelRef.current);
      setDisplayScore(scoreRef.current);
    }

    if (currentGame.isGameOver()) {
      setIsPlaying(false);
      message.error(t('tetris.gameOver'));
    } else {
      currentGame.spawnPiece();
    }
    draw();
  }, [draw, t]);

  // 键盘控制
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          gameRef.current.moveLeft();
          break;
        case 'ArrowRight':
          e.preventDefault();
          gameRef.current.moveRight();
          break;
        case 'ArrowDown':
          e.preventDefault();
          gameRef.current.moveDown();
          break;
        case 'ArrowUp':
          e.preventDefault();
          gameRef.current.rotate();
          break;
        case ' ':
          e.preventDefault();
          hardDrop();
          break;
        default:
          return;
      }
      draw();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, draw, hardDrop]);

  // 初始绘制
  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
      {/* 游戏画布 */}
      <Card style={{ background: isDark ? '#141414' : '#fff' }}>
        <canvas
          ref={canvasRef}
          width={BOARD_WIDTH * 24 + 100}
          height={BOARD_HEIGHT * 24}
          style={{
            border: `2px solid ${isDark ? '#333' : '#d9d9d9'}`,
            borderRadius: 4,
          }}
        />
      </Card>

      {/* 控制面板 */}
      <Card
        title={<Title level={4} style={{ margin: 0 }}>{t('tetris.title')}</Title>}
        style={{ minWidth: 200, background: isDark ? '#141414' : '#fff' }}
      >
        {/* 统计信息 */}
        <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
          <Statistic
            title={<Text style={{ color: isDark ? '#aaa' : '#666' }}>{t('tetris.score')}</Text>}
            value={displayScore}
            valueStyle={{ color: isDark ? '#52ff7f' : '#52ff7f' }}
          />
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Statistic
              title={<Text style={{ color: isDark ? '#aaa' : '#666', fontSize: 12 }}>{t('tetris.lines')}</Text>}
              value={displayLines}
            />
            <Statistic
              title={<Text style={{ color: isDark ? '#aaa' : '#666', fontSize: 12 }}>{t('tetris.level')}</Text>}
              value={displayLevel}
            />
          </Space>
        </Space>

        {/* 控制按钮 */}
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button
            type="primary"
            icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
            onClick={togglePlay}
            block
          >
            {isPlaying ? t('tetris.pause') : t('tetris.start')}
          </Button>

          <Button
            icon={<RedoOutlined />}
            onClick={resetGame}
            block
          >
            {t('tetris.restart')}
          </Button>

          {/* 方向控制 */}
          <Space wrap style={{ justifyContent: 'center', marginTop: 8 }}>
            <Button icon={<LeftOutlined />} onClick={moveLeft} size="large" />
            <Button icon={<RightOutlined />} onClick={moveRight} size="large" />
            <Button icon={<DownOutlined />} onClick={moveDown} size="large" />
            <Button icon={<RotateLeftOutlined />} onClick={rotate} size="large">
              {t('tetris.rotate')}
            </Button>
            <Button icon={<VerticalAlignBottomOutlined />} onClick={hardDrop} size="large" type="primary">
              {t('tetris.hardDrop')}
            </Button>
          </Space>
        </Space>

        {/* 操作说明 */}
        <div style={{
          marginTop: 16,
          padding: 12,
          background: isDark ? '#1a1a1a' : '#f5f5f5',
          borderRadius: 4,
        }}>
          <Text style={{ color: isDark ? '#888' : '#666', fontSize: 12 }}>
            {t('tetris.controls')}
          </Text>
        </div>
      </Card>
    </div>
  );
}
