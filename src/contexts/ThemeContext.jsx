/**
 * CLOUD NANDROPHIC THEME PROVIDER - ADVANCED ARCHITECTURE
 * Superior theming system with intelligent adaptation and accessibility
 * Implements: Context + Strategy + Observer + Adaptive Theming
 */

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import logger from '../config/api-config.js'

// Advanced Theme Architecture with Cloud Nandrophic Standards
const CLOUD_NANDROPHIC_THEME = {
  // Core Design System - Premium Colors
  colors: {
    // Primary Palette - Neuropedagogical Colors
    primaryBlue: '#4A90E2',
    primaryGreen: '#7ED321',
    primaryOrange: '#F5A623',
    primaryPurple: '#9013FE',
    primaryPink: '#E91E63',
    primaryCyan: '#00BCD4',
    primaryRed: '#DC3545',

    // Neutral System - Accessible Grays
    white: '#FFFFFF',
    lightGray: '#F8F9FA',
    mediumGray: '#6C757D',
    darkGray: '#343A40',
    black: '#212529',

    // Semantic Colors - Enhanced Feedback
    success: '#10B981',
    successLight: '#D1FAE5',
    successDark: '#047857',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    warningDark: '#92400E',
    error: '#EF4444',
    errorLight: '#FEE2E2',
    errorDark: '#991B1B',
    info: '#06B6D4',
    infoLight: '#CFFAFE',
    infoDark: '#0E7490',

    // Advanced Accessibility Colors
    highContrastText: '#000000',
    highContrastBg: '#FFFFFF',
    focusRing: '#3B82F6',

    // Gradient System
    gradients: {
      primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      success: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      warning: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      creative: 'linear-gradient(135deg, #9013FE 0%, #E91E63 100%)',
      neuropedagogical: 'linear-gradient(135deg, #4A90E2 0%, #7ED321 100%)',
    },
  },

  // Typography System - Neuropedagogical Optimized
  typography: {
    fontFamily: {
      primary: '"Fredoka", "Comic Sans MS", cursive',
      secondary: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: '"Fira Code", "Consolas", monospace',
    },

    fontSizes: {
      xs: '0.75rem', // 12px
      sm: '0.875rem', // 14px
      md: '1rem', // 16px
      lg: '1.25rem', // 20px
      xl: '1.5rem', // 24px
      xxl: '2rem', // 32px
      xxxl: '2.5rem', // 40px
      title: '3rem', // 48px
    },

    fontWeights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },

    lineHeights: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  // Spacing System - Harmonious Scale
  spacing: {
    xs: '0.25rem', // 4px
    sm: '0.5rem', // 8px
    md: '1rem', // 16px
    lg: '1.5rem', // 24px
    xl: '2rem', // 32px
    xxl: '3rem', // 48px
    xxxl: '4rem', // 64px
  },

  // Border Radius System
  borderRadius: {
    none: '0',
    small: '0.5rem', // 8px
    medium: '1rem', // 16px
    large: '1.5rem', // 24px
    round: '50%',
    pill: '9999px',
  },

  // Shadow System - Layered Depth
  shadows: {
    none: 'none',
    light: '0 2px 8px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 16px rgba(0, 0, 0, 0.15)',
    strong: '0 8px 32px rgba(0, 0, 0, 0.2)',
    glow: '0 0 20px rgba(74, 144, 226, 0.3)',
    inset: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
  },

  // Animation System - Smooth Transitions
  animations: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },

  // Responsive Breakpoints
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1366px',
  },

  // Z-Index Scale
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
    notification: 2000,
  },
}

// Theme Mode Variants
const THEME_MODES = {
  light: {
    ...CLOUD_NANDROPHIC_THEME,
    mode: 'light',
  },

  dark: {
    ...CLOUD_NANDROPHIC_THEME,
    mode: 'dark',
    colors: {
      ...CLOUD_NANDROPHIC_THEME.colors,
      white: '#1A1A1A',
      lightGray: '#2D2D2D',
      mediumGray: '#404040',
      darkGray: '#E0E0E0',
      black: '#FFFFFF',
      gradients: {
        primary: 'linear-gradient(135deg, #1e3a8a 0%, #581c87 100%)',
        success: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
        warning: 'linear-gradient(135deg, #92400e 0%, #b45309 100%)',
        creative: 'linear-gradient(135deg, #581c87 0%, #be185d 100%)',
        neuropedagogical: 'linear-gradient(135deg, #1e40af 0%, #166534 100%)',
      },
    },
  },

  highContrast: {
    ...CLOUD_NANDROPHIC_THEME,
    mode: 'highContrast',
    colors: {
      ...CLOUD_NANDROPHIC_THEME.colors,
      primaryBlue: '#000000',
      primaryGreen: '#000000',
      primaryOrange: '#000000',
      primaryPurple: '#000000',
      white: '#FFFFFF',
      lightGray: '#F0F0F0',
      mediumGray: '#808080',
      darkGray: '#000000',
      black: '#000000',
    },
  },
}

