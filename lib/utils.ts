import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function debounce<F extends (...args: any[]) => void>(fn: F, time: number) {
  let timerId: NodeJS.Timeout;

  return (...args: Parameters<F>): void => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      fn(...args);
    }, time);
  };
}