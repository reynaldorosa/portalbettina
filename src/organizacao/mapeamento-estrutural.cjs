/**
 * MAPEAMENTO ESTRUTURAL INICIAL - PORTAL BETINA
 * Script para gerar análise completa da estrutura do projeto
 *
 * @version 1.0.0
 * @date 2025-06-11
 */

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

// Configurações
const PROJECT_ROOT = path.resolve(__dirname, '../..')
const OUTPUT_FILE = path.join(__dirname, 'estrutura_inicial.json')
const EXTENSIONS_TO_ANALYZE = ['.js', '.jsx', '.ts', '.tsx', '.json', '.md']
const FOLDERS_TO_MAP = ['src', 'public', 'documentação', 'tests', 'sql']

/**
 * Calcula hash MD5 do conteúdo de um arquivo
 */
function calculateFileHash(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    return crypto.createHash('md5').update(content).digest('hex')
  } catch (error) {
    return null
  }
}

/**
 * Extrai funções exportadas de arquivos JS/JSX/TS/TSX
 */
function extractExportedFunctions(filePath, content) {
  const functions = []
  const classes = []
  const variables = []

  try {
    // Exportações nomeadas: export function, export class, export const
    const namedExports = content.match(/export\s+(function|class|const|let|var)\s+(\w+)/g) || []
    namedExports.forEach((match) => {
      const [, type, name] = match.match(/export\s+(function|class|const|let|var)\s+(\w+)/)
      if (type === 'function') functions.push(name)
      else if (type === 'class') classes.push(name)
      else variables.push(name)
    })

    // Exportação default
    const defaultExport = content.match(/export\s+default\s+(\w+|function\s*\w*|class\s+\w+)/g)
    if (defaultExport) {
      const match = defaultExport[0].match(
        /export\s+default\s+(function\s*(\w*)|class\s+(\w+)|(\w+))/
      )
      if (match) {
        const name = match[2] || match[3] || match[4] || 'default'
        if (match[0].includes('function')) functions.push(`default(${name})`)
        else if (match[0].includes('class')) classes.push(`default(${name})`)
        else variables.push(`default(${name})`)
      }
    }

    // Exportações em bloco: export { ... }
    const blockExports = content.match(/export\s*\{[^}]+\}/g) || []
    blockExports.forEach((block) => {
      const names = block.match(/(\w+)(?:\s+as\s+\w+)?/g) || []
      names.forEach((name) => {
        const cleanName = name.replace(/\s+as\s+\w+/, '').trim()
        if (cleanName !== 'export' && cleanName !== '{' && cleanName !== '}') {
          variables.push(cleanName)
        }
      })
    })
  } catch (error) {
    console.warn(`Erro ao extrair funções de ${filePath}:`, error.message)
  }

  return { functions, classes, variables }
}

/**
 * Extrai dependências/importações de um arquivo
 */
