'use client'

import { useMemo } from 'react'
import { useI18nStore, type Language } from './config'
import { zhCN } from './translations/zh-CN'
import { enUS } from './translations/en-US'

// 翻译映射
const translations = {
  'zh-CN': zhCN,
  'en-US': enUS,
}

/**
 * 翻译函数类型
 */
type TranslationKey = string
type TranslationParams = Record<string, string | number | boolean>

/**
 * 深度获取对象属性
 */
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

/**
 * 替换字符串中的参数
 */
function replaceParams(text: string, params?: TranslationParams): string {
  if (!params) return text
  
  return text.replace(/\{(\w+)\}/g, (match, key) => {
    return params[key]?.toString() || match
  })
}

/**
 * 获取翻译文本的函数
 */
function getTranslation(
  translations: any,
  key: TranslationKey,
  params?: TranslationParams
): string {
  const value = getNestedValue(translations, key)
  
  if (typeof value === 'string') {
    return replaceParams(value, params)
  }
  
  if (typeof value === 'function') {
    // 支持函数形式的翻译（如需要根据条件返回不同文本）
    const result = value(params)
    return typeof result === 'string' ? result : key
  }
  
  return key // 如果没有找到翻译，返回 key
}

/**
 * i18n Hook
 * @returns 翻译函数和当前语言
 */
export function useI18n() {
  const { language } = useI18nStore()
  
  const t = useMemo(() => {
    const currentTranslations = translations[language]
    
    return (key: TranslationKey, params?: TranslationParams): string => {
      return getTranslation(currentTranslations, key, params)
    }
  }, [language])
  
  return {
    t,
    language,
    isZhCN: language === 'zh-CN',
    isEnUS: language === 'en-US',
  }
}

/**
 * 获取指定语言的翻译（不需要 hook）
 */
export function getStaticTranslation(
  language: Language,
  key: TranslationKey,
  params?: TranslationParams
): string {
  const currentTranslations = translations[language]
  return getTranslation(currentTranslations, key, params)
}

/**
 * 切换语言
 */
export function toggleLanguage(currentLanguage: Language): Language {
  return currentLanguage === 'zh-CN' ? 'en-US' : 'zh-CN'
}

/**
 * 检查是否为移动设备（用于条件性翻译）
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 640
}