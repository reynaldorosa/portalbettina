import React, { useState, useEffect, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import useSound from '../../hooks/useSound'
import useProgress from '../../hooks/useProgress'
import useTTS from '../../hooks/useTTS'
import {
  announceToScreenReader,
  prefersHighContrast,
  prefersReducedMotion,
} from '../../utils/accessibility/index.js'
import {
  InstructionText,
  DifficultySelector,
  DifficultyButton,
  ActionButton,
} from '../../styles/activityCommon'

// Definição de cores temáticas alinhadas ao projeto
const THEME_COLOR = 'var(--primary-purple)'
const THEME_GRADIENT = 'linear-gradient(135deg, var(--primary-purple), var(--primary-orange))'

// Templates em preto e branco para pintura assistida
const templates = [
  {
    id: 'flower',
    name: '🌸 Flor Estilizada',
    emoji: '🌸',
    svg: `<svg viewBox="0 0 200 200">
      <circle cx="100" cy="70" r="20" fill="none" stroke="#000" stroke-width="2" class="colorable" data-area="center"/>
      <circle cx="80" cy="100" r="20" fill="none" stroke="#000" stroke-width="2" class="colorable" data-area="petal1"/>
      <circle cx="120" cy="100" r="20" fill="none" stroke="#000" stroke-width="2" class="colorable" data-area="petal2"/>
      <circle cx="100" cy="130" r="20" fill="none" stroke="#000" stroke-width="2" class="colorable" data-area="petal3"/>
      <line x1="100" y1="150" x2="100" y2="200" stroke="#000" stroke-width="4" stroke-linecap="round" class="colorable" data-area="stem"/>
      <path d="M80 100 A20 20 0 0 1 100 70 A20 20 0 0 1 120 100" fill="none" stroke="#000" stroke-width="2" class="colorable" data-area="petal4"/>
    </svg>`,
  },
  {
    id: 'sun',
    name: '☀️ Sol',
    emoji: '☀️',
    svg: `<svg viewBox="0 0 200 200">
      <circle cx="100" cy="100" r="40" fill="none" stroke="#000" stroke-width="3" class="colorable" data-area="center"/>
      <path d="M100 20 L100 40 M100 160 L100 180 M20 100 L40 100 M160 100 L180 100 M35 35 L50 50 M150 50 L165 35 M35 165 L50 150 M150 150 L165 165" stroke="#000" stroke-width="4" stroke-linecap="round" class="colorable" data-area="rays"/>
    </svg>`,
  },
  {
    id: 'heart',
    name: '❤️ Coração',
    emoji: '❤️',
    svg: `<svg viewBox="0 0 200 200">
      <path d="M100 150 C100 150 70 120 70 90 C70 75 85 60 100 60 C115 60 130 75 130 90 C130 120 100 150 100 150 Z" fill="none" stroke="#000" stroke-width="3" class="colorable" data-area="heart"/>
    </svg>`,
  },
  {
    id: 'car',
    name: '🏎️ Carro de Corrida',
    emoji: '🏎️',
    svg: `<svg viewBox="0 0 200 200">
      <rect x="50" y="120" width="100" height="50" fill="none" stroke="#000" stroke-width="3" class="colorable" data-area="body"/>
      <circle cx="70" cy="170" r="20" fill="none" stroke="#000" stroke-width="3" class="colorable" data-area="wheel1"/>
      <circle cx="130" cy="170" r="20" fill="none" stroke="#000" stroke-width="3" class="colorable" data-area="wheel2"/>
      <line x1="50" y1="140" x2="70" y2="140" stroke="#000" stroke-width="3" class="colorable" data-area="window1"/>
      <line x1="130" y1="140" x2="150" y2="140" stroke="#000" stroke-width="3" class="colorable" data-area="window2"/>
    </svg>`,
  },
]

// Cores simples para crianças
const simpleColors = [
  { name: 'Vermelho', hex: '#FF4444', emoji: '🔴' },
  { name: 'Azul', hex: '#4444FF', emoji: '🔵' },
  { name: 'Verde', hex: '#44FF44', emoji: '🟢' },
  { name: 'Amarelo', hex: '#FFFF44', emoji: '🟡' },
  { name: 'Rosa', hex: '#FF44FF', emoji: '🩷' },
  { name: 'Laranja', hex: '#FF8844', emoji: '🟠' },
]

// Configurações de dificuldade
const difficulties = [
  { id: 'easy', name: 'Fácil', icon: '😊', description: 'Poucas partes para pintar' },
  { id: 'medium', name: 'Médio', icon: '🤔', description: 'Mais partes para pintar' },
  { id: 'hard', name: 'Difícil', icon: '🧠', description: 'Muitas partes para pintar' },
]

// Estilos refinados
const MainContainer = styled.div`
  min-height: 100vh;
  background: ${({ $highContrast }) => ($highContrast ? '#000' : THEME_GRADIENT)};
  color: ${({ $highContrast }) => ($highContrast ? '#fff' : '#333')};
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 1.5rem;
  align-items: center;
`

const SimplifiedHeader = styled(motion.div)`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  backdrop-filter: blur(10px);
`

const BackButton = styled(motion.button)`
  background: none;
  border: none;
  color: ${({ $highContrast }) => ($highContrast ? '#fff' : '#6b48ff')};
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: ${({ $highContrast }) => ($highContrast ? '#ddd' : '#ff6b9a')};
  }
`

const ActivityTitleSection = styled(motion.div)`
  text-align: center;
`

const ActivityMainTitle = styled.h1`
  font-size: 2rem;
  color: ${({ $highContrast }) => ($highContrast ? '#fff' : '#6b48ff')};
  margin: 0;
  font-weight: 600;
`

const ActivitySubtitle = styled.p`
  font-size: 1rem;
  color: ${({ $highContrast }) => ($highContrast ? '#ccc' : '#666')};
  margin: 0.5rem 0;
`

const TemplateSelector = styled(motion.div)`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 1.5rem;
  padding: 1.5rem;
  text-align: center;
  width: 100%;
  max-width: 600px;
`

const TemplateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`

const TemplateCard = styled(motion.div)`
  background: #fff;
  border-radius: 1rem;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  border: 3px solid ${(props) => (props.selected ? THEME_COLOR : '#ddd')};
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
    border-color: ${THEME_COLOR};
  }
