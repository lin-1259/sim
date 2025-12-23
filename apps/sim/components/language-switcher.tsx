'use client'

import { useState } from 'react'
import { ChevronDown, Globe2 } from 'lucide-react'
import { useI18nStore, languageOptions } from '@/lib/i18n/config'
import { useI18n } from '@/lib/i18n/hooks'
import { cn } from '@/lib/core/utils/cn'

interface LanguageSwitcherProps {
  variant?: 'icon' | 'full'
  className?: string
  showIcon?: boolean
}

/**
 * 语言切换组件
 */
export function LanguageSwitcher({ 
  variant = 'full', 
  className,
  showIcon = true 
}: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { language, setLanguage } = useI18nStore()
  const { t } = useI18n()

  const handleLanguageChange = (newLanguage: typeof language) => {
    setLanguage(newLanguage)
    setIsOpen(false)
  }

  const currentLanguage = languageOptions.find(lang => lang.code === language)

  if (variant === 'icon') {
    return (
      <div className={cn('relative', className)}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-accent transition-colors"
          aria-label="切换语言"
        >
          {showIcon && <Globe2 className="h-4 w-4" />}
          <ChevronDown className={cn(
            'h-3 w-3 ml-1 transition-transform',
            isOpen && 'rotate-180'
          )} />
        </button>

        {isOpen && (
          <>
            {/* 遮罩层 */}
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* 下拉菜单 */}
            <div className="absolute top-full right-0 mt-1 w-32 bg-background border border-border rounded-md shadow-lg z-20">
              {languageOptions.map((option) => (
                <button
                  key={option.code}
                  onClick={() => handleLanguageChange(option.code)}
                  className={cn(
                    'w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors first:rounded-t-md last:rounded-b-md',
                    option.code === language && 'bg-accent font-medium'
                  )}
                >
                  {option.name}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-md hover:bg-accent transition-colors"
        aria-label="切换语言"
      >
        {showIcon && <Globe2 className="h-4 w-4" />}
        <span>{currentLanguage?.name}</span>
        <ChevronDown className={cn(
          'h-3 w-3 transition-transform',
          isOpen && 'rotate-180'
        )} />
      </button>

      {isOpen && (
        <>
          {/* 遮罩层 */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* 下拉菜单 */}
          <div className="absolute top-full left-0 mt-1 w-40 bg-background border border-border rounded-md shadow-lg z-20">
            {languageOptions.map((option) => (
              <button
                key={option.code}
                onClick={() => handleLanguageChange(option.code)}
                className={cn(
                  'w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors first:rounded-t-md last:rounded-b-md flex items-center gap-2',
                  option.code === language && 'bg-accent font-medium'
                )}
              >
                {showIcon && <Globe2 className="h-3 w-3" />}
                <span>{option.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

/**
 * 简化的语言切换按钮
 */
export function SimpleLanguageSwitcher({ className }: { className?: string }) {
  const { language, setLanguage } = useI18nStore()

  const toggleLanguage = () => {
    setLanguage(language === 'zh-CN' ? 'en-US' : 'zh-CN')
  }

  return (
    <button
      onClick={toggleLanguage}
      className={cn(
        'flex items-center gap-1 px-2 py-1 text-xs border border-border rounded hover:bg-accent transition-colors',
        className
      )}
      aria-label="切换语言"
    >
      <Globe2 className="h-3 w-3" />
      <span>{language === 'zh-CN' ? '中' : 'EN'}</span>
    </button>
  )
}