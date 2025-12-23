'use client'

import { useCallback, useMemo, useState } from 'react'
import { ChevronDown, Globe2 } from 'lucide-react'

import { type Language, languageOptions, useI18nStore } from '@/lib/i18n/config'
import { cn } from '@/lib/core/utils/cn'

interface LanguageSwitcherProps {
  variant?: 'icon' | 'full'
  className?: string
  showIcon?: boolean
}

/**
 * Language switcher component.
 */
export function LanguageSwitcher({
  variant = 'full',
  className,
  showIcon = true,
}: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const language = useI18nStore((state) => state.language)
  const setLanguage = useI18nStore((state) => state.setLanguage)

  const currentLanguage = useMemo(
    () => languageOptions.find((option) => option.code === language),
    [language]
  )

  const handleLanguageChange = useCallback(
    (newLanguage: Language) => {
      setLanguage(newLanguage)
      setIsOpen(false)
    },
    [setLanguage]
  )

  if (variant === 'icon') {
    return (
      <div className={cn('relative', className)}>
        <button
          onClick={() => setIsOpen((open) => !open)}
          className='flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-accent'
          aria-label='Switch language'
        >
          {showIcon && <Globe2 className='h-4 w-4' />}
          <ChevronDown
            className={cn('ml-1 h-3 w-3 transition-transform', isOpen && 'rotate-180')}
          />
        </button>

        {isOpen && (
          <>
            <div className='fixed inset-0 z-10' onClick={() => setIsOpen(false)} />
            <div className='absolute top-full right-0 z-20 mt-1 w-32 rounded-md border border-border bg-background shadow-lg'>
              {languageOptions.map((option) => (
                <button
                  key={option.code}
                  onClick={() => handleLanguageChange(option.code)}
                  className={cn(
                    'w-full px-3 py-2 text-left text-sm transition-colors first:rounded-t-md last:rounded-b-md hover:bg-accent',
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
        onClick={() => setIsOpen((open) => !open)}
        className='flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm transition-colors hover:bg-accent'
        aria-label='Switch language'
      >
        {showIcon && <Globe2 className='h-4 w-4' />}
        <span>{currentLanguage?.name}</span>
        <ChevronDown className={cn('h-3 w-3 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <>
          <div className='fixed inset-0 z-10' onClick={() => setIsOpen(false)} />
          <div className='absolute top-full left-0 z-20 mt-1 w-40 rounded-md border border-border bg-background shadow-lg'>
            {languageOptions.map((option) => (
              <button
                key={option.code}
                onClick={() => handleLanguageChange(option.code)}
                className={cn(
                  'flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors first:rounded-t-md last:rounded-b-md hover:bg-accent',
                  option.code === language && 'bg-accent font-medium'
                )}
              >
                {showIcon && <Globe2 className='h-3 w-3' />}
                <span>{option.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

interface SimpleLanguageSwitcherProps {
  className?: string
}

/**
 * Compact language toggle button.
 */
export function SimpleLanguageSwitcher({ className }: SimpleLanguageSwitcherProps) {
  const language = useI18nStore((state) => state.language)
  const setLanguage = useI18nStore((state) => state.setLanguage)

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'zh-CN' ? 'en-US' : 'zh-CN')
  }, [language, setLanguage])

  return (
    <button
      onClick={toggleLanguage}
      className={cn(
        'flex items-center gap-1 rounded border border-border px-2 py-1 text-xs transition-colors hover:bg-accent',
        className
      )}
      aria-label='Switch language'
    >
      <Globe2 className='h-3 w-3' />
      <span>{language === 'zh-CN' ? '中' : 'EN'}</span>
    </button>
  )
}
