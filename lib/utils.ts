import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateReadingTime(text: string): number {
  if (!text) return 1;
  const wordsPerMinute = 200;
  // Strip HTML tags for accurate word count
  const cleanText = text.replace(/<[^>]*>/g, '');
  const numberOfWords = cleanText.split(/\s+/).length;
  return Math.ceil(numberOfWords / wordsPerMinute) || 1;
}