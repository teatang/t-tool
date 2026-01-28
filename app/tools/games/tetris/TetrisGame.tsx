'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, Button, Space, Statistic, Typography, Segmented } from 'antd';
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
  pieceTypes: TetrominoType[],
  cellSize: number,
  isDark: boolean,
  t: (key: string) => string
) => {
  const previewWidth = 100;
  const previewHeight = 30 + pieceTypes.length * 50;
  const startX = BOARD_WIDTH * cellSize + 20;
  const startY = 30;

  // 背景面板
  ctx.fillStyle = isDark ? '#1e1e1e' : '#f8f8f8';
  ctx.fillRect(startX - 10, startY - 20, previewWidth, previewHeight);

  // 标题
  ctx.fillStyle = isDark ? '#a0a0a0' : '#666';
  ctx.font = '14px sans-serif';
  ctx.fillText(t('tetris.next'), startX, startY - 5);

  // 绘制每个方块
  pieceTypes.forEach((pieceType, index) => {
    const tetromino = TETROMINOES[pieceType];
    const pieceY = startY + 15 + index * 45;

    // 隔行背景
    if (index % 2 === 0) {
      ctx.fillStyle = isDark ? '#252525' : '#fff';
      ctx.fillRect(startX - 5, pieceY - 5, previewWidth - 5, 40);
    }

    // 序号标签
    ctx.fillStyle = isDark ? '#666' : '#999';
    ctx.font = '11px sans-serif';
    ctx.fillText(`${index + 1}.`, startX - 5, pieceY + 20);

    // 绘制方块（缩小尺寸以适应预览）
    const scale = 0.7;
    const offsetX = startX + 18;
    const offsetY = pieceY + 5;

    for (let y = 0; y < tetromino.shape.length; y++) {
      for (let x = 0; x < tetromino.shape[y].length; x++) {
        if (tetromino.shape[y][x]) {
          const px = offsetX + x * cellSize * scale;
          const py = offsetY + y * cellSize * scale;
          const size = cellSize * scale - 1;

          ctx.fillStyle = tetromino.color;
          ctx.fillRect(px, py, size, size);

          // 高光
          ctx.fillStyle = 'rgba(255,255,255,0.2)';
          ctx.fillRect(px, py, size, 2);
          ctx.fillRect(px, py, 2, size);
        }
      }
    }
  });
};

// 绘制触底动画
const drawLandingAnimation = (
  ctx: CanvasRenderingContext2D,
  animation: { active: boolean; y: number; startTime: number; color: string },
  currentTime: number,
  cellSize: number
) => {
  if (!animation.active) return;

  const elapsed = currentTime - animation.startTime;
  const duration = 150; // 动画持续时间
  const progress = Math.min(elapsed / duration, 1);

  if (progress >= 1) {
    animation.active = false;
    return;
  }

  // 发光脉冲效果
  const glowIntensity = Math.sin(progress * Math.PI) * 0.8;
  const y = animation.y;

  // 绘制发光线条
  ctx.strokeStyle = `rgba(255, 255, 255, ${glowIntensity})`;
  ctx.lineWidth = 3;
  ctx.shadowColor = animation.color;
  ctx.shadowBlur = 20 * progress;

  ctx.beginPath();
  ctx.moveTo(0, (y + 1) * cellSize);
  ctx.lineTo(BOARD_WIDTH * cellSize, (y + 1) * cellSize);
  ctx.stroke();

  // 重置阴影
  ctx.shadowBlur = 0;
};

// 绘制消除动画
const drawLineClearAnimation = (
  ctx: CanvasRenderingContext2D,
  animation: { rows: number[]; startTime: number; colors: string[] },
  currentTime: number,
  cellSize: number
) => {
  if (!animation.rows.length) return;

  const elapsed = currentTime - animation.startTime;
  const duration = 300; // 动画持续时间
  const progress = Math.min(elapsed / duration, 1);

  if (progress >= 1) {
    animation.rows = [];
    return;
  }

  // 闪烁效果
  const flashIntensity = Math.sin((1 - progress) * Math.PI * 4) * 0.5 + 0.5;

  animation.rows.forEach((row, index) => {
    const color = animation.colors[index] || '#fff';
    const y = row * cellSize;

    // 绘制闪烁的行
    ctx.fillStyle = `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, ${flashIntensity})`;
    ctx.fillRect(0, y, BOARD_WIDTH * cellSize, cellSize);

    // 缩小效果
    if (progress > 0.5) {
      const shrinkProgress = (progress - 0.5) * 2;
      const innerSize = cellSize * (1 - shrinkProgress);

      for (let x = 0; x < BOARD_WIDTH; x++) {
        const cellX = x * cellSize + (cellSize - innerSize) / 2;
        ctx.fillStyle = color;
        ctx.fillRect(cellX, y + (cellSize - innerSize) / 2, innerSize, innerSize);
      }
    }
  });
};

