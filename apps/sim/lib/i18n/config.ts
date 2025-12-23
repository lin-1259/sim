import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Language = 'zh-CN' | 'en-US'

export interface I18nConfig {
  language: Language
  setLanguage: (language: Language) => void
}

export const useI18nStore = create<I18nConfig>()(
  persist(
    (set) => ({
      language: 'zh-CN', // 默认中文
      setLanguage: (language: Language) => set({ language }),
    }),
    {
      name: 'sim-i18n-config',
      partialize: (state) => ({ language: state.language }),
    }
  )
)

// 语言映射
export const languageMap: Record<Language, string> = {
  'zh-CN': '中文',
  'en-US': 'English',
}

// 导航语言选项
export const languageOptions: Array<{ code: Language; name: string }> = [
  { code: 'zh-CN', name: '中文' },
  { code: 'en-US', name: 'English' },
]