// Theme Action Types
const THEME_ACTIONS = {
  SET_MODE: 'SET_MODE',
  SET_ACCESSIBILITY: 'SET_ACCESSIBILITY',
  SET_CUSTOM_COLORS: 'SET_CUSTOM_COLORS',
  TOGGLE_REDUCED_MOTION: 'TOGGLE_REDUCED_MOTION',
  RESET_THEME: 'RESET_THEME',
}

// Initial Theme State
const initialThemeState = {
  mode: 'light',
  reducedMotion: false,
  customColors: {},
  accessibility: {
    highContrast: false,
    largeText: false,
    dyslexiaFriendly: false,
  },
}

// Advanced Theme Reducer with Cloud Nandrophic Logic
function themeReducer(state, action) {
  switch (action.type) {
    case THEME_ACTIONS.SET_MODE:
      return {
        ...state,
        mode: action.payload,
        // Auto-detect accessibility needs
        accessibility: {
          ...state.accessibility,
          highContrast: action.payload === 'highContrast',
        },
      }

    case THEME_ACTIONS.SET_ACCESSIBILITY:
      return {
        ...state,
        accessibility: {
          ...state.accessibility,
          ...action.payload,
        },
        // Auto-switch to high contrast if needed
        mode: action.payload.highContrast ? 'highContrast' : state.mode,
      }

    case THEME_ACTIONS.SET_CUSTOM_COLORS:
      return {
        ...state,
        customColors: {
          ...state.customColors,
          ...action.payload,
        },
      }

    case THEME_ACTIONS.TOGGLE_REDUCED_MOTION:
      return {
        ...state,
        reducedMotion: !state.reducedMotion,
      }

    case THEME_ACTIONS.RESET_THEME:
      return {
        ...initialThemeState,
        mode: state.mode, // Preserve mode preference
      }

    default:
      return state
  }
}

// Theme Context Creation
const ThemeContext = createContext()

