import express from 'express'
import cors from 'cors'
import pg from 'pg'
import jwt from 'jsonwebtoken'
import rateLimit from 'express-rate-limit'
import winston from 'winston'
import { z } from 'zod'
import dotenv from 'dotenv'
import compression from 'compression'
import helmet from 'helmet'
import {
  validateInput,
  sanitizeInputMiddleware,
  userSchema,
  gameSessionSchema,
} from './validateInput.js'

dotenv.config()

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    new winston.transports.File({ filename: 'error.log' }),
    new winston.transports.Console(),
  ],
})

const envSchema = z.object({
  // Database Configuration
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.coerce.number().default(5432),
  DB_NAME: z.string().default('betina_db'),
  DB_USER: z.string().default('betina_user'),
  DB_PASSWORD: z.string().min(1),
  DB_SSL_CA: z.string().optional(),
  DB_SSL_CERT: z.string().optional(),
  DB_SSL_KEY: z.string().optional(),
  DB_SSL_REJECT_UNAUTHORIZED: z.coerce.boolean().default(true),
  // API Configuration
  API_PORT: z.coerce.number().default(3000),
  API_HOST: z.string().default('0.0.0.0'),
  API_BASE_URL: z.string().optional(),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('24h'),
  JWT_ISSUER: z.string().default('portal-betina'),
  JWT_AUDIENCE: z.string().default('betina-users'),
  BCRYPT_ROUNDS: z.coerce.number().default(12),
  // CORS Configuration
  CORS_ORIGINS: z
    .string()
    .transform((val) => val.split(',').filter(Boolean))
    .default('http://localhost:3000,http://localhost:5173'),
  CORS_METHODS: z.string().default('GET,POST,PUT,DELETE,OPTIONS'),
  CORS_ALLOW_HEADERS: z
    .string()
    .default('Content-Type,Authorization,X-Requested-With,Accept,Origin,X-Environment'),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),
  RATE_LIMIT_SKIP_SUCCESSFUL_REQUESTS: z.coerce.boolean().default(true),

  // Performance & Cache
  ENABLE_COMPRESSION: z.coerce.boolean().default(true),
  ENABLE_CACHE: z.coerce.boolean().default(true),
  CACHE_TTL: z.coerce.number().default(3600),
  VITE_CACHE_TTL: z.coerce.number().default(300),

  // Database Pool
  CONNECTION_POOL_MIN: z.coerce.number().default(2),
  CONNECTION_POOL_MAX: z.coerce.number().default(10),
  CONNECTION_TIMEOUT: z.coerce.number().default(60000),
  IDLE_TIMEOUT: z.coerce.number().default(30000),
  QUERY_TIMEOUT: z.coerce.number().default(30000),

  // Environment & Monitoring
  NODE_ENV: z.string().default('development'),
  LOG_LEVEL: z.string().default('info'),
  DEBUG_MODE: z.coerce.boolean().default(false),
  ENABLE_METRICS: z.coerce.boolean().default(false),
  HEALTH_CHECK_ENABLED: z.coerce.boolean().default(true),
  METRICS_COLLECTION_ENABLED: z.coerce.boolean().default(true),
  PERFORMANCE_MONITORING: z.coerce.boolean().default(true),

  // Security
  SECURITY_HEADERS_ENABLED: z.coerce.boolean().default(true),
  HELMET_ENABLED: z.coerce.boolean().default(true),
  TRUST_PROXY: z.coerce.boolean().default(false),

  // Frontend Configuration
  VITE_APP_TITLE: z.string().default('Portal Betina'),
  VITE_API_URL: z.string().default('http://localhost:3000'),
  VITE_APP_VERSION: z.string().default('1.0.0'),
  VITE_BATCH_SIZE: z.coerce.number().default(50),
  VITE_ENVIRONMENT: z.string().default('development'),

  // AI Configuration
  DEEPSEEK_API_KEY: z.string().optional(),
  DEEPSEEK_API_URL: z.string().default('https://api.deepseek.com'),
  DEEPSEEK_MODEL: z.string().default('deepseek-chat'),
  AI_ENABLED: z.coerce.boolean().default(false),
  AI_TEMPERATURE: z.coerce.number().default(0.7),
  AI_MAX_TOKENS: z.coerce.number().default(1000),
})

const env = envSchema.parse(process.env)

const { Pool } = pg
const app = express()
const PORT = env.API_PORT

const pool = new Pool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_NAME,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  min: env.CONNECTION_POOL_MIN,
  max: env.CONNECTION_POOL_MAX,
  connectionTimeoutMillis: env.CONNECTION_TIMEOUT,
  idleTimeoutMillis: env.IDLE_TIMEOUT,
  query_timeout: env.QUERY_TIMEOUT,
  ssl:
    env.NODE_ENV === 'production'
      ? {
          ca: env.DB_SSL_CA,
          cert: env.DB_SSL_CERT,
          key: env.DB_SSL_KEY,
          rejectUnauthorized: env.DB_SSL_REJECT_UNAUTHORIZED,
        }
      : false,
})

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({
        error: 'Token de autorização não fornecido',
        code: 'MISSING_TOKEN',
        requestId: req.requestId,
      })
    }

    const [bearer, token] = authHeader.split(' ')

    if (bearer !== 'Bearer' || !token) {
      return res.status(401).json({
        error: 'Formato de token inválido. Use: Bearer <token>',
        code: 'INVALID_TOKEN_FORMAT',
        requestId: req.requestId,
      })
    }

    const decoded = jwt.verify(token, env.JWT_SECRET, {
      issuer: env.JWT_ISSUER,
      audience: env.JWT_AUDIENCE,
    })

    // Verify user still exists in database
    const userResult = await pool.query(
      'SELECT id, username, is_anonymous, active FROM users WHERE id = $1',
      [decoded.id]
    )

    if (!userResult.rows[0]) {
      return res.status(401).json({
        error: 'Usuário não encontrado',
        code: 'USER_NOT_FOUND',
        requestId: req.requestId,
      })
    }

    const user = userResult.rows[0]

    if (!user.active) {
      return res.status(401).json({
        error: 'Conta de usuário desativada',
        code: 'USER_INACTIVE',
        requestId: req.requestId,
      })
    }

    req.user = {
      ...decoded,
      active: user.active,
    }

    logger.debug('Token JWT validado com sucesso', {
      userId: decoded.id,
      username: decoded.username,
      requestId: req.requestId,
    })

    next()
  } catch (err) {
    logger.error('Erro ao verificar token JWT', {
      error: err.message,
      type: err.name,
      requestId: req.requestId,
    })

    let errorResponse = {
      error: 'Token inválido',
      code: 'INVALID_TOKEN',
      requestId: req.requestId,
    }

    if (err.name === 'TokenExpiredError') {
      errorResponse = {
        error: 'Token expirado',
        code: 'TOKEN_EXPIRED',
        expiredAt: err.expiredAt,
        requestId: req.requestId,
      }
    } else if (err.name === 'JsonWebTokenError') {
      errorResponse = {
        error: 'Token malformado',
        code: 'MALFORMED_TOKEN',
        requestId: req.requestId,
      }
    }

    return res.status(401).json(errorResponse)
  }
}

// Trust proxy configuration for production
if (env.TRUST_PROXY) {
  app.set('trust proxy', 1)
}

// Security headers middleware
if (env.SECURITY_HEADERS_ENABLED) {
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('X-Frame-Options', 'DENY')
    res.setHeader('X-XSS-Protection', '1; mode=block')
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
    if (env.NODE_ENV === 'production') {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
    }
    next()
  })
}

