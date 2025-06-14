/**
 * DETECTOR SIMPLIFICADO DE DUPLICADOS - PORTAL BETINA
 * Detecta arquivos duplicados por hash e estrutura
 */

const fs = require('fs')
const path = require('path')

console.log('🔍 Iniciando detecção de duplicados...')

try {
  // Carregar dados da estrutura
  const estruturaPath = path.join(__dirname, 'estrutura_inicial.json')
  const estrutura = JSON.parse(fs.readFileSync(estruturaPath, 'utf8'))

  console.log(`📊 Analisando ${estrutura.files.length} arquivos...`)

  // Agrupar por hash
  const hashGroups = new Map()
  const sizeGroups = new Map()

  estrutura.files.forEach((file) => {
    if (file.hash) {
      if (!hashGroups.has(file.hash)) {
        hashGroups.set(file.hash, [])
      }
      hashGroups.get(file.hash).push(file)
    }

    // Agrupar por tamanho também
    if (!sizeGroups.has(file.size)) {
      sizeGroups.set(file.size, [])
    }
    sizeGroups.get(file.size).push(file)
  })

  // Encontrar duplicatas exatas
  const exactDuplicates = []
  for (const [hash, files] of hashGroups) {
    if (files.length > 1) {
      exactDuplicates.push({
        hash,
        count: files.length,
        files: files.map((f) => f.path),
        size: files[0].size,
        wastedSpace: (files.length - 1) * files[0].size,
      })
    }
  }

  // Encontrar arquivos do mesmo tamanho (potenciais duplicados)
  const potentialDuplicates = []
  for (const [size, files] of sizeGroups) {
    if (files.length > 1 && size > 1000) {
      // Apenas arquivos > 1KB
      const uniqueHashes = new Set(files.map((f) => f.hash))
      if (uniqueHashes.size > 1) {
        // Mesmo tamanho, hash diferente
        potentialDuplicates.push({
          size,
          count: files.length,
          files: files.map((f) => ({ path: f.path, hash: f.hash })),
        })
      }
    }
  }

  // Criar relatório
  const report = {
    metadata: {
      generatedAt: new Date().toISOString(),
      totalFiles: estrutura.files.length,
      analysisType: 'duplicate_detection',
    },
    summary: {
      exactDuplicates: exactDuplicates.length,
      potentialDuplicates: potentialDuplicates.length,
      totalWastedSpace: exactDuplicates.reduce((sum, dup) => sum + dup.wastedSpace, 0),
    },
    exactDuplicates,
    potentialDuplicates: potentialDuplicates.slice(0, 20), // Limitar a 20 para não sobrecarregar
  }

  // Salvar relatório
  const outputPath = path.join(__dirname, 'arquivos_duplicados.json')
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2), 'utf8')

  // Mostrar resultados
  console.log('\n📊 RESULTADOS:')
  console.log(`   └─ Duplicatas exatas: ${report.summary.exactDuplicates} grupos`)
  console.log(`   └─ Potenciais duplicados: ${report.summary.potentialDuplicates} grupos`)
  console.log(
    `   └─ Espaço desperdiçado: ${(report.summary.totalWastedSpace / 1024).toFixed(2)} KB`
  )

  if (exactDuplicates.length > 0) {
    console.log('\n🔍 DUPLICATAS EXATAS ENCONTRADAS:')
    exactDuplicates.slice(0, 5).forEach((dup, i) => {
      console.log(`   ${i + 1}. ${dup.files[0]} (${dup.count} cópias)`)
      dup.files.slice(1).forEach((file) => {
        console.log(`      └─ ${file}`)
      })
    })
  }

  console.log(`\n💾 Relatório completo salvo em: arquivos_duplicados.json`)
} catch (error) {
  console.error('❌ Erro:', error.message)
}
