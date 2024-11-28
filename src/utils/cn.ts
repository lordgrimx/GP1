/**
 * @file    cn.ts
 * @desc    CSS sınıf birleştirme yardımcı fonksiyonu
 * @details Tailwind CSS sınıflarını dinamik olarak birleştirmek için clsx ve tailwind-merge kullanır
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * @function cn
 * @desc     CSS sınıflarını birleştiren yardımcı fonksiyon
 * @param    {ClassValue[]} inputs - Birleştirilecek CSS sınıfları
 * @returns  {string} Birleştirilmiş ve optimize edilmiş CSS sınıfları
 * 
 * @example
 * cn('px-4 py-2', isActive && 'bg-blue-500', className)
 * // -> 'px-4 py-2 bg-blue-500 custom-class'
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
} 