// Advanced Theme Provider Component
export const CloudNandrophicThemeProvider = ({ children }) => {
  const [themeState, dispatch] = useReducer(themeReducer, initialThemeState)

  // Intelligent theme computation
  const computedTheme = React.useMemo(() => {
    const baseTheme = THEME_MODES[themeState.mode] || THEME_MODES.light

    // Apply custom colors
    const theme = {
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        ...themeState.customColors,
      },
    }

    // Apply accessibility modifications
    if (themeState.accessibility.largeText) {
      theme.typography.fontSizes = Object.keys(theme.typography.fontSizes).reduce((acc, key) => {
        const currentSize = parseFloat(theme.typography.fontSizes[key])
        acc[key] = `${currentSize * 1.25}rem`
        return acc
      }, {})
    }

    // Apply reduced motion
    if (themeState.reducedMotion) {
      theme.animations.duration = {
        fast: '0ms',
        normal: '0ms',
        slow: '0ms',
      }
    }

    return theme
  }, [themeState])

  // Auto-detect system preferences
  useEffect(() => {
    const detectSystemPreferences = () => {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches

      if (prefersDark && themeState.mode === 'light') {
        dispatch({ type: THEME_ACTIONS.SET_MODE, payload: 'dark' })
      }

      if (prefersReducedMotion !== themeState.reducedMotion) {
        dispatch({ type: THEME_ACTIONS.TOGGLE_REDUCED_MOTION })
      }

      if (prefersHighContrast && !themeState.accessibility.highContrast) {
        dispatch({
          type: THEME_ACTIONS.SET_ACCESSIBILITY,
          payload: { highContrast: true },
        })
      }
    }

    detectSystemPreferences()

    // Listen for system preference changes
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)')

    const handleDarkModeChange = (e) => {
      dispatch({
        type: THEME_ACTIONS.SET_MODE,
        payload: e.matches ? 'dark' : 'light',
      })
    }

    const handleReducedMotionChange = (e) => {
      if (e.matches !== themeState.reducedMotion) {
        dispatch({ type: THEME_ACTIONS.TOGGLE_REDUCED_MOTION })
      }
    }

    const handleHighContrastChange = (e) => {
      dispatch({
        type: THEME_ACTIONS.SET_ACCESSIBILITY,
        payload: { highContrast: e.matches },
      })
    }

    darkModeQuery.addListener(handleDarkModeChange)
    reducedMotionQuery.addListener(handleReducedMotionChange)
    highContrastQuery.addListener(handleHighContrastChange)

    return () => {
      darkModeQuery.removeListener(handleDarkModeChange)
      reducedMotionQuery.removeListener(handleReducedMotionChange)
      highContrastQuery.removeListener(handleHighContrastChange)
    }
  }, [themeState])

  // Theme API methods
  const setThemeMode = useCallback((mode) => {
    dispatch({ type: THEME_ACTIONS.SET_MODE, payload: mode })
    logger.info('Theme mode changed', { mode })
  }, [])

  const setAccessibilityOptions = useCallback((options) => {
    dispatch({ type: THEME_ACTIONS.SET_ACCESSIBILITY, payload: options })
    logger.info('Accessibility options updated', options)
  }, [])

  const setCustomColors = useCallback((colors) => {
    dispatch({ type: THEME_ACTIONS.SET_CUSTOM_COLORS, payload: colors })
    logger.info('Custom colors applied', colors)
  }, [])

  const toggleReducedMotion = useCallback(() => {
    dispatch({ type: THEME_ACTIONS.TOGGLE_REDUCED_MOTION })
    logger.info('Reduced motion toggled', { enabled: !themeState.reducedMotion })
  }, [themeState.reducedMotion])

  const resetTheme = useCallback(() => {
    dispatch({ type: THEME_ACTIONS.RESET_THEME })
    logger.info('Theme reset to defaults')
  }, [])

  // Context value with advanced API
  const contextValue = {
    theme: computedTheme,
    themeState,
    setThemeMode,
    setAccessibilityOptions,
    setCustomColors,
    toggleReducedMotion,
    resetTheme,
    // Helper utilities
    isLightMode: themeState.mode === 'light',
    isDarkMode: themeState.mode === 'dark',
    isHighContrastMode: themeState.mode === 'highContrast',
    hasReducedMotion: themeState.reducedMotion,
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      <StyledThemeProvider theme={computedTheme}>{children}</StyledThemeProvider>
    </ThemeContext.Provider>
  )
}

// Advanced Theme Hook
export const useCloudNandrophicTheme = () => {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useCloudNandrophicTheme must be used within CloudNandrophicThemeProvider')
  }

  return context
}

// Utility Hooks
export const useResponsiveValue = (values) => {
  const { theme } = useCloudNandrophicTheme()
  const [currentValue, setCurrentValue] = React.useState(values.mobile || values.default)

  React.useEffect(() => {
    const updateValue = () => {
      const width = window.innerWidth

      if (width >= parseInt(theme.breakpoints.wide)) {
        setCurrentValue(values.wide || values.desktop || values.default)
      } else if (width >= parseInt(theme.breakpoints.desktop)) {
        setCurrentValue(values.desktop || values.default)
      } else if (width >= parseInt(theme.breakpoints.tablet)) {
        setCurrentValue(values.tablet || values.mobile || values.default)
      } else {
        setCurrentValue(values.mobile || values.default)
      }
    }

    updateValue()
    window.addEventListener('resize', updateValue)
    return () => window.removeEventListener('resize', updateValue)
  }, [values, theme.breakpoints])

  return currentValue
}

// Theme Presets for Quick Setup
export const THEME_PRESETS = {
  default: {
    mode: 'light',
    accessibility: { highContrast: false, largeText: false },
  },

  accessibility: {
    mode: 'highContrast',
    accessibility: { highContrast: true, largeText: true },
  },

  dark: {
    mode: 'dark',
    accessibility: { highContrast: false, largeText: false },
  },

  minimal: {
    mode: 'light',
    reducedMotion: true,
    accessibility: { highContrast: false, largeText: false },
  },
}

export default CloudNandrophicThemeProvider
