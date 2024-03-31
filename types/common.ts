import { AppDispatch, RootState } from "@/constants";
import { ForwardRefRenderFunction } from "react";
import type { TypedUseSelectorHook } from "react-redux";
import { useDispatch, useSelector } from "react-redux";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export type RefComponent<
  Props,
  Element = HTMLDivElement,
> = ForwardRefRenderFunction<Element, Props>;