// 游戏结束动画类型
interface GameOverAnimation {
  startTime: number;
  score: number;
  highScore: number;
  isNewHighScore: boolean;
}

// 绘制游戏结束动画
const drawGameOverAnimation = (
  ctx: CanvasRenderingContext2D,
  animation: GameOverAnimation,
  currentTime: number,
  cellSize: number,
  t: (key: string) => string
) => {
  const elapsed = currentTime - animation.startTime;
  const duration = 2000; // 动画持续时间
  const progress = Math.min(elapsed / duration, 1);

  // 绘制半透明遮罩
  ctx.fillStyle = `rgba(0, 0, 0, ${progress * 0.7})`;
  ctx.fillRect(0, 0, BOARD_WIDTH * cellSize, BOARD_HEIGHT * cellSize);

  if (progress > 0.3) {
    const fadeProgress = (progress - 0.3) / 0.7;

    // 游戏结束文字
    ctx.fillStyle = `rgba(255, 255, 255, ${fadeProgress})`;
    ctx.font = `bold ${28 * fadeProgress}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(t('tetris.gameOver'), BOARD_WIDTH * cellSize / 2, BOARD_HEIGHT * cellSize / 2 - 40);

    // 最终得分
    ctx.font = `${18 * fadeProgress}px sans-serif`;
    ctx.fillStyle = `rgba(255, 255, 255, ${fadeProgress * 0.8})`;
    ctx.fillText(`${t('tetris.finalScore')}: ${animation.score}`, BOARD_WIDTH * cellSize / 2, BOARD_HEIGHT * cellSize / 2);

    // 最高得分
    if (animation.isNewHighScore) {
      ctx.fillStyle = `rgba(255, 215, 0, ${fadeProgress})`; // 金色
      ctx.font = `bold ${16 * fadeProgress}px sans-serif`;
      ctx.fillText(t('tetris.newHighScore') + '!', BOARD_WIDTH * cellSize / 2, BOARD_HEIGHT * cellSize / 2 + 30);
    }

    ctx.fillStyle = `rgba(255, 255, 255, ${fadeProgress * 0.6})`;
    ctx.font = `${14 * fadeProgress}px sans-serif`;
    ctx.fillText(`${t('tetris.highScore')}: ${animation.highScore}`, BOARD_WIDTH * cellSize / 2, BOARD_HEIGHT * cellSize / 2 + 55);

    // 重置文本对齐
    ctx.textAlign = 'start';
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

  // 动画状态
  const landingAnimationRef = useRef<{ active: boolean; y: number; startTime: number; color: string } | null>(null);
  const lineClearAnimationRef = useRef<{ rows: number[]; startTime: number; colors: string[] } | null>(null);
  const gameOverAnimationRef = useRef<GameOverAnimation | null>(null);

  // 用于触发 React 更新的 state
  const [displayScore, setDisplayScore] = useState(0);
  const [displayLines, setDisplayLines] = useState(0);
  const [displayLevel, setDisplayLevel] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false); // 游戏结束状态
  const [previewCount, setPreviewCount] = useState(1); // 预览方块数量

  // 使用 lazy initialization 初始化最高分
  const [displayHighScore, setDisplayHighScore] = useState(() => {
    if (typeof window === 'undefined') return 0;
    const savedHighScore = localStorage.getItem('tetris-high-score');
    return savedHighScore ? parseInt(savedHighScore, 10) : 0;
  });

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
    const nextPieces = currentGame.getPieceQueue(previewCount);

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

    // 绘制触底动画
    if (landingAnimationRef.current) {
      drawLandingAnimation(ctx, landingAnimationRef.current, performance.now(), cellSize);
    }

    // 绘制消除动画
    if (lineClearAnimationRef.current) {
      drawLineClearAnimation(ctx, lineClearAnimationRef.current, performance.now(), cellSize);
    }

    // 绘制游戏结束动画
    if (gameOverAnimationRef.current) {
      drawGameOverAnimation(
        ctx,
        gameOverAnimationRef.current,
        performance.now(),
        cellSize,
        t
      );
    }

    // 绘制下一个方块预览
    drawNextPiece(ctx, nextPieces, cellSize, isDark, t);
  }, [isDark, t, previewCount]);

  // 游戏循环
  useEffect(() => {
    // 如果既不是在游戏中，也没有游戏结束需要显示，则停止循环
    if (!isPlaying && !isGameOver) {
      cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    const gameLoop = (timestamp: number) => {
      // 如果游戏正在进行，处理游戏逻辑
      if (isPlaying) {
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
            // 获取当前方块信息用于触底动画
            const pieceInfo = currentGame.getCurrentPieceInfo();
            const ghostY = currentGame.getGhostPosition();

            // 触发触底动画
            if (pieceInfo && ghostY !== null) {
              landingAnimationRef.current = {
                active: true,
                y: ghostY,
                startTime: performance.now(),
                color: pieceInfo.color,
              };
            }

            currentGame.lockPiece();

            // 获取消除行的颜色
            const board = currentGame.getBoard();
            const clearedRows: number[] = [];
            const clearedColors: string[] = [];

            for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
              if (board[y].every((cell) => cell !== null)) {
                clearedRows.push(y);
                // 获取该行第一个方块的颜色作为动画颜色
                const firstColor = board[y].find((c) => c !== null);
                if (firstColor) clearedColors.push(firstColor);
              }
            }

            const clearedLines = currentGame.clearLines();

            // 触发消除动画
            if (clearedRows.length > 0) {
              lineClearAnimationRef.current = {
                rows: clearedRows,
                startTime: performance.now(),
                colors: clearedColors,
              };
            }

            if (clearedLines > 0) {
              linesRef.current += clearedLines;
              levelRef.current = Math.floor(linesRef.current / 10) + 1;
              scoreRef.current += clearedLines * 100 * levelRef.current;
              setDisplayLines(linesRef.current);
              setDisplayLevel(levelRef.current);
              setDisplayScore(scoreRef.current);
            }

            if (currentGame.isGameOver()) {
              // 获取当前最高分
              const savedHighScore = localStorage.getItem('tetris-high-score');
              const currentHighScore = savedHighScore ? parseInt(savedHighScore, 10) : 0;
              const isNewHighScore = scoreRef.current > currentHighScore;

              // 更新最高分
              if (isNewHighScore) {
                localStorage.setItem('tetris-high-score', scoreRef.current.toString());
                setDisplayHighScore(scoreRef.current);
              }

              // 触发游戏结束动画
              gameOverAnimationRef.current = {
                startTime: performance.now(),
                score: scoreRef.current,
                highScore: isNewHighScore ? scoreRef.current : currentHighScore,
                isNewHighScore,
              };

              // 设置游戏结束状态
              setIsGameOver(true);
              setIsPlaying(false);
              // 游戏结束，不生成新方块
            } else {
              currentGame.spawnPiece();
            }
          }

          lastTimeRef.current = timestamp;
        }
      }

      // 总是重绘（包括游戏结束画面）
      draw();

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    lastTimeRef.current = 0;
    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, isGameOver, draw]);

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
    setIsGameOver(false);
    // 清除动画状态
    landingAnimationRef.current = null;
    lineClearAnimationRef.current = null;
    gameOverAnimationRef.current = null;
    draw();
  }, [draw]);

  // 开始/暂停游戏
  const togglePlay = useCallback(() => {
    // 如果游戏已结束，先重置
    if (isGameOver) {
      resetGame();
      setIsPlaying(true);
      // 让画布获得焦点
      setTimeout(() => canvasRef.current?.focus(), 0);
      return;
    }

    const newIsPlaying = !isPlaying;
    setIsPlaying(newIsPlaying);

    // 开始游戏时让画布获得焦点
    if (newIsPlaying) {
      setTimeout(() => canvasRef.current?.focus(), 0);
    }

    if (!newIsPlaying && gameRef.current.isGameOver()) {
      resetGame();
    }
  }, [isPlaying, isGameOver, resetGame]);

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

    // 获取当前方块信息用于触底动画
    const pieceInfo = currentGame.getCurrentPieceInfo();
    const ghostY = currentGame.getGhostPosition();

    // 触发触底动画
    if (pieceInfo && ghostY !== null) {
      landingAnimationRef.current = {
        active: true,
        y: ghostY,
        startTime: performance.now(),
        color: pieceInfo.color,
      };
    }

    currentGame.hardDrop();
    // 硬降后立即锁定方块
    currentGame.lockPiece();

    // 获取消除行的颜色
    const board = currentGame.getBoard();
    const clearedRows: number[] = [];
    const clearedColors: string[] = [];

    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
      if (board[y].every((cell) => cell !== null)) {
        clearedRows.push(y);
        const firstColor = board[y].find((c) => c !== null);
        if (firstColor) clearedColors.push(firstColor);
      }
    }

    const clearedLines = currentGame.clearLines();

    // 触发消除动画
    if (clearedRows.length > 0) {
      lineClearAnimationRef.current = {
        rows: clearedRows,
        startTime: performance.now(),
        colors: clearedColors,
      };
    }

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
      // 获取当前最高分
      const savedHighScore = localStorage.getItem('tetris-high-score');
      const currentHighScore = savedHighScore ? parseInt(savedHighScore, 10) : 0;
      const isNewHighScore = scoreRef.current > currentHighScore;

      // 更新最高分
      if (isNewHighScore) {
        localStorage.setItem('tetris-high-score', scoreRef.current.toString());
        setDisplayHighScore(scoreRef.current);
      }

      // 触发游戏结束动画
      gameOverAnimationRef.current = {
        startTime: performance.now(),
        score: scoreRef.current,
        highScore: isNewHighScore ? scoreRef.current : currentHighScore,
        isNewHighScore,
      };

      // 设置游戏结束状态
      setIsGameOver(true);
      setIsPlaying(false);
      // 游戏结束，不生成新方块
    }
    draw();
  }, [draw]);

  // 初始绘制
  useEffect(() => {
    // 初始时让画布获得焦点
    canvasRef.current?.focus();
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
          tabIndex={0}
          onKeyDown={(e) => {
            if (!isPlaying) return;
            e.preventDefault();

            switch (e.key) {
              case 'ArrowLeft':
                gameRef.current.moveLeft();
                break;
              case 'ArrowRight':
                gameRef.current.moveRight();
                break;
              case 'ArrowDown':
                gameRef.current.moveDown();
                break;
              case 'ArrowUp':
                gameRef.current.rotate();
                break;
              case ' ':
                hardDrop();
                break;
              default:
                return;
            }
            draw();
          }}
          style={{
            border: `2px solid ${isDark ? '#333' : '#d9d9d9'}`,
            borderRadius: 4,
            outline: 'none',
            cursor: isPlaying ? 'pointer' : 'default',
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
          <Statistic
            title={<Text style={{ color: isDark ? '#aaa' : '#666' }}>{t('tetris.highScore')}</Text>}
            value={displayHighScore}
            valueStyle={{ color: '#ffd700', fontWeight: 'bold' }}
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

        {/* 预览设置 */}
        <div style={{
          marginTop: 16,
          padding: 12,
          background: isDark ? '#1a1a1a' : '#f5f5f5',
          borderRadius: 4,
        }}>
          <Text style={{ color: isDark ? '#888' : '#666', fontSize: 12, display: 'block', marginBottom: 8 }}>
            {t('tetris.previewCount') || '预览数量'}
          </Text>
          <Segmented
            options={[
              { label: '1', value: 1 },
              { label: '2', value: 2 },
              { label: '3', value: 3 },
            ]}
            value={previewCount}
            onChange={(val) => {
              setPreviewCount(val as number);
              draw();
            }}
            onKeyDown={(e) => e.stopPropagation()}
            block
          />
        </div>

        {/* 控制按钮 */}
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button
            type="primary"
            icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
            onClick={togglePlay}
            onKeyDown={(e) => {
              e.stopPropagation();
              // 只在游戏结束时阻止空格键触发按钮
              if (e.key === ' ' && isGameOver) {
                e.preventDefault();
              }
            }}
            block
          >
            {isPlaying ? t('tetris.pause') : t('tetris.start')}
          </Button>

          <Button
            icon={<RedoOutlined />}
            onClick={resetGame}
            onMouseDown={(e) => {
              e.preventDefault();
              canvasRef.current?.focus();
            }}
            block
          >
            {t('tetris.restart')}
          </Button>

          {/* 方向控制 */}
          <Space wrap style={{ justifyContent: 'center', marginTop: 8 }}>
            <Button icon={<LeftOutlined />} onClick={moveLeft} onMouseDown={(e) => { e.preventDefault(); canvasRef.current?.focus(); }} size="large" />
            <Button icon={<RightOutlined />} onClick={moveRight} onMouseDown={(e) => { e.preventDefault(); canvasRef.current?.focus(); }} size="large" />
            <Button icon={<DownOutlined />} onClick={moveDown} onMouseDown={(e) => { e.preventDefault(); canvasRef.current?.focus(); }} size="large" />
            <Button icon={<RotateLeftOutlined />} onClick={rotate} onMouseDown={(e) => { e.preventDefault(); canvasRef.current?.focus(); }} size="large">
              {t('tetris.rotate')}
            </Button>
            <Button icon={<VerticalAlignBottomOutlined />} onClick={() => isPlaying && hardDrop()} onMouseDown={(e) => { e.preventDefault(); canvasRef.current?.focus(); }} size="large" type="primary" disabled={!isPlaying}>
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