// Configure rate limiting
app.use(
  rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX_REQUESTS,
    skipSuccessfulRequests: env.RATE_LIMIT_SKIP_SUCCESSFUL_REQUESTS,
    message: {
      error: 'Limite de requisições excedido',
      retryAfter: Math.ceil(env.RATE_LIMIT_WINDOW_MS / 1000),
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
      // Skip rate limiting for health checks
      return req.path === '/api/health'
    },
  })
)

// Initialize optional middleware asynchronously
const initializeOptionalMiddleware = async () => {
  // Helmet middleware for additional security
  if (env.HELMET_ENABLED) {
    app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", 'data:', 'https:'],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
          },
        },
        crossOriginEmbedderPolicy: false,
      })
    )
    logger.info('Helmet middleware carregado com sucesso')
  }

  // Compression middleware
  if (env.ENABLE_COMPRESSION) {
    app.use(compression())
    logger.info('Compression middleware carregado com sucesso')
  }
}

const connectWithRetry = async (retries = env.CONNECTION_POOL_MAX) => {
  try {
    await pool.query('SELECT NOW()')
    logger.info('Conectado ao PostgreSQL', {
      database: env.DB_NAME,
      host: env.DB_HOST,
      port: env.DB_PORT,
    })
  } catch (err) {
    logger.error(
      `Erro ao conectar com PostgreSQL (tentativa ${env.CONNECTION_POOL_MAX - retries + 1})`,
      { error: err.message }
    )
    if (retries > 0) {
      logger.info('Tentando novamente em 5 segundos...')
      await new Promise((resolve) => setTimeout(resolve, 5000))
      return connectWithRetry(retries - 1)
    }
    logger.error('Falha ao conectar após múltiplas tentativas')
    process.exit(1)
  }
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, etc.)
      if (!origin) return callback(null, true)

      if (env.CORS_ORIGINS.includes(origin)) {
        callback(null, true)
      } else {
        logger.warn('CORS: Origin não permitida', { origin, allowedOrigins: env.CORS_ORIGINS })
        callback(new Error('Não permitido pelo CORS'))
      }
    },
    methods: env.CORS_METHODS.split(','),
    allowedHeaders: env.CORS_ALLOW_HEADERS.split(','),
    credentials: true,
    optionsSuccessStatus: 200,
    maxAge: 86400, // Cache preflight requests for 24 hours
  })
)
app.use(
  express.json({
    limit: '10mb',
    verify: (req, res, buf) => {
      try {
        JSON.parse(buf)
      } catch (e) {
        logger.error('JSON inválido recebido', { error: e.message, body: buf.toString() })
        const error = new Error('JSON malformado')
        error.status = 400
        throw error
      }
    },
  })
)
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(sanitizeInputMiddleware)

// Enhanced request logging middleware
app.use((req, res, next) => {
  const start = Date.now()
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  req.requestId = requestId
  req.startTime = start

  // Log incoming request
  logger.info('Requisição recebida', {
    requestId,
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    contentLength: req.get('Content-Length'),
  })

  // Override res.json to log response
  const originalJson = res.json
  res.json = function (obj) {
    const duration = Date.now() - start
    logger.info('Resposta enviada', {
      requestId,
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      responseSize: JSON.stringify(obj).length,
    })
    return originalJson.call(this, obj)
  }

  next()
})

// Global error handler
app.use((err, req, res, next) => {
  const requestId = req.requestId || 'unknown'
  const duration = req.startTime ? Date.now() - req.startTime : 0

  logger.error('Erro na requisição', {
    requestId,
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    duration: `${duration}ms`,
    statusCode: err.status || 500,
  })

  const statusCode = err.status || 500
  const message =
    env.NODE_ENV === 'production' && statusCode === 500 ? 'Erro interno do servidor' : err.message

  res.status(statusCode).json({
    error: message,
    requestId,
    timestamp: new Date().toISOString(),
    ...(env.NODE_ENV !== 'production' && { stack: err.stack }),
  })
})

// Endpoints faltantes implementados

// Cognitive Profiles endpoints
app.get('/api/cognitive-profiles', authMiddleware, async (req, res) => {
  try {
    const { user_id } = req.query
    let query = 'SELECT * FROM cognitive_profiles'
    const params = []

    if (user_id) {
      query += ' WHERE user_id = $1'
      params.push(parseInt(user_id))
    }

    query += ' ORDER BY last_updated DESC'
    const result = await pool.query(query, params)
    res.json(result.rows)
  } catch (err) {
    logger.error('Erro ao buscar perfis cognitivos', { error: err.message })
    res.status(500).json({ error: 'Erro interno no servidor' })
  }
})

