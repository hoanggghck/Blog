import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility để merge className trong Tailwind + clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import type { ClassValue } from "clsx"
