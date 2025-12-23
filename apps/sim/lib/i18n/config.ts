'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Language = 'zh-CN' | 'en-US'

export interface I18nConfig {
  language: Language
  setLanguage: (language: Language) => void
}

/**
 * Client-side language preference store.
 */
export const useI18nStore = create<I18nConfig>()(
  persist(
    (set) => ({
      language: 'zh-CN',
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'sim-i18n-config',
      partialize: (state) => ({ language: state.language }),
    }
  )
)

export const languageMap: Record<Language, string> = {
  'zh-CN': '中文',
  'en-US': 'English',
}

export const languageOptions = [
  { code: 'zh-CN', name: '中文' },
  { code: 'en-US', name: 'English' },
] as const satisfies ReadonlyArray<{ code: Language; name: string }>
