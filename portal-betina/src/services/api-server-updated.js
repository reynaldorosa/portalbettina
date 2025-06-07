// Servidor de API simples para o Portal Betina
import express from 'express';
import cors from 'cors';
import pg from 'pg';
import { validateInput, sanitizeInputMiddleware, userSchema, gameSessionSchema } from './middleware/validateInput.js';

const { Pool } = pg;

const app = express();
const PORT = process.env.API_PORT || 3000;

// Configuração do banco PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'betina_db',
  user: process.env.DB_USER || 'betina_user',
  password: process.env.DB_PASSWORD || 'betina_password',
});

// Testar conexão com o banco
pool.connect()
  .then(() => {
    console.log('✅ Conectado ao PostgreSQL com sucesso!');
    console.log(`📊 Banco: ${process.env.DB_NAME} em ${process.env.DB_HOST}:${process.env.DB_PORT}`);
  })
  .catch(err => {
    console.error('❌ Erro ao conectar com PostgreSQL:', err.message);
  });

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Aplicar sanitização a todas as requisições
app.use(sanitizeInputMiddleware);

// Log de requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Middleware de segurança para limitar tamanho de payload
app.use(express.json({ limit: '1mb' }));

// Middleware para tratar erros de JSON malformados
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'JSON inválido' });
  }
  next();
});

// Função para criar perfil padrão para um usuário no banco
const createDefaultProfile = async (userId) => {
  try {
    await pool.query(
      'INSERT INTO user_profiles (user_id, profile_name, is_active) VALUES ($1, $2, $3)',
      [userId, 'Perfil Padrão', true]
    );
  } catch (err) {
    console.error('Erro ao criar perfil padrão:', err);
  }
};

// Rota de health check
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      status: 'connected',
      timestamp: result.rows[0].now,
      message: 'API está operacional'
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Erro ao conectar com o banco de dados'
    });
  }
});

// Rota para obter usuário por ID ou username
app.get('/api/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar se o ID é numérico
    const isNumeric = /^\d+$/.test(id);
    
    let result;
    if (isNumeric) {
      // Buscar por ID numérico
      result = await pool.query('SELECT * FROM users WHERE id = $1', [parseInt(id)]);
    } else {
      // Buscar por username
      result = await pool.query('SELECT * FROM users WHERE username = $1', [id]);
    }
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    return res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao buscar usuário:', err);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

// Rota para criar novo usuário
app.post('/api/user', validateInput(userSchema), async (req, res) => {
  try {
    const { username, displayName } = req.body;
    
    // Verificar se usuário já existe
    const existingUser = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'Nome de usuário já está em uso' });
    }
    
    // Criar novo usuário
    const newUser = await pool.query(
      'INSERT INTO users (username, display_name) VALUES ($1, $2) RETURNING *',
      [username, displayName || username]
    );
    
    // Criar perfil padrão para o usuário
    await createDefaultProfile(newUser.rows[0].id);
    
    return res.status(201).json(newUser.rows[0]);
  } catch (err) {
    console.error('Erro ao criar usuário:', err);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

// Rota para salvar sessão de jogo
app.post('/api/game-session', validateInput(gameSessionSchema), async (req, res) => {
  try {
    const { userId, gameId, difficulty, score, accuracy, timeSpent, data } = req.body;
    
    // Verificar se usuário existe
    const userExists = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (userExists.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    // Calcular valores
    const attempts = data?.attempts || 0;
    const successes = data?.successes || 0;
    const finalAccuracy = accuracy || (attempts > 0 ? Math.round((successes / attempts) * 100) : 0);
    
    // Salvar sessão de jogo
    const result = await pool.query(
      `INSERT INTO game_sessions 
       (user_id, game_id, difficulty, score, accuracy, time_spent, correct_answers, total_attempts, data)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [userId, gameId, difficulty, score || 0, finalAccuracy, timeSpent || 0, successes, attempts, data || {}]
    );
    
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao salvar sessão de jogo:', err);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 API rodando na porta ${PORT}`);
});