app.post('/api/cognitive-profiles', authMiddleware, async (req, res) => {
  try {
    const {
      user_id,
      processing_speed,
      attention_span,
      working_memory,
      pattern_recognition,
      visual_learner_score,
      auditory_learner_score,
      kinesthetic_learner_score,
    } = req.body

    const result = await pool.query(
      `INSERT INTO cognitive_profiles 
       (user_id, processing_speed, attention_span, working_memory, pattern_recognition, visual_learner_score, auditory_learner_score, kinesthetic_learner_score)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        user_id,
        processing_speed,
        attention_span,
        working_memory,
        pattern_recognition,
        visual_learner_score,
        auditory_learner_score,
        kinesthetic_learner_score,
      ]
    )

    res.status(201).json(result.rows[0])
  } catch (err) {
    logger.error('Erro ao criar perfil cognitivo', { error: err.message })
    res.status(500).json({ error: 'Erro interno no servidor' })
  }
})

// ML Features endpoint
app.get('/api/ml-features', authMiddleware, async (req, res) => {
  try {
    const { user_id, game_id } = req.query
    let query = 'SELECT * FROM ml_features'
    const params = []
    let whereClause = []

    if (user_id) {
      whereClause.push(`user_id = $${params.length + 1}`)
      params.push(parseInt(user_id))
    }

    if (game_id) {
      whereClause.push(`game_id = $${params.length + 1}`)
      params.push(game_id)
    }

    if (whereClause.length > 0) {
      query += ' WHERE ' + whereClause.join(' AND ')
    }

    query += ' ORDER BY calculated_at DESC'
    const result = await pool.query(query, params)
    res.json(result.rows)
  } catch (err) {
    logger.error('Erro ao buscar features ML', { error: err.message })
    res.status(500).json({ error: 'Erro interno no servidor' })
  }
})

// Neuropedagogical Insights endpoint
app.get('/api/neuropedagogical-insights', authMiddleware, async (req, res) => {
  try {
    const { user_id } = req.query
    let query = 'SELECT * FROM neuropedagogical_insights'
    const params = []

    if (user_id) {
      query += ' WHERE user_id = $1'
      params.push(parseInt(user_id))
    }

    query += ' ORDER BY generated_at DESC'
    const result = await pool.query(query, params)
    res.json(result.rows)
  } catch (err) {
    logger.error('Erro ao buscar insights neuropedagógicos', { error: err.message })
    res.status(500).json({ error: 'Erro interno no servidor' })
  }
})

// Learning Patterns endpoint
app.get('/api/learning-patterns', authMiddleware, async (req, res) => {
  try {
    const { user_id } = req.query
    let query = 'SELECT * FROM learning_patterns'
    const params = []

    if (user_id) {
      query += ' WHERE user_id = $1'
      params.push(parseInt(user_id))
    }

    query += ' ORDER BY detected_at DESC'
    const result = await pool.query(query, params)
    res.json(result.rows)
  } catch (err) {
    logger.error('Erro ao buscar padrões de aprendizagem', { error: err.message })
    res.status(500).json({ error: 'Erro interno no servidor' })
  }
})

// Engagement Metrics endpoint
app.get('/api/engagement-metrics', authMiddleware, async (req, res) => {
  try {
    const { user_id } = req.query
    let query = 'SELECT * FROM engagement_metrics'
    const params = []

    if (user_id) {
      query += ' WHERE user_id = $1'
      params.push(parseInt(user_id))
    }

    query += ' ORDER BY calculated_at DESC'
    const result = await pool.query(query, params)
    res.json(result.rows)
  } catch (err) {
    logger.error('Erro ao buscar métricas de engajamento', { error: err.message })
    res.status(500).json({ error: 'Erro interno no servidor' })
  }
})

// Neuroplasticity Tracking endpoint
app.get('/api/neuroplasticity-tracking', authMiddleware, async (req, res) => {
  try {
    const { user_id } = req.query
    let query = 'SELECT * FROM neuroplasticity_tracking'
    const params = []

    if (user_id) {
      query += ' WHERE user_id = $1'
      params.push(parseInt(user_id))
    }

    query += ' ORDER BY calculated_at DESC'
    const result = await pool.query(query, params)
    res.json(result.rows)
  } catch (err) {
    logger.error('Erro ao buscar tracking de neuroplasticidade', { error: err.message })
    res.status(500).json({ error: 'Erro interno no servidor' })
  }
})

// User Profile management endpoints
app.put('/api/user/:userId/profiles/:profileId', authMiddleware, async (req, res) => {
  try {
    const { userId, profileId } = req.params
    const { profile_name, preferences } = req.body

    const result = await pool.query(
      'UPDATE user_profiles SET profile_name = $1, preferences = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 AND user_id = $4 RETURNING *',
      [profile_name, JSON.stringify(preferences || {}), profileId, userId]
    )

    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Perfil não encontrado' })
    }

    res.json(result.rows[0])
  } catch (err) {
    logger.error('Erro ao atualizar perfil', { error: err.message })
    res.status(500).json({ error: 'Erro interno no servidor' })
  }
})

app.delete('/api/user/:userId/profiles/:profileId', authMiddleware, async (req, res) => {
  try {
    const { userId, profileId } = req.params

    const result = await pool.query(
      'DELETE FROM user_profiles WHERE id = $1 AND user_id = $2 RETURNING *',
      [profileId, userId]
    )

    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Perfil não encontrado' })
    }

    res.json({ message: 'Perfil deletado com sucesso' })
  } catch (err) {
    logger.error('Erro ao deletar perfil', { error: err.message })
    res.status(500).json({ error: 'Erro interno no servidor' })
  }
})

app.post('/api/user/:userId/profiles/:profileId/activate', authMiddleware, async (req, res) => {
  try {
    const { userId, profileId } = req.params

    // Desativar todos os perfis do usuário
    await pool.query('UPDATE user_profiles SET is_active = false WHERE user_id = $1', [userId])

    // Ativar o perfil específico
    const result = await pool.query(
      'UPDATE user_profiles SET is_active = true WHERE id = $1 AND user_id = $2 RETURNING *',
      [profileId, userId]
    )

    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Perfil não encontrado' })
    }

    res.json(result.rows[0])
  } catch (err) {
    logger.error('Erro ao ativar perfil', { error: err.message })
    res.status(500).json({ error: 'Erro interno no servidor' })
  }
})

// Note: 404 handler moved to the very end of the file after all route definitions

const preferencesSchema = z.object({
  preferences: z
    .object({
      theme: z.enum(['light', 'dark']).optional(),
      notifications: z
        .object({
          enabled: z.boolean(),
          frequency: z.enum(['daily', 'weekly']).optional(),
        })
        .optional(),
      language: z.string().optional(),
    })
    .optional(),
})

const createDefaultProfile = async (userId) => {
  try {
    await pool.query(
      'INSERT INTO user_profiles (user_id, profile_name, is_active) VALUES ($1, $2, $3)',
      [userId, 'Perfil Padrão', true]
    )
  } catch (err) {
    logger.error('Erro ao criar perfil padrão', { error: err.message })
  }
}

// Health check cache
let healthCheckCache = null
let healthCheckCacheTime = 0
const HEALTH_CHECK_CACHE_TTL = 30000 // 30 seconds

app.get('/api/health', async (req, res) => {
  try {
    const now = Date.now()

    // Return cached response if still valid
    if (healthCheckCache && now - healthCheckCacheTime < HEALTH_CHECK_CACHE_TTL) {
      return res.json({
        ...healthCheckCache,
        cached: true,
        cacheAge: Math.floor((now - healthCheckCacheTime) / 1000),
      })
    }

    const start = Date.now()
    const dbResult = await pool.query('SELECT NOW(), version() as db_version')
    const dbLatency = Date.now() - start

    const poolInfo = {
      totalConnections: pool.totalCount,
      idleConnections: pool.idleCount,
      waitingClients: pool.waitingCount,
    }

    const memoryUsage = process.memoryUsage()
    const cpuUsage = process.cpuUsage()

    const healthData = {
      status: 'healthy',
      timestamp: dbResult.rows[0].now,
      environment: env.NODE_ENV,
      version: env.VITE_APP_VERSION,
      uptime: Math.floor(process.uptime()),
      database: {
        connected: true,
        latency: `${dbLatency}ms`,
        version: dbResult.rows[0].db_version,
        pool: poolInfo,
      },
      memory: {
        rss: Math.round(memoryUsage.rss / 1024 / 1024) + 'MB',
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + 'MB',
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + 'MB',
        external: Math.round(memoryUsage.external / 1024 / 1024) + 'MB',
      },
      cpu: {
        user: cpuUsage.user,
        system: cpuUsage.system,
      },
      features: {
        compression: env.ENABLE_COMPRESSION,
        cache: env.ENABLE_CACHE,
        metrics: env.ENABLE_METRICS,
        security: env.SECURITY_HEADERS_ENABLED,
        helmet: env.HELMET_ENABLED,
      },
    }

    // Cache the response
    healthCheckCache = healthData
    healthCheckCacheTime = now

    res.json(healthData)
  } catch (err) {
    logger.error('Erro no health check', { error: err.message })
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
      error: 'Erro ao conectar com o banco de dados',
      database: {
        connected: false,
        error: err.message,
      },
    })
  }
})

app.post('/api/auth/anonymous', async (req, res) => {
  try {
    const timestamp = Date.now()
    const randomSuffix = Math.random().toString(36).substr(2, 8)
    const username = `anonimo_${timestamp}_${randomSuffix}`
    const displayName = `Usuário Anônimo ${randomSuffix.toUpperCase()}`

    const newUser = await pool.query(
      'INSERT INTO users (username, display_name, is_anonymous, active) VALUES ($1, $2, $3, $4) RETURNING *',
      [username, displayName, true, true]
    )

    const user = newUser.rows[0]
    await createDefaultProfile(user.id)

    const tokenPayload = {
      id: user.id,
      username: user.username,
      isAnonymous: true,
      iat: Math.floor(timestamp / 1000),
    }

    const token = jwt.sign(tokenPayload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
      issuer: env.JWT_ISSUER,
      audience: env.JWT_AUDIENCE,
    })

    logger.info('Usuário anônimo criado com sucesso', {
      userId: user.id,
      username: user.username,
      requestId: req.requestId,
    })

    res.status(201).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        displayName: user.display_name,
        isAnonymous: user.is_anonymous,
        active: user.active,
        createdAt: user.created_at,
      },
      token,
      tokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24h default
    })
  } catch (err) {
    logger.error('Erro ao criar usuário anônimo', {
      error: err.message,
      stack: err.stack,
      requestId: req.requestId,
    })
    res.status(500).json({
      error: 'Erro interno no servidor',
      code: 'USER_CREATION_FAILED',
      requestId: req.requestId,
    })
  }
})

// Metrics endpoint (protected, only if metrics enabled)
app.get('/api/metrics', async (req, res) => {
  if (!env.ENABLE_METRICS) {
    return res.status(404).json({
      error: 'Endpoint de métricas não habilitado',
      code: 'METRICS_DISABLED',
    })
  }

  try {
    const [userStats, sessionStats, systemStats] = await Promise.all([
      pool.query(`
        SELECT 
          COUNT(*) as total_users,
          COUNT(*) FILTER (WHERE is_anonymous = true) as anonymous_users,
          COUNT(*) FILTER (WHERE is_anonymous = false) as registered_users,
          COUNT(*) FILTER (WHERE active = true) as active_users,
          COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '24 hours') as users_last_24h
        FROM users
      `),
      pool.query(`
        SELECT 
          COUNT(*) as total_sessions,
          COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '24 hours') as sessions_last_24h,
          COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') as sessions_last_7d,
          AVG(score) as avg_score,
          AVG(accuracy) as avg_accuracy,
          AVG(time_spent) as avg_time_spent
        FROM game_sessions
      `),
      pool.query(`
        SELECT 
          schemaname,
          tablename,
          n_tup_ins as inserts,
          n_tup_upd as updates,
          n_tup_del as deletes,
          n_live_tup as live_tuples,
          n_dead_tup as dead_tuples
        FROM pg_stat_user_tables 
        ORDER BY n_live_tup DESC
      `),
    ])

    const metrics = {
      timestamp: new Date().toISOString(),
      users: userStats.rows[0],
      sessions: sessionStats.rows[0],
      database: {
        pool: {
          total: pool.totalCount,
          idle: pool.idleCount,
          waiting: pool.waitingCount,
        },
        tables: systemStats.rows,
      },
      system: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
        version: process.version,
        platform: process.platform,
      },
    }

    res.json(metrics)
  } catch (err) {
    logger.error('Erro ao buscar métricas', { error: err.message })
    res.status(500).json({
      error: 'Erro ao coletar métricas',
      code: 'METRICS_ERROR',
    })
  }
})

app.get('/api/auth/verify', authMiddleware, async (req, res) => {
  try {
    const user = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id])
    if (!user.rows[0]) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }
    res.json({
      success: true,
      user: {
        id: user.rows[0].id,
        username: user.rows[0].username,
        displayName: user.rows[0].display_name,
        isAnonymous: user.rows[0].is_anonymous,
      },
      tokenValid: true,
    })
  } catch (err) {
    logger.error('Erro ao verificar token', { error: err.message })
    res.status(500).json({ error: 'Erro interno no servidor' })
  }
})

app.get('/api/user/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const isNumeric = /^\d+$/.test(id)
    const result = isNumeric
      ? await pool.query('SELECT * FROM users WHERE id = $1', [parseInt(id)])
      : await pool.query('SELECT * FROM users WHERE username = $1', [id])

    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }
    res.json(result.rows[0])
  } catch (err) {
    logger.error('Erro ao buscar usuário', { error: err.message })
    res.status(500).json({ error: 'Erro interno no servidor' })
  }
})

app.post('/api/user', validateInput(userSchema), async (req, res) => {
  try {
    const { username, displayName } = req.body
    const existingUser = await pool.query('SELECT * FROM users WHERE username = $1', [username])
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'Nome de usuário já está em uso' })
    }

    const newUser = await pool.query(
      'INSERT INTO users (username, display_name) VALUES ($1, $2) RETURNING *',
      [username, displayName || username]
    )

    await createDefaultProfile(newUser.rows[0].id)
    res.status(201).json(newUser.rows[0])
  } catch (err) {
    logger.error('Erro ao criar usuário', { error: err.message })
    res.status(500).json({ error: 'Erro interno no servidor' })
  }
})

app.put(
  '/api/user/:userId/preferences',
  authMiddleware,
  validateInput(preferencesSchema),
  async (req, res) => {
    try {
      const { userId } = req.params
      const { preferences } = req.body
      const user = await pool.query('SELECT * FROM users WHERE id = $1', [userId])
      if (!user.rows[0]) {
        return res.status(404).json({ error: 'Usuário não encontrado' })
      }

      const result = await pool.query(
        'UPDATE users SET preferences = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
        [JSON.stringify(preferences), userId]
      )

      res
        .status(200)
        .json({ message: 'Preferências atualizadas com sucesso', user: result.rows[0] })
    } catch (err) {
      logger.error('Erro ao atualizar preferências do usuário', { error: err.message })
      res.status(500).json({ error: 'Erro interno no servidor' })
    }
  }
)

app.post(
  '/api/game-session',
  authMiddleware,
  validateInput(gameSessionSchema),
  async (req, res) => {
    try {
      const {
        user_id,
        game_id,
        difficulty,
        score,
        accuracy,
        time_spent,
        completed,
        correct_answers,
        total_attempts,
        data,
      } = req.body
      const userId = parseInt(user_id)
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'user_id deve ser um número válido' })
      }

      const user = await pool.query('SELECT * FROM users WHERE id = $1', [userId])
      if (!user.rows[0]) {
        return res.status(404).json({ error: 'Usuário não encontrado' })
      }

      const result = await pool.query(
        `INSERT INTO game_sessions 
       (user_id, game_id, difficulty, score, accuracy, time_spent, completed, correct_answers, total_attempts, data)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
        [
          userId,
          game_id,
          difficulty,
          score || 0,
          accuracy || 0,
          time_spent || 0,
          completed ?? true,
          correct_answers || 0,
          total_attempts || 0,
          JSON.stringify(data || {}),
        ]
      )

      res.status(201).json(result.rows[0])
    } catch (err) {
      logger.error('Erro ao salvar sessão de jogo', { error: err.message })
      res.status(500).json({ error: 'Erro interno no servidor' })
    }
  }
)

