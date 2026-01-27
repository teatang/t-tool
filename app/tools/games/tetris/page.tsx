'use client';

import { useAppSelector } from '@/lib/store/hooks';
import { TetrisGame } from './TetrisGame';

/**
 * 俄罗斯方块游戏页面
 */
export default function TetrisPage() {
  const { isDark } = useAppSelector((state) => state.theme);

  return (
    <div style={{ padding: 16 }}>
      <TetrisGame isDark={isDark} />
    </div>
  );
}
