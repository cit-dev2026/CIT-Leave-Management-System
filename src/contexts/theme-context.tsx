import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'

type Theme = 'light' | 'dark'

type ThemeContextValue = {
  theme: Theme
  toggleTheme: () => void
}

const storageKey = 'cit-hrms-theme'

export const ThemeContext = createContext<ThemeContextValue | null>(null)

function getInitialTheme(): Theme {
  const savedTheme = localStorage.getItem(storageKey)

  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export function ThemeContextProvider({ children }: PropsWithChildren) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem(storageKey, theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
  }, [])

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
    }),
    [theme, toggleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