function extractDependencies(content) {
  const dependencies = []

  try {
    // Import statements
    const imports = content.match(/import\s+.*?\s+from\s+['"`]([^'"`]+)['"`]/g) || []
    imports.forEach((imp) => {
      const match = imp.match(/from\s+['"`]([^'"`]+)['"`]/)
      if (match) dependencies.push(match[1])
    })

    // Require statements
    const requires = content.match(/require\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g) || []
    requires.forEach((req) => {
      const match = req.match(/['"`]([^'"`]+)['"`]/)
      if (match) dependencies.push(match[1])
    })

    // Dynamic imports
    const dynamicImports = content.match(/import\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g) || []
    dynamicImports.forEach((imp) => {
      const match = imp.match(/['"`]([^'"`]+)['"`]/)
      if (match) dependencies.push(match[1])
    })
  } catch (error) {
    console.warn('Erro ao extrair dependências:', error.message)
  }

  return [...new Set(dependencies)] // Remove duplicatas
}

/**
 * Analisa um arquivo individual
 */
function analyzeFile(filePath) {
  const stats = fs.statSync(filePath)
  const extension = path.extname(filePath)
  const relativePath = path.relative(PROJECT_ROOT, filePath)

  let content = ''
  let hash = null
  let exports = { functions: [], classes: [], variables: [] }
  let dependencies = []

  try {
    if (stats.size < 1024 * 1024) {
      // Apenas arquivos < 1MB
      content = fs.readFileSync(filePath, 'utf8')
      hash = calculateFileHash(filePath)

      if (['.js', '.jsx', '.ts', '.tsx'].includes(extension)) {
        exports = extractExportedFunctions(filePath, content)
        dependencies = extractDependencies(content)
      }
    }
  } catch (error) {
    console.warn(`Erro ao analisar ${filePath}:`, error.message)
  }

  return {
    path: relativePath.replace(/\\/g, '/'), // Normalizar separadores
    fullPath: filePath,
    name: path.basename(filePath),
    extension,
    size: stats.size,
    hash,
    lastModified: stats.mtime.toISOString(),
    exports,
    dependencies,
    lineCount: content ? content.split('\n').length : 0,
  }
}

/**
 * Percorre recursivamente uma pasta
 */
function scanDirectory(dirPath, results = []) {
  try {
    const items = fs.readdirSync(dirPath)

    for (const item of items) {
      const fullPath = path.join(dirPath, item)
      const stats = fs.statSync(fullPath)

      if (stats.isDirectory()) {
        // Pular certas pastas
        if (['node_modules', '.git', 'dist', 'build', '.vscode'].includes(item)) {
          continue
        }
        scanDirectory(fullPath, results)
      } else if (stats.isFile()) {
        const extension = path.extname(item)
        if (EXTENSIONS_TO_ANALYZE.includes(extension)) {
          results.push(analyzeFile(fullPath))
        }
      }
    }
  } catch (error) {
    console.warn(`Erro ao escanear diretório ${dirPath}:`, error.message)
  }

  return results
}

/**
 * Detecta arquivos duplicados baseado no hash
 */
function findDuplicates(files) {
  const hashMap = new Map()
  const duplicates = []

  files.forEach((file) => {
    if (file.hash) {
      if (hashMap.has(file.hash)) {
        const existing = hashMap.get(file.hash)
        duplicates.push({
          hash: file.hash,
          files: [existing.path, file.path],
          size: file.size,
        })
      } else {
        hashMap.set(file.hash, file)
      }
    }
  })

  return duplicates
}

/**
 * Gera estatísticas do projeto
 */
function generateStatistics(files) {
  const stats = {
    totalFiles: files.length,
    totalSize: files.reduce((sum, f) => sum + f.size, 0),
    totalLines: files.reduce((sum, f) => sum + f.lineCount, 0),
    filesByExtension: {},
    folderStructure: {},
    largestFiles: files.sort((a, b) => b.size - a.size).slice(0, 10),
    mostComplexFiles: files.sort((a, b) => b.lineCount - a.lineCount).slice(0, 10),
  }

  // Estatísticas por extensão
  files.forEach((file) => {
    const ext = file.extension || 'sem extensão'
    if (!stats.filesByExtension[ext]) {
      stats.filesByExtension[ext] = { count: 0, totalSize: 0, totalLines: 0 }
    }
    stats.filesByExtension[ext].count++
    stats.filesByExtension[ext].totalSize += file.size
    stats.filesByExtension[ext].totalLines += file.lineCount
  })

  // Estrutura de pastas
  files.forEach((file) => {
    const folders = file.path.split('/')
    folders.pop() // Remove o nome do arquivo

    let current = stats.folderStructure
    folders.forEach((folder) => {
      if (!current[folder]) {
        current[folder] = { files: 0, subfolders: {} }
      }
      current[folder].files++
      current = current[folder].subfolders
    })
  })

  return stats
}

/**
 * Função principal
 */
async function main() {
  console.log('🔍 Iniciando mapeamento estrutural do Portal Betina...')
  console.log(`📂 Raiz do projeto: ${PROJECT_ROOT}`)

  const allFiles = []

  // Escanear cada pasta configurada
  for (const folder of FOLDERS_TO_MAP) {
    const folderPath = path.join(PROJECT_ROOT, folder)
    if (fs.existsSync(folderPath)) {
      console.log(`📁 Escaneando pasta: ${folder}`)
      const files = scanDirectory(folderPath)
      allFiles.push(...files)
      console.log(`   └─ ${files.length} arquivos encontrados`)
    } else {
      console.log(`⚠️  Pasta não encontrada: ${folder}`)
    }
  }

  console.log(`\n📊 Total de arquivos analisados: ${allFiles.length}`)

  // Detectar duplicatas
  console.log('🔍 Detectando arquivos duplicados...')
  const duplicates = findDuplicates(allFiles)
  console.log(`   └─ ${duplicates.length} grupos de arquivos duplicados encontrados`)

  // Gerar estatísticas
  console.log('📈 Gerando estatísticas...')
  const statistics = generateStatistics(allFiles)

  // Criar estrutura final
  const result = {
    metadata: {
      generatedAt: new Date().toISOString(),
      projectRoot: PROJECT_ROOT,
      version: '1.0.0',
      generator: 'Portal Betina Structural Mapper',
    },
    statistics,
    duplicates,
    files: allFiles,
  }

  // Salvar resultado
  console.log(`💾 Salvando resultado em: ${OUTPUT_FILE}`)
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2), 'utf8')

  console.log('\n✅ Mapeamento estrutural concluído!')
  console.log(`📄 Arquivo gerado: estrutura_inicial.json`)
  console.log(`📊 Estatísticas:`)
  console.log(`   └─ Arquivos: ${statistics.totalFiles}`)
  console.log(`   └─ Tamanho total: ${(statistics.totalSize / 1024 / 1024).toFixed(2)} MB`)
  console.log(`   └─ Linhas de código: ${statistics.totalLines.toLocaleString()}`)
  console.log(`   └─ Duplicatas: ${duplicates.length} grupos`)

  return result
}

// Executar se chamado diretamente
if (require.main === module) {
  main().catch(console.error)
}

module.exports = main
