// Importing types and functions from 'clsx' and 'tailwind-merge'
import { type ClassValue, clsx } from "clsx"; 
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge class names.
 * 
 * @param {ClassValue[]} inputs - An array of class values to be merged.
 * @returns {string} - The merged class names.
 * 
 * This function combines class names using 'clsx' and then merges them using 'twMerge'.
 * 'clsx' is used to conditionally join class names together, and 'twMerge' is used to 
 * intelligently merge Tailwind CSS class names, resolving conflicts and ensuring that
 * the final class string is optimized and correct.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
