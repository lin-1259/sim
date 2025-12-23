'use client'

import { useEffect } from 'react'

import { useI18nStore } from '@/lib/i18n/config'

/**
 * Keeps the document <html lang> attribute in sync with the currently selected UI language.
 *
 * This must run on the client because the language preference is persisted in localStorage.
 */
export function LanguageHtmlAttribute(): null {
  const language = useI18nStore((state) => state.language)

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  return null
}
