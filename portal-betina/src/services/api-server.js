// Servidor de API simples para o Portal Betina
import express from 'express';
import cors from 'cors';
import pg from 'pg';

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

// Log de requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Função para criar perfil padrão para um usuário no banco
async function createDefaultProfile(userId) {
  try {
    const checkResult = await pool.query(
      'SELECT id FROM user_profiles WHERE user_id = $1',
      [userId]
    );
    
    if (checkResult.rows.length === 0) {      const result = await pool.query(
        `INSERT INTO user_profiles (user_id, profile_name, profile_icon, profile_color, age_range, special_needs, preferences, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [userId, 'Usuário', '👤', '#4A90E2', '6-8', [], { difficulty: 'medium' }, true]
      );
      console.log(`✅ Perfil padrão criado no banco para usuário ${userId}`);
      return result.rows[0];
    }
    return checkResult.rows[0];
  } catch (error) {
    console.error('❌ Erro ao criar perfil padrão:', error.message);
    throw error;
  }
}

// Rotas de API
app.get('/api/health', async (req, res) => {
  try {
    // Testar conexão com banco
    const result = await pool.query('SELECT NOW()');
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'Portal Betina API',
      version: '1.0.0',
      database: 'connected',
      db_time: result.rows[0].now
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      service: 'Portal Betina API',
      version: '1.0.0',
      database: 'disconnected',
      error: error.message
    });
  }
});

// Rota para dados do usuário
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
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error.message);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para criar usuário
app.post('/api/user', async (req, res) => {
  try {
    const { is_anonymous } = req.body;
    
    const result = await pool.query('SELECT create_anonymous_user()');
    const newUserId = result.rows[0].create_anonymous_user;
    
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [newUserId]);
    const newUser = userResult.rows[0];
    
    console.log('✅ Usuário criado no banco:', newUser);
    res.json(newUser);
  } catch (error) {
    console.error('❌ Erro ao criar usuário:', error.message);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});

// Rota para atualizar preferências do usuário
app.put('/api/user/:id/preferences', async (req, res) => {
  try {
    const { id } = req.params;
    const preferences = req.body;
    
    await pool.query(
      'UPDATE users SET preferences = $1 WHERE id = $2',
      [JSON.stringify(preferences), id]
    );
    
    console.log(`✅ Preferências atualizadas para usuário ${id}:`, preferences);
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Erro ao atualizar preferências:', error.message);
    res.status(500).json({ error: 'Erro ao atualizar preferências' });
  }
});

// Rota para configurações de acessibilidade
app.get('/api/user/:id/accessibility', (req, res) => {
  const { id } = req.params;
  
  // Retornar configurações padrão
  res.json({
    fontSize: 'medium',
    contrast: 'normal',
    audioEnabled: true,
    animations: true
  });
});

app.put('/api/user/:id/accessibility', (req, res) => {
  const { id } = req.params;
  const settings = req.body;
  
  console.log(`Configurações de acessibilidade atualizadas para usuário ${id}:`, settings);
  res.json({ success: true });
});

// Rota para sessões de jogo
app.post('/api/game-session', async (req, res) => {
  try {
    const session = req.body;
    const { user_id } = session;
    
    console.log('=== API: Salvando sessão de jogo ===');
    console.log('Dados recebidos:', session);
    
    // Obter perfil ativo do usuário para associar à sessão
    let activeProfileId = null;
    if (user_id) {
      const profileResult = await pool.query(
        'SELECT id FROM user_profiles WHERE user_id = $1 AND is_active = true',
        [user_id]
      );
      activeProfileId = profileResult.rows.length > 0 ? profileResult.rows[0].id : null;
    }
    
    // Salvar sessão no banco
    const result = await pool.query(
      `INSERT INTO game_sessions (user_id, game_id, difficulty, score, accuracy, time_spent, completed, correct_answers, total_attempts, data)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        user_id || null,
        session.game_id || 'unknown',
        session.difficulty || 'medium',
        session.score || 0,
        session.accuracy || 0,
        session.time_spent || 0,
        session.completed !== undefined ? session.completed : true,
        session.correct_answers || 0,
        session.total_attempts || 0,
        JSON.stringify({ profile_id: activeProfileId, ...session.data })
      ]
    );
    
    const savedSession = result.rows[0];
    console.log('✅ Sessão de jogo salva no banco:', savedSession);
    res.json(savedSession);
  } catch (error) {
    console.error('❌ Erro ao salvar sessão de jogo:', error.message);
    res.status(500).json({ error: 'Erro ao salvar sessão de jogo' });
  }
});

