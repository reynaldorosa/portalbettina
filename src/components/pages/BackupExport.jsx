import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useUser } from '../../contexts/UserContext'
import databaseService from '../../database/core/DatabaseService.js'

// Estilos
const BackupContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: var(--space-xl);
  background: white;
  border-radius: var(--radius-large);
  box-shadow: var(--shadow-medium);
`

const SectionTitle = styled.h2`
  font-size: var(--font-size-xl);
  color: var(--primary-purple);
  margin-bottom: var(--space-md);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  border-bottom: 1px solid var(--light-gray);
  padding-bottom: var(--space-md);
`

const Card = styled(motion.div)`
  background: var(--bg-panel);
  border-radius: var(--radius-medium);
  padding: var(--space-lg);
  margin-bottom: var(--space-lg);
  box-shadow: var(--shadow-small);
`

const CardTitle = styled.h3`
  font-size: var(--font-size-lg);
  color: var(--primary-blue);
  margin-bottom: var(--space-md);
`

const CardDescription = styled.p`
  margin-bottom: var(--space-lg);
  color: var(--text-secondary);
`

const Button = styled(motion.button)`
  background: ${(props) => (props.secondary ? 'var(--light-gray)' : 'var(--primary-blue)')};
  color: ${(props) => (props.secondary ? 'var(--text-primary)' : 'white')};
  border: none;
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-medium);
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  margin-right: var(--space-md);
  margin-bottom: var(--space-md);

  &:hover {
    background: ${(props) => (props.secondary ? 'var(--medium-gray)' : 'var(--primary-purple)')};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const FileInput = styled.input`
  display: none;
`

const FileLabel = styled.label`
  background: var(--primary-green);
  color: white;
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-medium);
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);

  &:hover {
    background: var(--primary-blue);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const Alert = styled.div`
  background: ${(props) =>
    props.type === 'success'
      ? 'var(--primary-green-light)'
      : props.type === 'error'
        ? 'var(--primary-red-light)'
        : 'var(--primary-blue-light)'};
  color: ${(props) =>
    props.type === 'success'
      ? 'var(--primary-green)'
      : props.type === 'error'
        ? 'var(--primary-red)'
        : 'var(--primary-blue)'};
  border: 1px solid
    ${(props) =>
      props.type === 'success'
        ? 'var(--primary-green)'
        : props.type === 'error'
          ? 'var(--primary-red)'
          : 'var(--primary-blue)'};
  padding: var(--space-md);
  border-radius: var(--radius-medium);
  margin-bottom: var(--space-lg);
  margin-top: var(--space-md);
`

const DataPreview = styled.pre`
  background: var(--light-gray);
  border-radius: var(--radius-medium);
  padding: var(--space-md);
  max-height: 200px;
  overflow-y: auto;
  font-size: 12px;
  margin-bottom: var(--space-md);

  code {
    white-space: pre-wrap;
  }
`

const CheckboxContainer = styled.div`
  margin-bottom: var(--space-md);
`

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-sm);
  cursor: pointer;
`

const Checkbox = styled.input`
  cursor: pointer;
  width: 18px;
  height: 18px;
`

const BackupExport = () => {
  const { userId, isDbConnected, userDetails } = useUser()
  const [backupData, setBackupData] = useState(null)
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [alert, setAlert] = useState(null)
  const [importFile, setImportFile] = useState(null)
  const [importPreview, setImportPreview] = useState(null)
  const [exportOptions, setExportOptions] = useState({
    userProfiles: true,
    gameProgress: true,
    accessibilitySettings: true,
    preferences: true,
  })

  // Limpar alertas após um tempo
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [alert])

  // Função para gerar o backup dos dados
  const generateBackup = async () => {
    if (!userId) {
      setAlert({
        type: 'error',
        message: 'Erro: Não foi possível identificar o usuário.',
      })
      return
    }

    setIsExporting(true)

    try {
      let backupData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        data: {},
      }

      // Definir quais dados serão incluídos no backup
      if (isDbConnected) {
        // Backup a partir do banco de dados
        if (exportOptions.userProfiles) {
          const users = await databaseService.getAllUsers()
          backupData.data.users = users
        }

        if (exportOptions.gameProgress) {
          const sessions = await databaseService.getAllGameSessions(userId)
          backupData.data.gameSessions = sessions
        }

        if (exportOptions.accessibilitySettings && userDetails?.preferences?.accessibility) {
          backupData.data.accessibilitySettings = userDetails.preferences.accessibility
        }

        if (exportOptions.preferences && userDetails?.preferences) {
          backupData.data.preferences = userDetails.preferences
        }
      } else {
        // Backup a partir do localStorage
        if (exportOptions.userProfiles) {
          backupData.data.userId = userId
        }

        if (exportOptions.gameProgress) {
          const localStorageData = {}
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)
            if (key.startsWith('betina_') && key.includes('_history')) {
              try {
                localStorageData[key] = JSON.parse(localStorage.getItem(key))
              } catch (e) {
                localStorageData[key] = localStorage.getItem(key)
              }
            }
          }
          backupData.data.localStorage = localStorageData
        }

        if (exportOptions.accessibilitySettings) {
          const accessSettings = localStorage.getItem('betina_accessibility_settings')
          if (accessSettings) {
            try {
              backupData.data.accessibilitySettings = JSON.parse(accessSettings)
            } catch (e) {
              backupData.data.accessibilitySettings = accessSettings
            }
          }
        }

        if (exportOptions.preferences) {
          const prefs = localStorage.getItem('betina_user_preferences')
          if (prefs) {
            try {
              backupData.data.preferences = JSON.parse(prefs)
            } catch (e) {
              backupData.data.preferences = prefs
            }
          }
        }
      }

      setBackupData(backupData)
      setAlert({
        type: 'success',
        message: 'Backup gerado com sucesso! Agora você pode fazer o download.',
      })
    } catch (error) {
      console.error('Erro ao gerar backup:', error)
      setAlert({
        type: 'error',
        message: 'Erro ao gerar backup: ' + error.message,
      })
    } finally {
      setIsExporting(false)
    }
  }

  // Função para baixar o backup
  const downloadBackup = () => {
    if (!backupData) return

    try {
      // Criar blob com os dados
      const dataStr = JSON.stringify(backupData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })

      // Criar link para download
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url

      // Nome do arquivo com data atual
      const date = new Date()
      const dateStr = date.toISOString().split('T')[0]
      link.download = `portal-betina-backup-${dateStr}.json`

      // Simular clique e limpar
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setAlert({
        type: 'success',
        message: 'Arquivo de backup baixado com sucesso!',
      })
    } catch (error) {
      console.error('Erro ao baixar backup:', error)
      setAlert({
        type: 'error',
        message: 'Erro ao baixar arquivo de backup: ' + error.message,
      })
    }
  }

  // Função para lidar com a seleção de arquivo para importação
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setImportFile(file)

    // Ler o conteúdo do arquivo
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result)
        setImportPreview(data)
      } catch (error) {
        console.error('Erro ao ler arquivo:', error)
        setAlert({
          type: 'error',
          message: 'Erro ao ler arquivo de backup. O arquivo parece estar corrompido.',
        })
        setImportFile(null)
        setImportPreview(null)
      }
    }
    reader.readAsText(file)
  }

  // Função para importar dados do arquivo
  const importBackup = async () => {
    if (!importPreview || !userId) return

    setIsImporting(true)
    try {
      // Verificar a versão do backup
      if (!importPreview.version) {
        throw new Error('Formato de backup inválido ou não reconhecido')
      }

      // Importar dados para o banco de dados ou localStorage
      if (isDbConnected) {
        // Importar para o banco de dados
        if (importPreview.data.preferences) {
          await databaseService.updateUserPreferences(userId, importPreview.data.preferences)
        }

        if (importPreview.data.gameSessions) {
          // Aqui seria necessária uma função específica para importar sessões
          // Esta é uma implementação simplificada
          for (const session of importPreview.data.gameSessions) {
            await databaseService.saveGameSession({
              ...session,
              user_id: userId, // Garantir que as sessões importadas estão associadas ao usuário atual
            })
          }
        }
      } else {
        // Importar para o localStorage
        if (importPreview.data.localStorage) {
          Object.entries(importPreview.data.localStorage).forEach(([key, value]) => {
            localStorage.setItem(key, JSON.stringify(value))
          })
        }

        if (importPreview.data.accessibilitySettings) {
          localStorage.setItem(
            'betina_accessibility_settings',
            JSON.stringify(importPreview.data.accessibilitySettings)
          )
        }

        if (importPreview.data.preferences) {
          localStorage.setItem(
            'betina_user_preferences',
            JSON.stringify(importPreview.data.preferences)
          )
        }
      }

      setAlert({
        type: 'success',
        message: 'Dados importados com sucesso! Pode ser necessário recarregar a página.',
      })

      // Limpar os campos após importação bem-sucedida
      setImportFile(null)
      setImportPreview(null)
    } catch (error) {
      console.error('Erro ao importar dados:', error)
      setAlert({
        type: 'error',
        message: 'Erro ao importar dados: ' + error.message,
      })
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <BackupContainer>
      <SectionTitle>
        <span role="img" aria-label="backup">
          💾
        </span>{' '}
        Backup e Exportação de Dados
      </SectionTitle>

      {alert && <Alert type={alert.type}>{alert.message}</Alert>}

      <Card
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <CardTitle>Exportar Dados</CardTitle>
        <CardDescription>
          Crie um backup de seus dados para manter seus progressos seguros ou transferir para outro
          dispositivo.
        </CardDescription>

        <CheckboxContainer>
          <CheckboxLabel>
            <Checkbox
              type="checkbox"
              checked={exportOptions.userProfiles}
              onChange={(e) =>
                setExportOptions({ ...exportOptions, userProfiles: e.target.checked })
              }
            />
            Perfis de Usuário
          </CheckboxLabel>

          <CheckboxLabel>
            <Checkbox
              type="checkbox"
              checked={exportOptions.gameProgress}
              onChange={(e) =>
                setExportOptions({ ...exportOptions, gameProgress: e.target.checked })
              }
            />
            Progresso dos Jogos
          </CheckboxLabel>

          <CheckboxLabel>
            <Checkbox
              type="checkbox"
              checked={exportOptions.accessibilitySettings}
              onChange={(e) =>
                setExportOptions({ ...exportOptions, accessibilitySettings: e.target.checked })
              }
            />
            Configurações de Acessibilidade
          </CheckboxLabel>

          <CheckboxLabel>
            <Checkbox
              type="checkbox"
              checked={exportOptions.preferences}
              onChange={(e) =>
                setExportOptions({ ...exportOptions, preferences: e.target.checked })
              }
            />
            Preferências Gerais
          </CheckboxLabel>
        </CheckboxContainer>

        <Button
          onClick={generateBackup}
          disabled={isExporting}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isExporting ? 'Gerando...' : 'Gerar Backup'}
        </Button>

        {backupData && (
          <>
            <DataPreview>
              <code>
                {JSON.stringify(backupData, null, 2).substring(0, 500)}
                {JSON.stringify(backupData, null, 2).length > 500 ? '...' : ''}
              </code>
            </DataPreview>

            <Button
              onClick={downloadBackup}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span role="img" aria-hidden="true">
                ⬇️
              </span>{' '}
              Baixar Arquivo de Backup
            </Button>
          </>
        )}
      </Card>

      <Card
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <CardTitle>Importar Dados</CardTitle>
        <CardDescription>
          Restaure seus dados a partir de um arquivo de backup criado anteriormente.
        </CardDescription>

        <FileLabel htmlFor="backup-file">
          <span role="img" aria-hidden="true">
            📂
          </span>{' '}
          Selecionar Arquivo de Backup
          <FileInput type="file" id="backup-file" accept=".json" onChange={handleFileChange} />
        </FileLabel>

        {importFile && <p>Arquivo selecionado: {importFile.name}</p>}

        {importPreview && (
          <>
            <DataPreview>
              <code>
                {JSON.stringify(importPreview, null, 2).substring(0, 500)}
                {JSON.stringify(importPreview, null, 2).length > 500 ? '...' : ''}
              </code>
            </DataPreview>

            <Button
              onClick={importBackup}
              disabled={isImporting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isImporting ? 'Importando...' : 'Importar Dados'}
            </Button>

            <Button
              secondary
              onClick={() => {
                setImportFile(null)
                setImportPreview(null)
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancelar
            </Button>
          </>
        )}
      </Card>

      <Card
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <CardTitle>Sincronização Automática</CardTitle>
        <CardDescription>
          {isDbConnected
            ? 'Seus dados são sincronizados automaticamente no banco de dados PostgreSQL quando você está conectado.'
            : 'Conecte-se ao banco de dados para habilitar a sincronização automática dos seus dados.'}
        </CardDescription>

        <Alert type="info">
          <p>
            <strong>Status da Sincronização</strong>: {isDbConnected ? 'Ativada' : 'Desativada'}
          </p>
          <p>
            {isDbConnected
              ? 'Seus dados estão sendo salvos automaticamente no banco de dados.'
              : 'No modo offline, seus dados são armazenados apenas localmente neste dispositivo.'}
          </p>
        </Alert>
      </Card>
    </BackupContainer>
  )
}

export default BackupExport
