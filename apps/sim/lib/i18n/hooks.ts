'use client'

import { useMemo } from 'react'

import { type Language, useI18nStore } from './config'
import { enUS } from './translations/en-US'
import { zhCN } from './translations/zh-CN'

export type TranslationKey = string
export type TranslationParams = Record<string, string | number | boolean>
export type Translate = (key: TranslationKey, params?: TranslationParams) => string

type TranslationFunction = (params?: TranslationParams) => string

type TranslationNode = string | TranslationFunction | TranslationDictionary

type TranslationDictionary = Record<string, TranslationNode>

const translations: Record<Language, TranslationDictionary> = {
  'zh-CN': zhCN as TranslationDictionary,
  'en-US': enUS as TranslationDictionary,
}

function isTranslationDictionary(value: TranslationNode | undefined): value is TranslationDictionary {
  return typeof value === 'object' && value !== null
}

function getNestedValue(obj: TranslationDictionary, path: string): TranslationNode | undefined {
  const keys = path.split('.')
  let current: TranslationNode = obj

  for (const key of keys) {
    if (!isTranslationDictionary(current)) return undefined
    current = current[key]
    if (current === undefined) return undefined
  }

  return current
}

function replaceParams(text: string, params?: TranslationParams): string {
  if (!params) return text

  return text.replace(/\{(\w+)\}/g, (match, key: string) => {
    const value = params[key]
    return value === undefined ? match : value.toString()
  })
}

function getTranslation(
  dictionary: TranslationDictionary,
  key: TranslationKey,
  params?: TranslationParams
): string {
  const value = getNestedValue(dictionary, key)

  if (typeof value === 'string') return replaceParams(value, params)
  if (typeof value === 'function') return value(params)

  return key
}

export interface UseI18nResult {
  t: Translate
  language: Language
  isZhCN: boolean
  isEnUS: boolean
}

/**
 * i18n Hook.
 * @returns Translation function and current language.
 */
export function useI18n(): UseI18nResult {
  const language = useI18nStore((state) => state.language)

  const t = useMemo<Translate>(() => {
    const dictionary = translations[language]

    return (key, params) => getTranslation(dictionary, key, params)
  }, [language])

  return {
    t,
    language,
    isZhCN: language === 'zh-CN',
    isEnUS: language === 'en-US',
  }
}

/**
 * Get a translation without using a React hook.
 */
export function getStaticTranslation(
  language: Language,
  key: TranslationKey,
  params?: TranslationParams
): string {
  return getTranslation(translations[language], key, params)
}

/**
 * Toggle language.
 */
export function toggleLanguage(currentLanguage: Language): Language {
  return currentLanguage === 'zh-CN' ? 'en-US' : 'zh-CN'
}

/**
 * Check if the current window is in a mobile breakpoint.
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 640
}
