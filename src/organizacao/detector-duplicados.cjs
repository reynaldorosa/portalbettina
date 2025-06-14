/**
 * DETECTOR AVANÇADO DE ARQUIVOS DUPLICADOS - PORTAL BETINA
 * Analisa duplicatas por hash, estrutura de funções e similaridade de código
 *
 * @version 1.0.0
 * @date 2025-06-12
 */

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

// Carregar dados da estrutura inicial
const ESTRUTURA_FILE = path.join(__dirname, 'estrutura_inicial.json')
const OUTPUT_FILE = path.join(__dirname, 'arquivos_duplicados.json')

/**
 * Calcula similaridade entre dois códigos usando algoritmo de Levenshtein
 */
function calculateSimilarity(code1, code2) {
  const len1 = code1.length
  const len2 = code2.length

  if (len1 === 0) return len2 === 0 ? 1 : 0
  if (len2 === 0) return 0

  const matrix = Array(len1 + 1)
    .fill()
    .map(() => Array(len2 + 1).fill(0))

  for (let i = 0; i <= len1; i++) matrix[i][0] = i
  for (let j = 0; j <= len2; j++) matrix[0][j] = j

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = code1[i - 1] === code2[j - 1] ? 0 : 1
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      )
    }
  }

  const distance = matrix[len1][len2]
  const maxLen = Math.max(len1, len2)
  return (maxLen - distance) / maxLen
}

/**
 * Remove comentários e espaços em branco para comparação estrutural
 */
function normalizeCode(code) {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comentários de bloco
    .replace(/\/\/.*$/gm, '') // Remove comentários de linha
    .replace(/\s+/g, ' ') // Normaliza espaços
    .replace(/^\s+|\s+$/g, '') // Remove espaços do início/fim
    .toLowerCase()
}

/**
 * Extrai assinatura estrutural do código (funções, classes, variáveis)
 */