const validDifficulties = ['EASY', 'MEDIUM', 'HARD']

app.get('/api/adaptive-parameters/:gameId/:difficulty', authMiddleware, async (req, res) => {
  try {
    const { gameId, difficulty } = req.params
    const normalizedDifficulty = difficulty.toUpperCase()
    if (!validDifficulties.includes(normalizedDifficulty)) {
      return res.status(400).json({ error: 'Dificuldade inválida. Use: EASY, MEDIUM ou HARD' })
    }

    const result = await pool.query(
      'SELECT * FROM adaptive_ml_parameters WHERE game_id = $1 AND difficulty = $2 AND is_active = true',
      [gameId, normalizedDifficulty]
    )

    if (!result.rows[0]) {
      return res.status(404).json({
        error: 'Parâmetros não encontrados',
        game_id: gameId,
        difficulty: normalizedDifficulty,
      })
    }
    res.json(result.rows[0])
  } catch (err) {
    logger.error('Erro ao buscar parâmetros adaptativos', { error: err.message })
    res.status(500).json({ error: 'Erro interno no servidor' })
  }
})

app.get('/api/user/:id/game-sessions', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const { game_id, limit } = req.query
    const userId = parseInt(id)
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'ID do usuário deve ser um número válido' })
    }

    const user = await pool.query('SELECT * FROM users WHERE id = $1', [userId])
    if (!user.rows[0]) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }

    let query = 'SELECT * FROM game_sessions WHERE user_id = $1'
    let params = [userId]
    let paramIndex = 2

    if (game_id) {
      query += ` AND game_id = $${paramIndex}`
      params.push(game_id)
      paramIndex++
    }

    query += ' ORDER BY created_at DESC'
    if (limit && !isNaN(parseInt(limit)) && parseInt(limit) > 0) {
      query += ` LIMIT $${paramIndex}`
      params.push(parseInt(limit))
    }

    const result = await pool.query(query, params)
    res.json(result.rows)
  } catch (err) {
    logger.error('Erro ao buscar sessões de jogo do usuário', { error: err.message })
    res.status(500).json({ error: 'Erro interno no servidor' })
  }
})