// ============== PERFIS DE USUÁRIO (PRIVADOS) ==============

// Obter todos os perfis de um usuário específico
// ============== ROTAS DE PERFIS DE USUÁRIO ==============
app.get('/api/user/:userId/profiles', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Buscar perfis no banco de dados
    const result = await pool.query(
      'SELECT * FROM user_profiles WHERE user_id = $1 ORDER BY created_at',
      [userId]
    );
    
    // Se não há perfis, criar perfil padrão
    if (result.rows.length === 0) {
      await createDefaultProfile(userId);
      const newResult = await pool.query(
        'SELECT * FROM user_profiles WHERE user_id = $1 ORDER BY created_at',
        [userId]
      );
      console.log(`✅ Perfis encontrados para usuário ${userId}:`, newResult.rows.length);
      return res.json(newResult.rows);
    }
    
    console.log(`✅ Perfis encontrados para usuário ${userId}:`, result.rows.length);
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Erro ao buscar perfis:', error.message);
    res.status(500).json({ error: 'Erro ao buscar perfis' });
  }
});

// Criar novo perfil para um usuário específico
app.post('/api/user/:userId/profiles', async (req, res) => {
  try {
    const { userId } = req.params;
    const { profile_name, profile_icon, profile_color, age_range, special_needs, preferences } = req.body;
    
    console.log(`=== API: Criando perfil para usuário ${userId} ===`);
    console.log('Dados recebidos:', req.body);
    
    // Validação básica
    if (!profile_name || profile_name.trim() === '') {
      console.error('Nome do perfil é obrigatório');
      return res.status(400).json({ error: 'Nome do perfil é obrigatório' });
    }
    
    // Inserir novo perfil no banco
    const result = await pool.query(
      `INSERT INTO user_profiles (user_id, profile_name, profile_icon, profile_color, age_range, special_needs, preferences, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        userId,
        profile_name.trim(),
        profile_icon || '👤',
        profile_color || '#4A90E2',
        age_range || null,
        special_needs || [],
        JSON.stringify(preferences || {}),
        false // Novo perfil não é ativo por padrão
      ]
    );
    
    const newProfile = result.rows[0];
    console.log(`✅ Novo perfil criado no banco para usuário ${userId}:`, newProfile);
    res.json(newProfile);
  } catch (error) {
    console.error('❌ Erro ao criar perfil:', error.message);
    res.status(500).json({ error: 'Erro ao criar perfil' });
  }
});

// Atualizar perfil específico de um usuário
app.put('/api/user/:userId/profiles/:profileId', async (req, res) => {
  try {
    const { userId, profileId } = req.params;
    const updates = req.body;
    
    console.log(`=== API: Atualizando perfil ${profileId} para usuário ${userId} ===`);
    console.log('Updates recebidos:', updates);
    
    // Preparar campos para atualização
    const fields = [];
    const values = [];
    let paramIndex = 1;
    
    if (updates.profile_name !== undefined) {
      fields.push(`profile_name = $${paramIndex++}`);
      values.push(updates.profile_name);
    }
    if (updates.profile_icon !== undefined) {
      fields.push(`profile_icon = $${paramIndex++}`);
      values.push(updates.profile_icon);
    }
    if (updates.profile_color !== undefined) {
      fields.push(`profile_color = $${paramIndex++}`);
      values.push(updates.profile_color);
    }
    if (updates.age_range !== undefined) {
      fields.push(`age_range = $${paramIndex++}`);
      values.push(updates.age_range);
    }
    if (updates.special_needs !== undefined) {
      fields.push(`special_needs = $${paramIndex++}`);
      values.push(updates.special_needs);
    }
    if (updates.preferences !== undefined) {
      fields.push(`preferences = $${paramIndex++}`);
      values.push(JSON.stringify(updates.preferences));
    }
    if (updates.is_active !== undefined) {
      fields.push(`is_active = $${paramIndex++}`);
      values.push(updates.is_active);
    }
    
    fields.push(`updated_at = $${paramIndex++}`);
    values.push(new Date().toISOString());
    
    // Adicionar WHERE conditions
    values.push(profileId, userId);
    
    const query = `
      UPDATE user_profiles 
      SET ${fields.join(', ')} 
      WHERE id = $${paramIndex++} AND user_id = $${paramIndex++} 
      RETURNING *
    `;
    
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      console.error(`Perfil ${profileId} não encontrado para usuário ${userId}`);
      return res.status(404).json({ error: 'Perfil não encontrado' });
    }
    
    const updatedProfile = result.rows[0];
    console.log(`✅ Perfil ${profileId} atualizado no banco para usuário ${userId}:`, updatedProfile);
    res.json(updatedProfile);
  } catch (error) {
    console.error('❌ Erro ao atualizar perfil:', error.message);
    res.status(500).json({ error: 'Erro ao atualizar perfil' });
  }
});

// Deletar perfil específico de um usuário
app.delete('/api/user/:userId/profiles/:profileId', async (req, res) => {
  try {
    const { userId, profileId } = req.params;
    
    console.log(`=== API: Deletando perfil ${profileId} para usuário ${userId} ===`);
      // Verificar quantos perfis o usuário possui
    const profileCountResult = await pool.query(
      'SELECT COUNT(*) as count FROM user_profiles WHERE user_id = $1',
      [userId]
    );
    
    const profileCount = parseInt(profileCountResult.rows[0].count);
    
    // Removida verificação que impedia deleção do único perfil
    console.log(`ℹ️ Deletando perfil ${profileId} (total de perfis: ${profileCount})`);
    
    // Verificar se o perfil existe
    const profileResult = await pool.query(
      'SELECT * FROM user_profiles WHERE id = $1 AND user_id = $2',
      [profileId, userId]
    );
    
    if (profileResult.rows.length === 0) {
      console.error(`Perfil ${profileId} não encontrado para usuário ${userId}`);
      return res.status(404).json({ error: 'Perfil não encontrado' });
    }
    
    const deletedProfile = profileResult.rows[0];
    
    // Deletar sessões de jogo associadas ao perfil
    await pool.query(
      'DELETE FROM game_sessions WHERE user_id = $1',
      [userId]
    );
    console.log(`Sessões de jogo removidas para usuário ${userId}`);
    
    // Deletar o perfil
    await pool.query(
      'DELETE FROM user_profiles WHERE id = $1 AND user_id = $2',
      [profileId, userId]
    );
      // Verificar se existem outros perfis para ativar
    if (deletedProfile.is_active) {
      const remainingProfiles = await pool.query(
        'SELECT * FROM user_profiles WHERE user_id = $1 AND id != $2 ORDER BY created_at LIMIT 1',
        [userId, profileId]
      );
      
      if (remainingProfiles.rows.length > 0) {
        await pool.query(
          'UPDATE user_profiles SET is_active = true WHERE id = $1',
          [remainingProfiles.rows[0].id]
        );
        console.log(`✅ Perfil ${remainingProfiles.rows[0].profile_name} ativado automaticamente`);
      }
    }
    
    console.log(`✅ Perfil ${profileId} deletado do banco para usuário ${userId}`);
    res.json({ success: true, deletedProfile });} catch (error) {
    console.error('❌ Erro ao deletar perfil:', error.message);
    res.status(500).json({ error: 'Erro ao deletar perfil' });
  }
});

// Ativar perfil específico (desativa todos os outros do mesmo usuário)
app.post('/api/user/:userId/profiles/:profileId/activate', async (req, res) => {
  try {
    const { userId, profileId } = req.params;
    
    console.log(`=== API: Ativando perfil ${profileId} para usuário ${userId} ===`);
    
    // Desativar todos os perfis do usuário
    await pool.query(
      'UPDATE user_profiles SET is_active = false WHERE user_id = $1',
      [userId]
    );
    
    // Ativar o perfil específico
    const result = await pool.query(
      'UPDATE user_profiles SET is_active = true, updated_at = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
      [new Date().toISOString(), profileId, userId]
    );
    
    if (result.rows.length === 0) {
      console.error(`Perfil ${profileId} não encontrado para usuário ${userId}`);
      return res.status(404).json({ error: 'Perfil não encontrado' });
    }
    
    console.log(`✅ Perfil ${profileId} ativado no banco para usuário ${userId}`);
    res.json({ 
      success: true, 
      message: 'Perfil ativado com sucesso',
      activeProfile: result.rows[0]
    });
  } catch (error) {
    console.error('❌ Erro ao ativar perfil:', error.message);
    res.status(500).json({ error: 'Erro ao ativar perfil' });
  }
});

// Obter perfil ativo de um usuário
app.get('/api/user/:userId/active-profile', async (req, res) => {
  try {
    const { userId } = req.params;
    
    console.log(`=== API: Buscando perfil ativo para usuário ${userId} ===`);
    
    const result = await pool.query(
      'SELECT * FROM user_profiles WHERE user_id = $1 AND is_active = true',
      [userId]
    );
    
    if (result.rows.length === 0) {
      console.log(`Nenhum perfil ativo encontrado para usuário ${userId}, criando perfil padrão`);
      await createDefaultProfile(userId);
      
      const newResult = await pool.query(
        'SELECT * FROM user_profiles WHERE user_id = $1 AND is_active = true',
        [userId]
      );
      
      if (newResult.rows.length === 0) {
        return res.status(404).json({ error: 'Nenhum perfil ativo encontrado' });
      }
      
      console.log(`✅ Perfil ativo encontrado para usuário ${userId}:`, newResult.rows[0]);
      return res.json(newResult.rows[0]);
    }
    
    console.log(`✅ Perfil ativo encontrado para usuário ${userId}:`, result.rows[0]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Erro ao buscar perfil ativo:', error.message);
    res.status(500).json({ error: 'Erro ao buscar perfil ativo' });
  }
});

app.get('/api/user/:id/game-sessions', async (req, res) => {
  try {
    const { id } = req.params;
    const { game_id, limit, profile_id } = req.query;
    
    console.log(`Buscando sessões para usuário ${id}, jogo: ${game_id || 'todos'}, limite: ${limit || 'sem limite'}, perfil: ${profile_id || 'ativo'}`);
    
    // Determinar qual perfil usar
    let targetProfileId = null;
    if (profile_id) {
      targetProfileId = parseInt(profile_id);
    } else {
      // Usar o perfil ativo
      const profileResult = await pool.query(
        'SELECT id FROM user_profiles WHERE user_id = $1 AND is_active = true',
        [id]
      );
      targetProfileId = profileResult.rows.length > 0 ? profileResult.rows[0].id : null;
    }
    
    // Construir query base
    let query = 'SELECT * FROM game_sessions WHERE user_id = $1';
    let params = [id];
    let paramIndex = 2;
    
    // Filtrar por jogo se especificado
    if (game_id) {
      query += ` AND game_id = $${paramIndex++}`;
      params.push(game_id);
    }
    
    // Ordenar por data de criação (mais recente primeiro)
    query += ' ORDER BY created_at DESC';
    
    // Aplicar limite se especificado
    if (limit) {
      query += ` LIMIT $${paramIndex++}`;
      params.push(parseInt(limit));
    }
    
    const result = await pool.query(query, params);
    
    console.log(`✅ Sessões encontradas para usuário ${id}:`, result.rows.length);
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Erro ao buscar sessões:', error.message);
    res.status(500).json({ error: 'Erro ao buscar sessões' });
  }
});

// Nova rota para estatísticas de sessões por perfil
app.get('/api/user/:userId/profiles/:profileId/sessions-stats', (req, res) => {
  const { userId, profileId } = req.params;
  
  console.log(`Buscando estatísticas de sessões para perfil ${profileId} do usuário ${userId}`);
  
  // Buscar sessões do perfil específico
  const userSessions = gameSessions.get(userId) || [];
  const profileSessions = userSessions.filter(session => session.profile_id == profileId);
  
  // Calcular estatísticas
  const stats = {
    totalSessions: profileSessions.length,
    gamesPlayed: [...new Set(profileSessions.map(s => s.game_id))],
    averageScore: profileSessions.length > 0 
      ? profileSessions.reduce((sum, s) => sum + (s.score || 0), 0) / profileSessions.length 
      : 0,
    lastActivity: profileSessions.length > 0 
      ? profileSessions.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0].created_at
      : null,
    sessionsByGame: {}
  };
  
  // Contar sessões por jogo
  profileSessions.forEach(session => {
    if (!stats.sessionsByGame[session.game_id]) {
      stats.sessionsByGame[session.game_id] = 0;
    }
    stats.sessionsByGame[session.game_id]++;
  });
  
  console.log(`Estatísticas calculadas para perfil ${profileId}:`, stats);
  res.json(stats);
});

// Rota para relatórios de progresso
app.get('/api/progress/:userId', (req, res) => {
  const { userId } = req.params;
  
  // Simular dados de progresso
  res.json({
    userId,
    totalSessions: 0,
    avgAccuracy: 0,
    games: [],
    lastActivity: new Date().toISOString()
  });
});

// Rota para parâmetros adaptativos
app.get('/api/adaptive-parameters/:gameId/:difficulty', (req, res) => {
  const { gameId, difficulty } = req.params;
  
  console.log(`Buscando parâmetros adaptativos para ${gameId} - ${difficulty}`);
    // Parâmetros adaptativos padrão por jogo e dificuldade
  const adaptiveParameters = {
    'letter-recognition': {
      'EASY': { 
        focusLetters: ['A', 'E', 'O'],
        timeLimit: 15,
        audioHints: true
      },
      'MEDIUM': { 
        focusLetters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
        timeLimit: 10,
        audioHints: false
      },
      'HARD': { 
        focusLetters: ['L', 'M', 'N', 'P', 'R', 'S', 'T', 'V', 'Z'],
        timeLimit: 8,
        audioHints: false
      }
    },
    'musical-sequence': {
      'EASY': { maxNotes: 3, speed: 1000 },
      'MEDIUM': { maxNotes: 5, speed: 800 },
      'HARD': { maxNotes: 7, speed: 600 }
    },
    'memory-game': {
      'EASY': { pairs: 4, timeLimit: 120, hintDuration: 1000 },
      'MEDIUM': { pairs: 6, timeLimit: 180, hintDuration: 800 },
      'HARD': { pairs: 8, timeLimit: 240, hintDuration: 500 }
    },
    'color-match': {
      'EASY': { correctItems: 2, incorrectItems: 2, timeLimit: 60 },
      'MEDIUM': { correctItems: 3, incorrectItems: 3, timeLimit: 45 },
      'HARD': { correctItems: 4, incorrectItems: 4, timeLimit: 30 }
    },
    'image-association': {
      'EASY': { categories: ['animals', 'fruits'], timeLimit: 20 },
      'MEDIUM': { categories: ['animals', 'fruits', 'toys', 'vehicles'], timeLimit: 15 },
      'HARD': { categories: ['all'], timeLimit: 10 }
    },    'number-counting': {
      'EASY': { minCount: 1, maxCount: 5, options: 3 },
      'MEDIUM': { minCount: 1, maxCount: 10, options: 4 },
      'HARD': { minCount: 5, maxCount: 15, options: 5 }
    },
    'creative-painting': {
      'EASY': { 
        minStrokes: 3, 
        minColors: 1, 
        timeLimit: 180,
        challengeType: 'free-draw'
      },
      'MEDIUM': { 
        minStrokes: 5, 
        minColors: 2, 
        timeLimit: 120,
        challengeType: 'guided'
      },
      'HARD': { 
        minStrokes: 8, 
        minColors: 4, 
        timeLimit: 90,
        challengeType: 'complex'
      }
    }
  };
    const gameParams = adaptiveParameters[gameId];
  if (!gameParams) {
    return res.status(404).json({
      error: 'Jogo não encontrado',
      gameId
    });
  }
  
  // Normalizar dificuldade para maiúsculo para compatibilidade
  const normalizedDifficulty = difficulty.toUpperCase();
  
  const difficultyParams = gameParams[normalizedDifficulty];
  if (!difficultyParams) {
    return res.status(404).json({
      error: 'Dificuldade não encontrada',
      difficulty,
      normalizedDifficulty,
      availableDifficulties: Object.keys(gameParams)
    });
  }
    res.json({
    gameId,
    difficulty: normalizedDifficulty,
    originalDifficulty: difficulty,
    parameters: difficultyParams,
    timestamp: new Date().toISOString()
  });
});

// Middleware de erro
app.use((error, req, res, next) => {
  console.error('Erro na API:', error);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: error.message
  });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.originalUrl
  });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🔌 API Server rodando na porta ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
});
