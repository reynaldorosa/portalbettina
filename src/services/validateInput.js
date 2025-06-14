// Middleware de validação para entradas de API
// Este middleware usa a abordagem de esquema de validação para verificar
// entradas do usuário antes de processá-las

/**
 * Middleware para validar input do usuário baseado em esquemas de validação
 * @param {Object} schema - Esquema de validação
 * @returns {Function} Middleware Express
 */
export const validateInput = (schema) => {
  return (req, res, next) => {
    try {
      // Se não há schema, apenas segue para o próximo middleware
      if (!schema) {
        return next()
      }

      const data = req.body
      const validationResult = validateSchema(data, schema)

      if (validationResult.valid) {
        // Dados são válidos, continuar
        return next()
      } else {
        // Dados inválidos, retornar erro 400
        return res.status(400).json({
          error: 'Dados inválidos',
          details: validationResult.errors,
        })
      }
    } catch (err) {
      console.error('Erro na validação:', err)
      return res.status(500).json({ error: 'Erro interno no servidor' })
    }
  }
}

/**
 * Função para validar dado contra um esquema
 * @param {Object} data - Dados a serem validados
 * @param {Object} schema - Esquema de validação
 * @returns {Object} Resultado da validação
 */
function validateSchema(data, schema) {
  const result = {
    valid: true,
    errors: [],
  }

  // Para cada propriedade no schema
  Object.keys(schema).forEach((key) => {
    const rules = schema[key]
    const value = data[key]

    // Verificar se campo obrigatório está presente
    if (rules.required && (value === undefined || value === null)) {
      result.valid = false
      result.errors.push(`Campo '${key}' é obrigatório`)
      return
    }

    // Se o valor está presente, validar contra regras
    if (value !== undefined && value !== null) {
      // Validar tipo
      if (rules.type && !checkType(value, rules.type)) {
        result.valid = false
        result.errors.push(`Campo '${key}' deve ser do tipo ${rules.type}`)
      }

      // Validar min/max para números
      if (rules.type === 'number') {
        if (rules.min !== undefined && value < rules.min) {
          result.valid = false
          result.errors.push(`Campo '${key}' deve ser maior ou igual a ${rules.min}`)
        }
        if (rules.max !== undefined && value > rules.max) {
          result.valid = false
          result.errors.push(`Campo '${key}' deve ser menor ou igual a ${rules.max}`)
        }
      }

      // Validar min/max length para strings
      if (rules.type === 'string') {
        if (rules.minLength !== undefined && value.length < rules.minLength) {
          result.valid = false
          result.errors.push(`Campo '${key}' deve ter pelo menos ${rules.minLength} caracteres`)
        }
        if (rules.maxLength !== undefined && value.length > rules.maxLength) {
          result.valid = false
          result.errors.push(`Campo '${key}' deve ter no máximo ${rules.maxLength} caracteres`)
        }
        // Validar padrão regex
        if (rules.pattern && !new RegExp(rules.pattern).test(value)) {
          result.valid = false
          result.errors.push(`Campo '${key}' não corresponde ao padrão esperado`)
        }
      }

      // Validar enum
      if (rules.enum && !rules.enum.includes(value)) {
        result.valid = false
        result.errors.push(`Campo '${key}' deve ser um dos valores: ${rules.enum.join(', ')}`)
      }
    }
  })

  return result
}

/**
 * Verificar se o valor é do tipo esperado
 * @param {any} value - Valor a verificar
 * @param {string} type - Tipo esperado
 * @returns {boolean} Resultado da verificação
 */
function checkType(value, type) {
  switch (type) {
    case 'string':
      return typeof value === 'string'
    case 'number':
      return typeof value === 'number' && !isNaN(value)
    case 'boolean':
      return typeof value === 'boolean'
    case 'array':
      return Array.isArray(value)
    case 'object':
      return typeof value === 'object' && value !== null && !Array.isArray(value)
    default:
      return true
  }
}

/**
 * Sanitiza string para prevenir XSS
 * @param {string} input - String a ser sanitizada
 * @returns {string} String sanitizada
 */
export function sanitizeString(input) {
  if (typeof input !== 'string') return input

  // Substitui caracteres que podem ser usados em ataques XSS
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

/**
 * Sanitiza objeto recursivamente
 * @param {Object} obj - Objeto a ser sanitizado
 * @returns {Object} Objeto sanitizado
 */
export function sanitizeObject(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  // Se for array, sanitizar cada elemento
  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item))
  }

  // Para objetos, sanitizar cada valor
  const result = {}
  Object.keys(obj).forEach((key) => {
    const value = obj[key]
    if (typeof value === 'string') {
      result[key] = sanitizeString(value)
    } else if (typeof value === 'object' && value !== null) {
      result[key] = sanitizeObject(value)
    } else {
      result[key] = value
    }
  })

  return result
}

/**
 * Middleware para sanitizar entradas de API
 */
export const sanitizeInputMiddleware = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body)
  }

  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeObject(req.query)
  }

  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeObject(req.params)
  }

  next()
}

// Exemplos de esquemas
export const userSchema = {
  username: {
    type: 'string',
    required: true,
    minLength: 3,
    maxLength: 50,
    pattern: '^[a-zA-Z0-9_]+$',
  },
  displayName: {
    type: 'string',
    maxLength: 100,
  },
  age: {
    type: 'number',
    min: 1,
    max: 120,
  },
}

export const gameSessionSchema = {
  user_id: { type: 'string', required: true },
  game_id: { type: 'string', required: true },
  difficulty: {
    type: 'string',
    required: true,
    enum: ['easy', 'medium', 'hard', 'EASY', 'MEDIUM', 'HARD'],
  },
  score: { type: 'number', min: 0 },
  accuracy: { type: 'number', min: 0, max: 100 },
  time_spent: { type: 'number', min: 0 },
}

export default validateInput