`

const ColorPalette = styled(motion.div)`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 1.5rem;
  padding: 1rem;
  width: 100%;
  max-width: 600px;
`

const ColorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
  gap: 0.5rem;
  margin-top: 0.5rem;
`

const ColorButton = styled(motion.button)`
  background: ${(props) => props.color};
  border: 3px solid ${(props) => (props.selected ? '#333' : '#fff')};
  border-radius: 50%;
  width: 60px;
  height: 60px;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  }
`

const DrawingCanvas = styled(motion.div)`
  background: #fff;
  border-radius: 1.5rem;
  padding: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  svg {
    max-width: 100%;
    max-height: 100%;
    width: 280px;
    height: 280px;
  }
`

const ToolBar = styled(motion.div)`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
  max-width: 600px;
`

const ToolButton = styled(motion.button)`
  background: ${THEME_COLOR};
  color: white;
  border: none;
  border-radius: 1rem;
  padding: 0.8rem 1.2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  &:hover:not(:disabled) {
    background: var(--primary-orange);
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const BrushSizeIndicator = styled.div`
  font-size: 1.2rem;
  color: ${({ $highContrast }) => ($highContrast ? '#fff' : '#6b48ff')};
  margin-top: 0.5rem;
  text-align: center;
`

const CreativePaintingSimple = ({ onBack }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [selectedColor, setSelectedColor] = useState(simpleColors[0])
  const [difficulty, setDifficulty] = useState('easy')
  const [gameStarted, setGameStarted] = useState(false)
  const [coloredAreas, setColoredAreas] = useState({})
  const [brushSize, setBrushSize] = useState('medium') // 'small', 'medium', 'large'

  const { playClick, playSuccess } = useSound()
  const { recordSuccess } = useProgress('creative-painting')
  const { speak, speakInstruction, autoSpeak } = useTTS()
  const highContrast = prefersHighContrast()
  const reducedMotion = prefersReducedMotion()

  const startGame = () => {
    setGameStarted(true)
    playClick()
    autoSpeak('Escolha o que você quer pintar!', 1000)
  }

  const selectTemplate = (template) => {
    setSelectedTemplate(template)
    setColoredAreas({})
    playClick()
    announceToScreenReader(`${template.name} selecionado para pintar`)
    autoSpeak(`Você escolheu pintar ${template.name}. Agora escolha uma cor!`, 500)
  }

  const selectColor = (color) => {
    setSelectedColor(color)
    playClick()
    announceToScreenReader(`Cor ${color.name} selecionada`)
    speak(`Cor ${color.name} selecionada!`)
  }

  const clearDrawing = () => {
    setColoredAreas({})
    playClick()
    announceToScreenReader('Desenho limpo')
    speak('Desenho limpo! Comece de novo!')
  }

  const saveArt = () => {
    playSuccess()
    announceToScreenReader('Arte salva com sucesso')
    speak('Sua obra de arte foi salva! Muito bem!')
    recordSuccess({
      template: selectedTemplate?.name,
      colorsUsed: Object.values(coloredAreas).length,
      difficulty,
    })
  }

  // Memoização do SVG para evitar re-renderizações desnecessárias
  const renderInteractiveSVG = useMemo(() => {
    if (!selectedTemplate) return null

    const svgContent = selectedTemplate.svg
    const strokeWidth = brushSize === 'small' ? 2 : brushSize === 'large' ? 6 : 4

    return (
      <div
        dangerouslySetInnerHTML={{
          __html: svgContent.replace(/stroke-width="\d+"/g, `stroke-width="${strokeWidth}"`),
        }}
        onClick={(e) => {
          const area = e.target.getAttribute('data-area')
          if (area && selectedColor) {
            const newColoredAreas = { ...coloredAreas }
            newColoredAreas[area] = selectedColor.hex
            setColoredAreas(newColoredAreas)

            e.target.style.fill = selectedColor.hex
            playClick()
            announceToScreenReader(`Área pintada com ${selectedColor.name}`)
          }
        }}
        style={{ cursor: 'pointer' }}
      />
    )
  }, [selectedTemplate, brushSize, selectedColor, coloredAreas])

  if (!gameStarted) {
    return (
      <MainContainer $highContrast={highContrast}>
        <SimplifiedHeader>
          <BackButton onClick={onBack} $highContrast={highContrast}>
            ← Voltar
          </BackButton>
          <ActivityTitleSection>
            <ActivityMainTitle $highContrast={highContrast}>🎨 Pintura Criativa</ActivityMainTitle>
            <ActivitySubtitle $highContrast={highContrast}>
              Desenvolva sua criatividade e coordenação!
            </ActivitySubtitle>
          </ActivityTitleSection>
        </SimplifiedHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.5 }}
        >
          <InstructionText
            onClick={() => speakInstruction('Vamos pintar! Escolha como você quer começar!')}
          >
            🎨 Vamos pintar! Escolha como você quer começar!
          </InstructionText>
          <DifficultySelector>
            {difficulties.map((diff) => (
              <DifficultyButton
                key={diff.id}
                isActive={difficulty === diff.id}
                onClick={() => {
                  setDifficulty(diff.id)
                  playClick()
                  speak(`Dificuldade ${diff.name} escolhida!`)
                }}
                whileHover={reducedMotion ? {} : { scale: 1.05 }}
                whileTap={reducedMotion ? {} : { scale: 0.95 }}
                themeColor={THEME_COLOR}
              >
                <div style={{ fontSize: '2.5rem' }}>{diff.icon}</div>
                <div>
                  <strong>{diff.name}</strong>
                </div>
                <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>{diff.description}</div>
              </DifficultyButton>
            ))}
          </DifficultySelector>{' '}
          <ActionButton
            onClick={startGame}
            whileHover={reducedMotion ? {} : { scale: 1.05 }}
            whileTap={reducedMotion ? {} : { scale: 0.95 }}
            themeColor={THEME_COLOR}
            style={{ fontSize: '1.5rem', padding: '1rem 1.5rem' }}
          >
            🖌️ Começar a Pintar!
          </ActionButton>
        </motion.div>
      </MainContainer>
    )
  }

  return (
    <MainContainer $highContrast={highContrast}>
      <SimplifiedHeader>
        <BackButton onClick={onBack} $highContrast={highContrast}>
          ← Voltar
        </BackButton>
        <ActivityTitleSection>
          <ActivityMainTitle $highContrast={highContrast}>🎨 Pintura Criativa</ActivityMainTitle>
          <ActivitySubtitle $highContrast={highContrast}>
            Desenvolva sua criatividade e coordenação!
          </ActivitySubtitle>
        </ActivityTitleSection>
      </SimplifiedHeader>

      {!selectedTemplate && (
        <TemplateSelector
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.5 }}
        >
          <h2
            style={{
              fontSize: '1.8rem',
              marginBottom: '1rem',
              color: highContrast ? '#fff' : '#6b48ff',
            }}
          >
            🖼️ O que você quer pintar?
          </h2>
          <TemplateGrid>
            {templates.map((template) => (
              <TemplateCard
                key={template.id}
                onClick={() => selectTemplate(template)}
                whileHover={reducedMotion ? {} : { scale: 1.05 }}
                whileTap={reducedMotion ? {} : { scale: 0.95 }}
                selected={selectedTemplate?.id === template.id}
              >
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{template.emoji}</div>
                <h3 style={{ fontSize: '1rem', color: '#333' }}>{template.name}</h3>
              </TemplateCard>
            ))}
          </TemplateGrid>
        </TemplateSelector>
      )}

      {selectedTemplate && (
        <>
          <ColorPalette
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.5 }}
          >
            <h3
              style={{
                fontSize: '1.5rem',
                textAlign: 'center',
                marginBottom: '0.5rem',
                color: highContrast ? '#fff' : '#6b48ff',
              }}
            >
              🎨 Escolha sua cor:
            </h3>
            <ColorGrid>
              {simpleColors.map((color) => (
                <ColorButton
                  key={color.hex}
                  color={color.hex}
                  selected={selectedColor?.hex === color.hex}
                  onClick={() => selectColor(color)}
                  whileHover={reducedMotion ? {} : { scale: 1.1 }}
                  whileTap={reducedMotion ? {} : { scale: 0.95 }}
                  title={color.name}
                >
                  {color.emoji}
                </ColorButton>
              ))}
            </ColorGrid>
          </ColorPalette>

          <DrawingCanvas
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.5 }}
          >
            {renderInteractiveSVG}
          </DrawingCanvas>

          <ToolBar
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.5 }}
          >
            <ToolButton onClick={() => setBrushSize('small')} disabled={brushSize === 'small'}>
              📏 Fino
            </ToolButton>
            <ToolButton onClick={() => setBrushSize('medium')} disabled={brushSize === 'medium'}>
              📏 Médio
            </ToolButton>
            <ToolButton onClick={() => setBrushSize('large')} disabled={brushSize === 'large'}>
              📏 Grosso
            </ToolButton>
            <ToolButton onClick={clearDrawing}>🧽 Limpar</ToolButton>
            <ToolButton onClick={() => setSelectedTemplate(null)}>🔄 Trocar Desenho</ToolButton>
            <ToolButton onClick={saveArt}>💾 Salvar Arte</ToolButton>
          </ToolBar>
          <BrushSizeIndicator $highContrast={highContrast}>
            Tamanho do Pincel: {brushSize.charAt(0).toUpperCase() + brushSize.slice(1)}
          </BrushSizeIndicator>
        </>
      )}
    </MainContainer>
  )
}

export default CreativePaintingSimple
