/**
 * @file    tabs.tsx
 * @desc    Sekmeli gezinme bileşenleri
 * @details Radix UI tabanlı özelleştirilmiş sekme bileşenleri koleksiyonu
 */

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "../../utils/cn"

/**
 * @desc    Ana Tabs bileşeni
 * @component Tabs
 * @type    {React.FC}
 * @exports TabsPrimitive.Root
 * @note    Radix UI Tabs.Root bileşenini doğrudan dışa aktarır
 */
const Tabs = TabsPrimitive.Root

/**
 * @desc    Sekme listesi bileşeni
 * @component TabsList
 * @type    {React.ForwardRefExoticComponent}
 * @param   {React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>} props
 * @param   {React.Ref} ref - Bileşene iletilecek ref
 * @returns {JSX.Element} Stillendirilmiş sekme listesi
 * @styles
 *   - inline-flex: Yatay hizalama
 *   - h-10: 40px yükseklik
 *   - items-center: Dikey ortalama
 *   - justify-center: Yatay ortalama
 *   - rounded-md: Yuvarlatılmış köşeler
 *   - bg-gray-100: Açık gri arka plan
 *   - dark:bg-gray-800: Koyu tema arka plan
 */
const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

/**
 * @desc    Sekme tetikleyici bileşeni
 * @component TabsTrigger
 * @type    {React.ForwardRefExoticComponent}
 * @param   {React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>} props
 * @param   {React.Ref} ref - Bileşene iletilecek ref
 * @returns {JSX.Element} Stillendirilmiş sekme butonu
 * @styles
 *   - inline-flex: Yatay hizalama
 *   - whitespace-nowrap: Metin sarma engelleme
 *   - rounded-sm: Hafif yuvarlatılmış köşeler
 *   - px-3 py-1.5: Yatay ve dikey padding
 *   - text-sm: Küçük yazı boyutu
 *   - font-medium: Orta kalınlıkta yazı
 *   - ring-offset-white: Focus ring offset rengi
 *   - transition-all: Tüm değişimler için animasyon
 *   - disabled:pointer-events-none: Devre dışı durumda tıklama engelleme
 *   - data-[state=active]: Aktif durum stilleri
 */
const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-950 data-[state=active]:shadow-sm dark:ring-offset-gray-950 dark:focus-visible:ring-gray-800 dark:data-[state=active]:bg-gray-950 dark:data-[state=active]:text-gray-50",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

/**
 * @desc    Sekme içerik bileşeni
 * @component TabsContent
 * @type    {React.ForwardRefExoticComponent}
 * @param   {React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>} props
 * @param   {React.Ref} ref - Bileşene iletilecek ref
 * @returns {JSX.Element} Stillendirilmiş sekme içeriği
 * @styles
 *   - mt-2: Üst margin
 *   - ring-offset-white: Focus ring offset rengi
 *   - focus-visible:outline-none: Focus durumunda outline kaldırma
 *   - focus-visible:ring-2: Focus durumunda ring efekti
 *   - dark:ring-offset-gray-950: Koyu tema ring offset rengi
 */
const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-800",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

/**
 * @exports
 * @desc    Dışa aktarılan bileşenler
 * @components
 *   - Tabs: Ana sekme konteyner bileşeni
 *   - TabsList: Sekme listesi bileşeni
 *   - TabsTrigger: Sekme tetikleyici bileşeni
 *   - TabsContent: Sekme içerik bileşeni
 */
export { Tabs, TabsList, TabsTrigger, TabsContent } 