app.get('/api/user/:id/profiles', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const userId = parseInt(id)
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'ID do usuário deve ser um número válido' })
    }

    const user = await pool.query('SELECT * FROM users WHERE id = $1', [userId])
    if (!user.rows[0]) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }

    const result = await pool.query(
      'SELECT * FROM user_profiles WHERE user_id = $1 ORDER BY is_active DESC, created_at DESC',
      [userId]
    )

    res.json(result.rows)
  } catch (err) {
    logger.error('Erro ao buscar perfis do usuário', { error: err.message })
    res.status(500).json({ error: 'Erro interno no servidor' })
  }
})

app.post('/api/user/:id/profiles', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const { profile_name, preferences } = req.body
    const userId = parseInt(id)
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'ID do usuário deve ser um número válido' })
    }

    const user = await pool.query('SELECT * FROM users WHERE id = $1', [userId])
    if (!user.rows[0]) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }

    if (!profile_name?.trim()) {
      return res.status(400).json({ error: 'Nome do perfil é obrigatório' })
    }

    const existingProfile = await pool.query(
      'SELECT * FROM user_profiles WHERE user_id = $1 AND profile_name = $2',
      [userId, profile_name.trim()]
    )

    if (existingProfile.rows.length > 0) {
      return res.status(409).json({ error: 'Já existe um perfil com este nome' })
    }

    const profileCount = await pool.query('SELECT COUNT(*) FROM user_profiles WHERE user_id = $1', [
      userId,
    ])
    const isFirstProfile = parseInt(profileCount.rows[0].count) === 0

    const result = await pool.query(
      `INSERT INTO user_profiles (user_id, profile_name, preferences, is_active)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [userId, profile_name.trim(), JSON.stringify(preferences || {}), isFirstProfile]
    )

    res.status(201).json(result.rows[0])
  } catch (err) {
    logger.error('Erro ao criar perfil do usuário', { error: err.message })
    res.status(500).json({ error: 'Erro interno no servidor' })
  }
})

const profileUpdateSchema = z.object({
  profile_name: z.string().min(1).optional(),
  profile_icon: z.string().optional(),
  profile_color: z.string().optional(),
  age_range: z.string().optional(),
  preferences: preferencesSchema.shape.preferences.optional(),
  is_active: z.boolean().optional(),
})

app.put(
  '/api/user/:userId/profiles/:profileId',
  authMiddleware,
  validateInput(profileUpdateSchema),
  async (req, res) => {
    try {
      const { userId, profileId } = req.params
      const { profile_name, profile_icon, profile_color, age_range, preferences, is_active } =
        req.body
      const userIdNum = parseInt(userId)
      const profileIdNum = parseInt(profileId)

      if (isNaN(userIdNum) || isNaN(profileIdNum)) {
        return res.status(400).json({ error: 'IDs devem ser números válidos' })
      }

      const profile = await pool.query(
        'SELECT * FROM user_profiles WHERE id = $1 AND user_id = $2',
        [profileIdNum, userIdNum]
      )

      if (!profile.rows[0]) {
        return res.status(404).json({ error: 'Perfil não encontrado' })
      }

      let updateFields = []
      let params = []
      let paramIndex = 1

      if (profile_name) {
        updateFields.push(`profile_name = $${paramIndex}`)
        params.push(profile_name.trim())
        paramIndex++
      }
      if (profile_icon) {
        updateFields.push(`profile_icon = $${paramIndex}`)
        params.push(profile_icon)
        paramIndex++
      }
      if (profile_color) {
        updateFields.push(`profile_color = $${paramIndex}`)
        params.push(profile_color)
        paramIndex++
      }
      if (age_range) {
        updateFields.push(`age_range = $${paramIndex}`)
        params.push(age_range)
        paramIndex++
      }
      if (preferences) {
        updateFields.push(`preferences = $${paramIndex}`)
        params.push(JSON.stringify(preferences))
        paramIndex++
      }
      if (is_active !== undefined) {
        updateFields.push(`is_active = $${paramIndex}`)
        params.push(is_active)
        paramIndex++
        if (is_active) {
          await pool.query(
            'UPDATE user_profiles SET is_active = false WHERE user_id = $1 AND id != $2',
            [userIdNum, profileIdNum]
          )
        }
      }

      if (!updateFields.length) {
        return res.status(400).json({ error: 'Nenhum campo para atualizar' })
      }

      params.push(profileIdNum, userIdNum)
      const result = await pool.query(
        `UPDATE user_profiles SET ${updateFields.join(', ')}, updated_at = NOW()
       WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1} RETURNING *`,
        params
      )

      res.json(result.rows[0])
    } catch (err) {
      logger.error('Erro ao atualizar perfil', { error: err.message })
      res.status(500).json({ error: 'Erro interno no servidor' })
    }
  }
)

app.delete('/api/user/:userId/profiles/:profileId', authMiddleware, async (req, res) => {
  try {
    const { userId, profileId } = req.params
    const userIdNum = parseInt(userId)
    const profileIdNum = parseInt(profileId)

    if (isNaN(userIdNum) || isNaN(profileIdNum)) {
      return res.status(400).json({ error: 'IDs devem ser números válidos' })
    }

    const profile = await pool.query('SELECT * FROM user_profiles WHERE id = $1 AND user_id = $2', [
      profileIdNum,
      userIdNum,
    ])

    if (!profile.rows[0]) {
      return res.status(404).json({ error: 'Perfil não encontrado' })
    }

    const profileCount = await pool.query('SELECT COUNT(*) FROM user_profiles WHERE user_id = $1', [
      userIdNum,
    ])
    if (parseInt(profileCount.rows[0].count) <= 1) {
      return res.status(400).json({ error: 'Não é possível deletar o último perfil' })
    }

    await pool.query('DELETE FROM user_profiles WHERE id = $1 AND user_id = $2', [
      profileIdNum,
      userIdNum,
    ])

    if (profile.rows[0].is_active) {
      const nextProfile = await pool.query(
        'SELECT id FROM user_profiles WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
        [userIdNum]
      )
      if (nextProfile.rows[0]) {
        await pool.query('UPDATE user_profiles SET is_active = true WHERE id = $1', [
          nextProfile.rows[0].id,
        ])
      }
    }

    res.json({ message: 'Perfil deletado com sucesso' })
  } catch (err) {
    logger.error('Erro ao deletar perfil', { error: err.message })
    res.status(500).json({ error: 'Erro interno no servidor' })
  }
})

app.post('/api/user/:userId/profiles/:profileId/activate', authMiddleware, async (req, res) => {
  try {
    const { userId, profileId } = req.params
    const userIdNum = parseInt(userId)
    const profileIdNum = parseInt(profileId)

    if (isNaN(userIdNum) || isNaN(profileIdNum)) {
      return res.status(400).json({ error: 'IDs devem ser números válidos' })
    }

    const profile = await pool.query('SELECT * FROM user_profiles WHERE id = $1 AND user_id = $2', [
      profileIdNum,
      userIdNum,
    ])

    if (!profile.rows[0]) {
      return res.status(404).json({ error: 'Perfil não encontrado' })
    }

    await pool.query('UPDATE user_profiles SET is_active = false WHERE user_id = $1', [userIdNum])
    const result = await pool.query(
      'UPDATE user_profiles SET is_active = true, updated_at = NOW() WHERE id = $1 AND user_id = $2 RETURNING *',
      [profileIdNum, userIdNum]
    )

    res.json(result.rows[0])
  } catch (err) {
    logger.error('Erro ao ativar perfil', { error: err.message })
    res.status(500).json({ error: 'Erro interno no servidor' })
  }
})

app.get('/api/cognitive-profiles', authMiddleware, async (req, res) => {
  try {
    const { user_id, game_id, limit } = req.query
    let query = 'SELECT * FROM cognitive_profiles WHERE 1=1'
    let params = []
    let paramIndex = 1

    if (user_id) {
      query += ` AND user_id = $${paramIndex}`
      params.push(parseInt(user_id))
      paramIndex++
    }
    if (game_id) {
      query += ` AND game_id = $${paramIndex}`
      params.push(game_id)
      paramIndex++
    }

    query += ' ORDER BY last_updated DESC'
    if (limit && !isNaN(parseInt(limit)) && parseInt(limit) > 0) {
      query += ` LIMIT $${paramIndex}`
      params.push(parseInt(limit))
    }

    const result = await pool.query(query, params)
    res.json(result.rows)
  } catch (err) {
    logger.error('Erro ao buscar perfis cognitivos', { error: err.message })
    res.status(500).json({ error: 'Erro interno no servidor' })
  }
})

const cognitiveProfileSchema = z.object({
  user_id: z.number(),
  processing_speed: z.number().optional(),
  attention_span: z.number().optional(),
  working_memory: z.number().optional(),
  pattern_recognition: z.number().optional(),
  visual_learner_score: z.number().optional(),
  auditory_learner_score: z.number().optional(),
  kinesthetic_learner_score: z.number().optional(),
  memory_preference: z.enum(['WEAK', 'MEDIUM', 'STRONG']).optional(),
  logic_preference: z.enum(['WEAK', 'MEDIUM', 'STRONG']).optional(),
  creativity_preference: z.enum(['WEAK', 'MEDIUM', 'STRONG']).optional(),
  numbers_preference: z.enum(['WEAK', 'MEDIUM', 'STRONG']).optional(),
  colors_preference: z.enum(['WEAK', 'MEDIUM', 'STRONG']).optional(),
})

app.post(
  '/api/cognitive-profiles',
  authMiddleware,
  validateInput(cognitiveProfileSchema),
  async (req, res) => {
    try {
      const {
        user_id,
        processing_speed,
        attention_span,
        working_memory,
        pattern_recognition,
        visual_learner_score,
        auditory_learner_score,
        kinesthetic_learner_score,
        memory_preference,
        logic_preference,
        creativity_preference,
        numbers_preference,
        colors_preference,
      } = req.body

      const result = await pool.query(
        `INSERT INTO cognitive_profiles 
       (user_id, processing_speed, attention_span, working_memory, pattern_recognition,
        visual_learner_score, auditory_learner_score, kinesthetic_learner_score,
        memory_preference, logic_preference, creativity_preference, numbers_preference, colors_preference)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       ON CONFLICT (user_id) DO UPDATE SET
         processing_speed = COALESCE(EXCLUDED.processing_speed, cognitive_profiles.processing_speed),
         attention_span = COALESCE(EXCLUDED.attention_span, cognitive_profiles.attention_span),
         working_memory = COALESCE(EXCLUDED.working_memory, cognitive_profiles.working_memory),
         pattern_recognition = COALESCE(EXCLUDED.pattern_recognition, cognitive_profiles.pattern_recognition),
         visual_learner_score = COALESCE(EXCLUDED.visual_learner_score, cognitive_profiles.visual_learner_score),
         auditory_learner_score = COALESCE(EXCLUDED.auditory_learner_score, cognitive_profiles.auditory_learner_score),
         kinesthetic_learner_score = COALESCE(EXCLUDED.kinesthetic_learner_score, cognitive_profiles.kinesthetic_learner_score),
         memory_preference = COALESCE(EXCLUDED.memory_preference, cognitive_profiles.memory_preference),
         logic_preference = COALESCE(EXCLUDED.logic_preference, cognitive_profiles.logic_preference),
         creativity_preference = COALESCE(EXCLUDED.creativity_preference, cognitive_profiles.creativity_preference),
         numbers_preference = COALESCE(EXCLUDED.numbers_preference, cognitive_profiles.numbers_preference),
         colors_preference = COALESCE(EXCLUDED.colors_preference, cognitive_profiles.colors_preference),
         last_updated = CURRENT_TIMESTAMP
       RETURNING *`,
        [
          parseInt(user_id),
          processing_speed ?? 65.0, // Cloud Nandrophic: Autism therapy baseline
          attention_span ?? 45.0, // Shorter attention spans for autism
          working_memory ?? 55.0, // Adjusted for autism cognitive patterns
          pattern_recognition ?? 70.0, // Often strong in autism
          visual_learner_score ?? 75.0, // Visual learning preference in autism
          auditory_learner_score ?? 40.0, // Often challenging in autism
          kinesthetic_learner_score ?? 60.0, // Tactile learning support
          memory_preference ?? 'STRONG', // Often strong in autism
          logic_preference ?? 'STRONG', // Logical thinking patterns
          creativity_preference ?? 'MEDIUM', // Balanced creative expression
          numbers_preference ?? 'STRONG', // Often mathematical aptitude
          colors_preference ?? 'MEDIUM', // Sensory considerations
        ]
      )

      res.status(201).json(result.rows[0])
    } catch (err) {
      logger.error('Erro ao criar perfil cognitivo', { error: err.message })
      res.status(500).json({ error: 'Erro interno no servidor' })
    }
  }
)

app.get('/api/ml-features', authMiddleware, async (req, res) => {
  try {
    const { user_id, session_id, limit } = req.query
    let query = 'SELECT * FROM ml_features WHERE 1=1'
    let params = []
    let paramIndex = 1

    if (user_id) {
      query += ` AND user_id = $${paramIndex}`
      params.push(parseInt(user_id))
      paramIndex++
    }
    if (session_id) {
      query += ` AND session_id = $${paramIndex}`
      params.push(parseInt(session_id))
      paramIndex++
    }

    query += ' ORDER BY extracted_at DESC'
    if (limit && !isNaN(parseInt(limit)) && parseInt(limit) > 0) {
      query += ` LIMIT $${paramIndex}`
      params.push(parseInt(limit))
    }

    const result = await pool.query(query, params)
    res.json(result.rows)
  } catch (err) {
    logger.error('Erro ao buscar features de ML', { error: err.message })
    res.status(500).json({ error: 'Erro interno no servidor' })
  }
})

app.get('/api/neuropedagogical-insights', authMiddleware, async (req, res) => {
  try {
    const { user_id, timeframe, limit } = req.query
    let query = `
      SELECT 
        gs.user_id,
        COUNT(gs.id) as total_sessions,
        AVG(gs.score) as avg_score,
        AVG(gs.accuracy) as avg_accuracy,
        AVG(gs.time_spent) as avg_time_spent,
        AVG(cp.processing_speed) as avg_processing_speed,
        AVG(cp.attention_span) as avg_attention_span,
        AVG(cp.working_memory) as avg_working_memory,
        AVG(cp.pattern_recognition) as avg_pattern_recognition,
        AVG(cp.visual_learner_score) as avg_visual_processing,
        AVG(cp.auditory_learner_score) as avg_auditory_processing,
        AVG(cp.kinesthetic_learner_score) as avg_kinesthetic_processing,
        MAX(gs.created_at) as last_session_date
      FROM game_sessions gs
      LEFT JOIN cognitive_profiles cp ON gs.user_id = cp.user_id
      WHERE 1=1
    `
    let params = []
    let paramIndex = 1

    if (user_id) {
      query += ` AND gs.user_id = $${paramIndex}`
      params.push(parseInt(user_id))
      paramIndex++
    }

    if (timeframe) {
      const timeInterval =
        {
          '7d': '7 days',
          '30d': '30 days',
          '90d': '90 days',
          '1y': '1 year',
        }[timeframe] || '30 days'
      query += ` AND gs.created_at >= NOW() - INTERVAL '${timeInterval}'`
    }

    query += ' GROUP BY gs.user_id ORDER BY gs.user_id'
    if (limit && !isNaN(parseInt(limit)) && parseInt(limit) > 0) {
      query += ` LIMIT $${paramIndex}`
      params.push(parseInt(limit))
    }

    const result = await pool.query(query, params)
    const insights = result.rows.map((row) => ({
      ...row,
      performance_trend: calculatePerformanceTrend(row),
      learning_style: determineLearningStyle(row),
      recommendations: generateRecommendations(row),
    }))

    res.json(insights)
  } catch (err) {
    logger.error('Erro ao buscar insights neuropedagogicos', { error: err.message })
    res.status(500).json({ error: 'Erro interno no servidor' })
  }
})

app.get('/api/learning-patterns', authMiddleware, async (req, res) => {
  try {
    const { user_id, pattern_type, limit } = req.query
    let query = 'SELECT * FROM learning_patterns WHERE 1=1'
    let params = []
    let paramIndex = 1

    if (user_id) {
      query += ` AND user_id = $${paramIndex}`
      params.push(parseInt(user_id))
      paramIndex++
    }
    if (pattern_type) {
      query += ` AND pattern_type = $${paramIndex}`
      params.push(pattern_type)
      paramIndex++
    }

    query += ' ORDER BY strength_score DESC, detected_at DESC'
    if (limit && !isNaN(parseInt(limit)) && parseInt(limit) > 0) {
      query += ` LIMIT $${paramIndex}`
      params.push(parseInt(limit))
    }

    const result = await pool.query(query, params)
    res.json(result.rows)
  } catch (err) {
    logger.error('Erro ao buscar padrões de aprendizagem', { error: err.message })
    res.status(500).json({ error: 'Erro interno no servidor' })
  }
})

app.get('/api/engagement-metrics', authMiddleware, async (req, res) => {
  try {
    const { user_id, session_id, limit } = req.query
    let query = 'SELECT * FROM engagement_metrics WHERE 1=1'
    let params = []
    let paramIndex = 1

    if (user_id) {
      query += ` AND user_id = $${paramIndex}`
      params.push(parseInt(user_id))
      paramIndex++
    }
    if (session_id) {
      query += ` AND session_id = $${paramIndex}`
      params.push(parseInt(session_id))
      paramIndex++
    }

    query += ' ORDER BY calculated_at DESC'
    if (limit && !isNaN(parseInt(limit)) && parseInt(limit) > 0) {
      query += ` LIMIT $${paramIndex}`
      params.push(parseInt(limit))
    }

    const result = await pool.query(query, params)
    res.json(result.rows)
  } catch (err) {
    logger.error('Erro ao buscar métricas de engajamento', { error: err.message })
    res.status(500).json({ error: 'Erro interno no servidor' })
  }
})

app.get('/api/neuroplasticity-tracking', authMiddleware, async (req, res) => {
  try {
    const { user_id, cognitive_domain, limit } = req.query
    let query = 'SELECT * FROM neuroplasticity_tracking WHERE 1=1'
    let params = []
    let paramIndex = 1

    if (user_id) {
      query += ` AND user_id = $${paramIndex}`
      params.push(parseInt(user_id))
      paramIndex++
    }
    if (cognitive_domain) {
      query += ` AND cognitive_domain = $${paramIndex}`
      params.push(cognitive_domain)
      paramIndex++
    }

    query += ' ORDER BY calculated_at DESC'
    if (limit && !isNaN(parseInt(limit)) && parseInt(limit) > 0) {
      query += ` LIMIT $${paramIndex}`
      params.push(parseInt(limit))
    }

    const result = await pool.query(query, params)
    res.json(result.rows)
  } catch (err) {
    logger.error('Erro ao buscar tracking de neuroplasticidade', { error: err.message })
    res.status(500).json({ error: 'Erro interno no servidor' })
  }
})

app.get('/api/dashboard-metrics/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params
    const { timeframe } = req.query
    const userIdNum = parseInt(userId)
    if (isNaN(userIdNum)) {
      return res.status(400).json({ error: 'ID do usuário deve ser um número válido' })
    }

    const timeInterval =
      {
        '7d': '7 days',
        '30d': '30 days',
        '90d': '90 days',
        '1y': '1 year',
      }[timeframe] || '30 days'

    const [
      sessionsResult,
      cognitiveResult,
      engagementResult,
      patternsResult,
      neuroplasticityResult,
    ] = await Promise.all([
      pool.query(
        `SELECT 
          COUNT(*) as total_sessions,
          AVG(score) as avg_score,
          AVG(accuracy) as avg_accuracy,
          AVG(time_spent) as avg_time_spent,
          game_id,
          COUNT(*) as session_count
        FROM game_sessions 
        WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '${timeInterval}'
        GROUP BY game_id
        ORDER BY session_count DESC`,
        [userIdNum]
      ),
      pool.query(
        `SELECT 
          AVG(processing_speed) as avg_processing_speed,
          AVG(attention_span) as avg_attention_span,
          AVG(working_memory) as avg_working_memory,
          AVG(pattern_recognition) as avg_pattern_recognition,
          AVG(visual_learner_score) as avg_visual_processing,
          AVG(auditory_learner_score) as avg_auditory_processing,
          AVG(kinesthetic_learner_score) as avg_kinesthetic_processing
        FROM cognitive_profiles
        WHERE user_id = $1 AND last_updated >= NOW() - INTERVAL '${timeInterval}'`,
        [userIdNum]
      ),
      pool.query(
        `SELECT 
          AVG(flow_state_duration) as avg_flow_state_duration,
          AVG(total_interactions) as avg_total_interactions,
          AVG(attention_drops) as avg_attention_drops
        FROM engagement_metrics
        WHERE user_id = $1 AND calculated_at >= NOW() - INTERVAL '${timeInterval}'`,
        [userIdNum]
      ),
      pool.query(
        `SELECT pattern_type, COUNT(*) as pattern_count, AVG(strength_score) as avg_confidence
        FROM learning_patterns
        WHERE user_id = $1 AND detected_at >= NOW() - INTERVAL '${timeInterval}'
        GROUP BY pattern_type
        ORDER BY avg_confidence DESC`,
        [userIdNum]
      ),
      pool.query(
        `SELECT 
          cognitive_domain,
          AVG(baseline_score) as avg_baseline,
          AVG(current_score) as avg_current,
          AVG(improvement_rate) as avg_improvement
        FROM neuroplasticity_tracking
        WHERE user_id = $1 AND calculated_at >= NOW() - INTERVAL '${timeInterval}'
        GROUP BY cognitive_domain`,
        [userIdNum]
      ),
    ])

    const dashboardData = {
      timeframe,
      user_id: userIdNum,
      game_sessions: sessionsResult.rows,
      cognitive_profile: cognitiveResult.rows[0] || {},
      engagement_metrics: engagementResult.rows[0] || {},
      learning_patterns: patternsResult.rows,
      neuroplasticity_tracking: neuroplasticityResult.rows,
      summary: {
        total_sessions: sessionsResult.rows.reduce(
          (sum, row) => sum + parseInt(row.total_sessions || 0),
          0
        ),
        avg_score:
          sessionsResult.rows.reduce((sum, row) => sum + parseFloat(row.avg_score || 0), 0) /
          (sessionsResult.rows.length || 1),
        most_played_game: sessionsResult.rows[0]?.game_id || 'N/A',
        learning_style: determineLearningStyle(cognitiveResult.rows[0] || {}),
        engagement_level: calculateEngagementLevel(engagementResult.rows[0] || {}),
      },
    }

    res.json(dashboardData)
  } catch (err) {
    logger.error('Erro ao buscar métricas do dashboard', { error: err.message })
    res.status(500).json({ error: 'Erro interno no servidor' })
  }
})

// 404 handler - deve vir por último (após todas as definições de rotas)
app.use('*', (req, res) => {
  logger.warn('Rota não encontrada', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  })

  res.status(404).json({
    error: 'Rota não encontrada',
    method: req.method,
    path: req.url,
    timestamp: new Date().toISOString(),
    availableEndpoints: [
      'GET /api/health',
      'POST /api/auth/anonymous',
      'GET /api/auth/verify',
      'GET /api/user/:id',
      'POST /api/user',
      'GET /api/user/:id/game-sessions',
      'POST /api/game-session',
      'GET /api/user/:id/profiles',
      'POST /api/user/:id/profiles',
      'PUT /api/user/:userId/profiles/:profileId',
      'DELETE /api/user/:userId/profiles/:profileId',
      'POST /api/user/:userId/profiles/:profileId/activate',
      'GET /api/cognitive-profiles',
      'POST /api/cognitive-profiles',
      'GET /api/ml-features',
      'GET /api/neuropedagogical-insights',
      'GET /api/learning-patterns',
      'GET /api/engagement-metrics',
      'GET /api/neuroplasticity-tracking',
      'GET /api/dashboard-metrics/:userId',
      'GET /api/adaptive-parameters/:gameId/:difficulty',
    ],
  })
})

function calculatePerformanceTrend(data) {
  const score = parseFloat(data.avg_score || 0)
  const accuracy = parseFloat(data.avg_accuracy || 0)
  if (score >= 80 && accuracy >= 85) return 'improving'
  if (score >= 60 && accuracy >= 70) return 'stable'
  return 'needs_attention'
}

function determineLearningStyle(data) {
  const visual = parseFloat(data.avg_visual_processing || 0)
  const auditory = parseFloat(data.avg_auditory_processing || 0)
  const kinesthetic = parseFloat(data.avg_kinesthetic_processing || 0)
  const max = Math.max(visual, auditory, kinesthetic)
  if (max === visual) return 'visual'
  if (max === auditory) return 'auditory'
  if (max === kinesthetic) return 'kinesthetic'
  return 'mixed'
}

function generateRecommendations(data) {
  const recommendations = []
  if (parseFloat(data.avg_attention_span || 0) < 50) {
    recommendations.push('Foque em atividades que desenvolvam a atenção sustentada')
  }
  if (parseFloat(data.avg_working_memory || 0) < 50) {
    recommendations.push('Incorpore exercícios de memória de trabalho')
  }
  if (parseFloat(data.avg_processing_speed || 0) < 50) {
    recommendations.push('Pratique atividades que melhorem a velocidade de processamento')
  }
  return recommendations
}

function calculateEngagementLevel(data) {
  const flow = parseFloat(data.avg_flow_state_duration || 0)
  const interactions = parseFloat(data.avg_total_interactions || 0)
  const attentionDrops = parseFloat(data.avg_attention_drops || 0)
  const score = (flow + interactions - attentionDrops) / 3
  if (score >= 75) return 'high'
  if (score >= 50) return 'medium'
  return 'low'
}

// Graceful shutdown handler
let server

const gracefulShutdown = async (signal) => {
  logger.info(`Recebido sinal ${signal}, iniciando encerramento gracioso...`)

  if (server) {
    server.close(async () => {
      logger.info('Servidor HTTP encerrado')

      try {
        await pool.end()
        logger.info('Pool do PostgreSQL encerrado')
      } catch (err) {
        logger.error('Erro ao encerrar pool do PostgreSQL', { error: err.message })
      }

      logger.info('Encerramento gracioso concluído')
      process.exit(0)
    })

    // Force close after 30 seconds
    setTimeout(() => {
      logger.error('Forçando encerramento após timeout')
      process.exit(1)
    }, 30000)
  } else {
    process.exit(0)
  }
}

// Enhanced server startup
connectWithRetry()
  .then(() => initializeOptionalMiddleware())
  .then(() => {
    server = app.listen(PORT, env.API_HOST, () => {
      logger.info(`🚀 Portal Betina API iniciada com sucesso!`, {
        port: PORT,
        host: env.API_HOST,
        environment: env.NODE_ENV,
        version: env.VITE_APP_VERSION,
        features: {
          compression: env.ENABLE_COMPRESSION,
          cache: env.ENABLE_CACHE,
          metrics: env.ENABLE_METRICS,
          security: env.SECURITY_HEADERS_ENABLED,
          helmet: env.HELMET_ENABLED,
        },
        database: {
          host: env.DB_HOST,
          port: env.DB_PORT,
          name: env.DB_NAME,
          ssl: env.NODE_ENV === 'production',
        },
      })

      // Log available endpoints
      logger.info('Endpoints disponíveis:', {
        health: `http://${env.API_HOST}:${PORT}/api/health`,
        auth: `http://${env.API_HOST}:${PORT}/api/auth/*`,
        users: `http://${env.API_HOST}:${PORT}/api/user/*`,
        sessions: `http://${env.API_HOST}:${PORT}/api/game-session`,
        profiles: `http://${env.API_HOST}:${PORT}/api/cognitive-profiles`,
        insights: `http://${env.API_HOST}:${PORT}/api/neuropedagogical-insights`,
        metrics: env.ENABLE_METRICS ? `http://${env.API_HOST}:${PORT}/api/metrics` : 'Desabilitado',
      })
    })

    server.on('error', (error) => {
      logger.error('Erro no servidor', { error: error.message })
      if (error.code === 'EADDRINUSE') {
        logger.error(`Porta ${PORT} já está em uso`)
      }
      process.exit(1)
    })
  })
  .catch((error) => {
    logger.error('Falha ao inicializar o servidor', { error: error.message })
    process.exit(1)
  })

// Signal handlers
process.on('SIGINT', () => gracefulShutdown('SIGINT'))
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2')) // PM2 reload

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Exceção não capturada', {
    error: err.message,
    stack: err.stack,
  })
  gracefulShutdown('uncaughtException')
})

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Promise rejeitada não tratada', {
    reason: reason,
    promise: promise,
  })
  gracefulShutdown('unhandledRejection')
})
