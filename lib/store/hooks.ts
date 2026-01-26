import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

/**
 * 类型化的 useDispatch hook
 * 返回带有正确类型的 dispatch 函数
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * 类型化的 useSelector hook
 * 返回带有正确类型的 selector 结果
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
