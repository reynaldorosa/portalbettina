import React, { Component } from 'react'
import styled from 'styled-components'

// Componente para capturar erros em componentes filhos
// e exibir uma UI de fallback para evitar que todo o app quebre
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error) {
    // Atualiza o estado para que a próxima renderização mostre a UI de fallback
    return { hasError: true, error }
  }
  componentDidCatch(error, errorInfo) {
    // Você também pode registrar o erro em um serviço de relatório de erros
    console.error('Erro capturado por ErrorBoundary:', error, errorInfo)
    this.setState({ errorInfo })

    // Enviar para um serviço de monitoramento de erros (opcional)
    // sendErrorToMonitoringService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })

    // Recarregar a atividade se houver um ID específico
    if (this.props.activityId) {
      try {
        this.props.onReset?.()
      } catch (error) {
        console.error('Erro durante reset:', error)
      }
    }
  }

  handleGoHome = () => {
    // Redefinir estado e chamar o callback de navegação para a página inicial
    this.setState({ hasError: false, error: null, errorInfo: null })
    this.props.onGoHome?.()
  }

  render() {
    if (this.state.hasError) {
      // UI de fallback personalizada
      return (
        <ErrorContainer>
          <ErrorIcon>⚠️</ErrorIcon>
          <ErrorTitle>Ops! Algo inesperado aconteceu</ErrorTitle>

          <ErrorMessage>
            Um erro ocorreu ao carregar {this.props.componentName || 'este componente'}.
          </ErrorMessage>

          <ErrorActions>
            <ErrorButton
              onClick={this.handleReset}
              type="button"
              aria-label="Tentar carregar o componente novamente"
            >
              Tentar novamente
            </ErrorButton>

            <ErrorButton
              secondary
              onClick={this.handleGoHome}
              type="button"
              aria-label="Navegar para a página inicial"
            >
              Voltar ao início
            </ErrorButton>
          </ErrorActions>

          {this.props.showDetails && this.state.error && (
            <ErrorDetails>
              <summary>Detalhes técnicos</summary>
              <p>{this.state.error.toString()}</p>
              <pre>{this.state.errorInfo?.componentStack || ''}</pre>
            </ErrorDetails>
          )}
        </ErrorContainer>
      )
    }

    // Se não houver erro, renderizar os componentes filhos normalmente
    return this.props.children
  }
}

// Estilos para o componente de erro
const ErrorContainer = styled.div`
  background-color: white;
  border-radius: var(--radius-large);
  padding: var(--space-xl);
  margin: var(--space-xl) auto;
  max-width: 600px;
  text-align: center;
  box-shadow: var(--shadow-medium);
  border: 1px solid rgba(220, 53, 69, 0.2);
`

const ErrorIcon = styled.div`
  font-size: 48px;
  margin-bottom: var(--space-md);
`

const ErrorTitle = styled.h2`
  color: var(--error-dark);
  margin-bottom: var(--space-lg);
  font-size: var(--font-size-xl);
`

const ErrorMessage = styled.p`
  color: var(--medium-gray);
  margin-bottom: var(--space-xl);
  font-size: var(--font-size-md);
`

const ErrorActions = styled.div`
  display: flex;
  justify-content: center;
  gap: var(--space-lg);
  margin: var(--space-xl) 0;
`

const ErrorButton = styled.button`
  background-color: ${(props) => (props.secondary ? 'white' : 'var(--primary-blue)')};
  color: ${(props) => (props.secondary ? 'var(--primary-blue)' : 'white')};
  border: ${(props) => (props.secondary ? '1px solid var(--primary-blue)' : 'none')};
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-medium);
  font-size: var(--font-size-md);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${(props) =>
      props.secondary ? 'rgba(74, 144, 226, 0.1)' : 'var(--primary-purple)'};
  }
`

const ErrorDetails = styled.details`
  margin-top: var(--space-xl);
  text-align: left;
  border-top: 1px solid var(--light-gray);
  padding-top: var(--space-md);

  summary {
    cursor: pointer;
    color: var(--medium-gray);
    margin-bottom: var(--space-md);
  }

  pre {
    background-color: var(--light-gray);
    padding: var(--space-md);
    overflow-x: auto;
    border-radius: var(--radius-small);
    font-size: var(--font-size-sm);
    margin-top: var(--space-md);
  }
`

export default ErrorBoundary