function extractCodeSignature(code) {
  const signature = {
    functions: [],
    classes: [],
    imports: [],
    exports: [],
  }

  try {
    // Extrair funções
    const functions =
      code.match(/(?:function\s+(\w+)|const\s+(\w+)\s*=.*?(?:function|\(.*?\)\s*=>))/g) || []
    signature.functions = functions.map((f) => f.replace(/\s+/g, ' ').trim())

    // Extrair classes
    const classes = code.match(/class\s+(\w+)/g) || []
    signature.classes = classes.map((c) => c.replace(/\s+/g, ' ').trim())

    // Extrair imports
    const imports = code.match(/import\s+.*?from\s+['"`][^'"`]+['"`]/g) || []
    signature.imports = imports.map((i) => i.replace(/\s+/g, ' ').trim())

    // Extrair exports
    const exports = code.match(/export\s+(?:default\s+)?.*?(?:\{[^}]*\}|.*?)$/gm) || []
    signature.exports = exports.map((e) => e.replace(/\s+/g, ' ').trim())
  } catch (error) {
    console.warn('Erro ao extrair assinatura:', error.message)
  }

  return signature
}

/**
 * Compara assinaturas estruturais
 */
function compareSignatures(sig1, sig2) {
  const similarity = {
    functions: 0,
    classes: 0,
    imports: 0,
    exports: 0,
    overall: 0,
  }

  // Comparar funções
  const commonFunctions = sig1.functions.filter((f) => sig2.functions.includes(f))
  similarity.functions =
    commonFunctions.length / Math.max(sig1.functions.length, sig2.functions.length, 1)

  // Comparar classes
  const commonClasses = sig1.classes.filter((c) => sig2.classes.includes(c))
  similarity.classes = commonClasses.length / Math.max(sig1.classes.length, sig2.classes.length, 1)

  // Comparar imports
  const commonImports = sig1.imports.filter((i) => sig2.imports.includes(i))
  similarity.imports = commonImports.length / Math.max(sig1.imports.length, sig2.imports.length, 1)

  // Comparar exports
  const commonExports = sig1.exports.filter((e) => sig2.exports.includes(e))
  similarity.exports = commonExports.length / Math.max(sig1.exports.length, sig2.exports.length, 1)

  // Calcular similaridade geral
  similarity.overall =
    (similarity.functions + similarity.classes + similarity.imports + similarity.exports) / 4

  return similarity
}

/**
 * Analisa um arquivo para duplicação
 */
function analyzeFileForDuplication(file) {
  const analysis = {
    path: file.path,
    hash: file.hash,
    size: file.size,
    lineCount: file.lineCount,
    signature: null,
    normalizedCode: null,
    structuralHash: null,
  }

  try {
    if (file.extension && ['.js', '.jsx', '.ts', '.tsx'].includes(file.extension)) {
      const content = fs.readFileSync(file.fullPath, 'utf8')
      analysis.normalizedCode = normalizeCode(content)
      analysis.signature = extractCodeSignature(content)
      analysis.structuralHash = crypto
        .createHash('md5')
        .update(analysis.normalizedCode)
        .digest('hex')
    }
  } catch (error) {
    console.warn(`Erro ao analisar ${file.path}:`, error.message)
  }

  return analysis
}

/**
 * Detecta grupos de arquivos duplicados
 */
function detectDuplicateGroups(files) {
  const groups = {
    exactDuplicates: new Map(), // Mesmo hash
    structuralDuplicates: new Map(), // Mesma estrutura, conteúdo diferente
    similarFiles: [], // Arquivos similares (>80% similaridade)
    potentialDuplicates: [], // Possíveis duplicatas para revisão manual
  }

  const analyses = files.map(analyzeFileForDuplication)

  // Detectar duplicatas exatas (mesmo hash)
  analyses.forEach((analysis) => {
    if (analysis.hash) {
      if (!groups.exactDuplicates.has(analysis.hash)) {
        groups.exactDuplicates.set(analysis.hash, [])
      }
      groups.exactDuplicates.get(analysis.hash).push(analysis)
    }
  })

  // Detectar duplicatas estruturais
  analyses.forEach((analysis) => {
    if (analysis.structuralHash) {
      if (!groups.structuralDuplicates.has(analysis.structuralHash)) {
        groups.structuralDuplicates.set(analysis.structuralHash, [])
      }
      groups.structuralDuplicates.get(analysis.structuralHash).push(analysis)
    }
  })

  // Detectar arquivos similares
  for (let i = 0; i < analyses.length; i++) {
    for (let j = i + 1; j < analyses.length; j++) {
      const file1 = analyses[i]
      const file2 = analyses[j]

      if (
        file1.normalizedCode &&
        file2.normalizedCode &&
        file1.hash !== file2.hash &&
        file1.structuralHash !== file2.structuralHash
      ) {
        // Comparar similaridade de código
        const codeSimilarity = calculateSimilarity(file1.normalizedCode, file2.normalizedCode)

        // Comparar assinaturas estruturais
        const structuralSimilarity =
          file1.signature && file2.signature
            ? compareSignatures(file1.signature, file2.signature)
            : null

        if (codeSimilarity > 0.8 || (structuralSimilarity && structuralSimilarity.overall > 0.7)) {
          groups.similarFiles.push({
            files: [file1.path, file2.path],
            codeSimilarity,
            structuralSimilarity,
            sizes: [file1.size, file2.size],
            recommendation: codeSimilarity > 0.95 ? 'merger_candidate' : 'review_required',
          })
        } else if (
          codeSimilarity > 0.6 ||
          (structuralSimilarity && structuralSimilarity.overall > 0.5)
        ) {
          groups.potentialDuplicates.push({
            files: [file1.path, file2.path],
            codeSimilarity,
            structuralSimilarity,
            sizes: [file1.size, file2.size],
            reason: 'moderate_similarity',
          })
        }
      }
    }
  }

  return groups
}

/**
 * Gera recomendações de ação
 */
function generateRecommendations(groups) {
  const recommendations = {
    critical: [], // Ações críticas
    important: [], // Ações importantes
    optional: [], // Ações opcionais
    summary: {},
  }

  // Duplicatas exatas
  for (const [hash, files] of groups.exactDuplicates) {
    if (files.length > 1) {
      const totalSize = files.reduce((sum, f) => sum + f.size, 0)
      const wastedSpace = totalSize - files[0].size

      recommendations.critical.push({
        type: 'exact_duplicate',
        action: 'remove_duplicates',
        priority: 'high',
        files: files.map((f) => f.path),
        wastedSpace,
        suggestion: `Manter: ${files[0].path}, Remover: ${files
          .slice(1)
          .map((f) => f.path)
          .join(', ')}`,
      })
    }
  }

  // Duplicatas estruturais
  for (const [structHash, files] of groups.structuralDuplicates) {
    if (files.length > 1 && !groups.exactDuplicates.has(files[0].hash)) {
      recommendations.important.push({
        type: 'structural_duplicate',
        action: 'merge_or_deduplicate',
        priority: 'medium',
        files: files.map((f) => f.path),
        suggestion: 'Revisar e considerar merge ou padronização',
      })
    }
  }

  // Arquivos similares
  groups.similarFiles.forEach((similar) => {
    recommendations.important.push({
      type: 'similar_files',
      action: similar.recommendation,
      priority: similar.codeSimilarity > 0.9 ? 'medium' : 'low',
      files: similar.files,
      similarity: similar.codeSimilarity,
      suggestion:
        similar.codeSimilarity > 0.9
          ? 'Candidato forte para merge'
          : 'Revisar para possível refatoração',
    })
  })

  // Gerar resumo
  recommendations.summary = {
    exactDuplicates: Array.from(groups.exactDuplicates.values()).filter((g) => g.length > 1).length,
    structuralDuplicates: Array.from(groups.structuralDuplicates.values()).filter(
      (g) => g.length > 1
    ).length,
    similarFiles: groups.similarFiles.length,
    potentialDuplicates: groups.potentialDuplicates.length,
    totalWastedSpace: recommendations.critical
      .filter((r) => r.type === 'exact_duplicate')
      .reduce((sum, r) => sum + (r.wastedSpace || 0), 0),
  }

  return recommendations
}

/**
 * Função principal
 */
async function detectDuplicates() {
  console.log('🔍 Iniciando detecção avançada de arquivos duplicados...')

  // Carregar dados da estrutura
  if (!fs.existsSync(ESTRUTURA_FILE)) {
    console.error('❌ Arquivo estrutura_inicial.json não encontrado!')
    console.log('Execute primeiro o mapeamento-estrutural.cjs')
    return
  }

  const estrutura = JSON.parse(fs.readFileSync(ESTRUTURA_FILE, 'utf8'))
  console.log(`📊 Analisando ${estrutura.files.length} arquivos...`)

  // Detectar grupos duplicados
  console.log('🔍 Detectando duplicatas exatas...')
  console.log('🔍 Analisando similaridade estrutural...')
  console.log('🔍 Comparando códigos similares...')

  const groups = detectDuplicateGroups(estrutura.files)

  // Gerar recomendações
  console.log('📋 Gerando recomendações...')
  const recommendations = generateRecommendations(groups)

  // Criar relatório final
  const report = {
    metadata: {
      generatedAt: new Date().toISOString(),
      analyzedFiles: estrutura.files.length,
      analysisType: 'advanced_duplicate_detection',
      version: '1.0.0',
    },
    summary: recommendations.summary,
    duplicateGroups: {
      exactDuplicates: Array.from(groups.exactDuplicates.entries())
        .filter(([hash, files]) => files.length > 1)
        .map(([hash, files]) => ({
          hash,
          count: files.length,
          files: files.map((f) => f.path),
          totalSize: files.reduce((sum, f) => sum + f.size, 0),
          wastedSpace: files.reduce((sum, f) => sum + f.size, 0) - files[0].size,
        })),
      structuralDuplicates: Array.from(groups.structuralDuplicates.entries())
        .filter(([hash, files]) => files.length > 1)
        .map(([hash, files]) => ({
          structuralHash: hash,
          count: files.length,
          files: files.map((f) => f.path),
          averageSize: files.reduce((sum, f) => sum + f.size, 0) / files.length,
        })),
      similarFiles: groups.similarFiles,
      potentialDuplicates: groups.potentialDuplicates,
    },
    recommendations,
  }

  // Salvar relatório
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(report, null, 2), 'utf8')

  // Exibir resultados
  console.log('\n📊 RESULTADOS DA ANÁLISE:')
  console.log(`   └─ Duplicatas exatas: ${recommendations.summary.exactDuplicates} grupos`)
  console.log(
    `   └─ Duplicatas estruturais: ${recommendations.summary.structuralDuplicates} grupos`
  )
  console.log(`   └─ Arquivos similares: ${recommendations.summary.similarFiles} pares`)
  console.log(`   └─ Potenciais duplicatas: ${recommendations.summary.potentialDuplicates} pares`)

  if (recommendations.summary.totalWastedSpace > 0) {
    console.log(
      `   └─ Espaço desperdiçado: ${(recommendations.summary.totalWastedSpace / 1024).toFixed(2)} KB`
    )
  }

  console.log(`\n💾 Relatório salvo em: ${OUTPUT_FILE}`)
  console.log('\n🎯 PRÓXIMAS AÇÕES:')

  if (recommendations.critical.length > 0) {
    console.log(`   ⚠️  ${recommendations.critical.length} ações críticas identificadas`)
  }
  if (recommendations.important.length > 0) {
    console.log(`   📋 ${recommendations.important.length} ações importantes sugeridas`)
  }

  return report
}

// Executar se chamado diretamente
if (require.main === module) {
  detectDuplicates().catch(console.error)
}

module.exports = detectDuplicates
