// Utilitários para acessibilidade no Portal Betina

// Importar função para verificar se o TTS está ativado
import { isTTSEnabled } from '../tts/ttsManager.js'

// Anunciar texto para leitores de tela
export const announceToScreenReader = (message) => {
  // Verificar se o recurso de Text-to-Speech está ativado
  // (isso só afeta anúncios automáticos, não o leitor de tela nativo)
  if (!isTTSEnabled()) {
    // Se o TTS estiver desativado, não fazer anúncios automáticos
    // Mas ainda permitir que leitores de tela nativos possam ler normalmente
    return
  }

  const announcement = document.createElement('div')
  announcement.setAttribute('aria-live', 'polite')
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message

  document.body.appendChild(announcement)

  // Remove após 1 segundo
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

// Verificar se o usuário prefere movimento reduzido
export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Verificar se o usuário prefere alto contraste
export const prefersHighContrast = () => {
  return window.matchMedia('(prefers-contrast: high)').matches
}

// Aplicar configurações de acessibilidade
export const applyAccessibilitySettings = () => {
  const body = document.body
  if (prefersHighContrast()) {
    body.classList.add('high-contrast')
  }
  if (prefersReducedMotion()) {
    body.classList.add('reduced-motion')
  }
}

// Salvar configurações de acessibilidade
export const saveAccessibilitySettings = (settings) => {
  localStorage.setItem('betina_accessibility', JSON.stringify(settings))
  applyAccessibilitySettings()
}

// Alternar alto contraste
export const toggleHighContrast = () => {
  const body = document.body
  const hasHighContrast = body.classList.contains('high-contrast')

  if (hasHighContrast) {
    body.classList.remove('high-contrast')
  } else {
    body.classList.add('high-contrast')
  }

  // Salvar preferência
  const currentSettings = getCurrentSettings()
  saveAccessibilitySettings({
    ...currentSettings,
    highContrast: !hasHighContrast,
  })

  // Anunciar mudança
  announceToScreenReader(hasHighContrast ? 'Alto contraste desativado' : 'Alto contraste ativado')
}

// Obter configurações atuais
export const getCurrentSettings = () => {
  const body = document.body
  return {
    highContrast: body.classList.contains('high-contrast'),
    reducedMotion: body.classList.contains('reduced-motion'),
    largeText: body.classList.contains('large-text'),
    soundEnabled: !body.classList.contains('sound-disabled'),
  }
}

// Verificar se o dispositivo suporta vibração
export const supportsVibration = () => {
  return 'vibrate' in navigator
}

// Vibração suave para feedback tátil
export const vibrate = (pattern = [100]) => {
  if (supportsVibration()) {
    navigator.vibrate(pattern)
  }
}

// Vibração para sucesso
export const vibrateSuccess = () => {
  vibrate([100, 50, 100]) // Dois pulsos curtos
}

// Vibração para erro
export const vibrateError = () => {
  vibrate([200]) // Um pulso longo
}

// Foco em elemento com delay (útil para transições)
export const focusElement = (element, delay = 0) => {
  if (element) {
    setTimeout(() => {
      element.focus()
    }, delay)
  }
}

// Verificar se um elemento está visível na tela
export const isElementVisible = (element) => {
  if (!element) return false

  const rect = element.getBoundingClientRect()
  const windowHeight = window.innerHeight || document.documentElement.clientHeight
  const windowWidth = window.innerWidth || document.documentElement.clientWidth

  return rect.top >= 0 && rect.left >= 0 && rect.bottom <= windowHeight && rect.right <= windowWidth
}

// Scroll suave para elemento
export const scrollToElement = (element, offset = 0) => {
  if (!element) return

  const elementPosition = element.offsetTop - offset

  if (prefersReducedMotion()) {
    window.scrollTo(0, elementPosition)
  } else {
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth',
    })
  }
}

// Gerenciar foco para modais e overlays
export const trapFocus = (containerElement) => {
  if (!containerElement) return

  const focusableElements = containerElement.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )

  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  const handleTabKey = (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus()
          e.preventDefault()
        }
      }
    }

    if (e.key === 'Escape') {
      // Permitir que o componente pai gerencie o fechamento
      containerElement.dispatchEvent(new CustomEvent('escape-pressed'))
    }
  }

  containerElement.addEventListener('keydown', handleTabKey)

  // Focar no primeiro elemento
  if (firstElement) {
    firstElement.focus()
  }

  // Retornar função de limpeza
  return () => {
    containerElement.removeEventListener('keydown', handleTabKey)
  }
}

// Inicializar configurações de acessibilidade
export const initializeAccessibility = () => {
  // Aplicar configurações salvas
  applyAccessibilitySettings()

  // Adicionar estilos CSS para acessibilidade se não existirem
  if (!document.getElementById('accessibility-styles')) {
    const style = document.createElement('style')
    style.id = 'accessibility-styles'
    style.textContent = `
      .high-contrast {
        background-color: black;
        color: white;
      }
      .reduced-motion * {
        animation: none;
        transition: none;
      }
    `
    document.head.appendChild(style)
  }
}

// Configurações padrão de acessibilidade
export const defaultAccessibilitySettings = {
  highContrast: false,
  reducedMotion: prefersReducedMotion(),
  largeText: false,
  soundEnabled: true,
}
