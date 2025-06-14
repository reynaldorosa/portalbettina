-- ===================================================================
-- ANÁLISE E PREPARAÇÃO DO BANCO DE DADOS PARA MACHINE LEARNING
-- Portal Betina - Análise Completa e Estruturação para IA
-- ===================================================================

-- 1. VERIFICAÇÃO DAS ESTRUTURAS ATUAIS
-- ===================================================================

-- Verificar inconsistências nas dificuldades
SELECT 
    'INCONSISTÊNCIAS DE DIFICULDADE' as problema,
    game_id,
    difficulty,
    COUNT(*) as ocorrencias
FROM game_sessions 
WHERE difficulty NOT IN ('EASY', 'MEDIUM', 'HARD')
GROUP BY game_id, difficulty
ORDER BY game_id, difficulty;

-- Verificar jogos sem parâmetros ML
SELECT DISTINCT
    'JOGOS SEM PARÂMETROS ML' as problema,
    gs.game_id
FROM game_sessions gs
LEFT JOIN adaptive_ml_parameters amp ON gs.game_id = amp.game_id
WHERE amp.game_id IS NULL;

-- Verificar outliers de accuracy
SELECT 
    'OUTLIERS DE ACCURACY' as problema,
    id,
    game_id,
    accuracy,
    score
FROM game_sessions 
WHERE accuracy > 100 OR accuracy < 0;

-- 2. PADRONIZAÇÃO DAS DIFICULDADES
-- ===================================================================

-- Corrigir dificuldades minúsculas
UPDATE game_sessions 
SET difficulty = UPPER(difficulty) 
WHERE difficulty IN ('easy', 'medium', 'hard');

-- Inserir linha de log
INSERT INTO progress_reports (user_id, report_type, data, created_at)
SELECT 1, 'system_update', 
       jsonb_build_object(
           'action', 'difficulty_standardization',
           'timestamp', CURRENT_TIMESTAMP,
           'rows_affected', (SELECT COUNT(*) FROM game_sessions WHERE difficulty IN ('easy', 'medium', 'hard'))
       ),
       CURRENT_TIMESTAMP;

-- 3. CRIAÇÃO DE TABELAS PARA MACHINE LEARNING AVANÇADO
-- ===================================================================

-- Tabela de perfis cognitivos baseados em ML
CREATE TABLE IF NOT EXISTS cognitive_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
      -- Métricas cognitivas fundamentais (Cloud Nandrophic autism therapy baselines)
    processing_speed DECIMAL(5,2) DEFAULT 65.0, -- velocidade ajustada para autismo
    attention_span DECIMAL(5,2) DEFAULT 45.0,   -- atenção típica do espectro autista
    working_memory DECIMAL(5,2) DEFAULT 55.0,   -- memória de trabalho adequada
    pattern_recognition DECIMAL(5,2) DEFAULT 70.0, -- forte reconhecimento em autismo
    
    -- Perfis de aprendizagem (ajustados para terapia do autismo)
    visual_learner_score DECIMAL(5,2) DEFAULT 75.0,    -- preferência visual forte
    auditory_learner_score DECIMAL(5,2) DEFAULT 40.0,  -- processamento auditivo desafiador
    kinesthetic_learner_score DECIMAL(5,2) DEFAULT 60.0, -- aprendizado tátil supportivo
    
    -- Preferências de dificuldade por domínio
    memory_preference VARCHAR(10) DEFAULT 'MEDIUM',
    logic_preference VARCHAR(10) DEFAULT 'MEDIUM',
    creativity_preference VARCHAR(10) DEFAULT 'MEDIUM',
    numbers_preference VARCHAR(10) DEFAULT 'MEDIUM',
    colors_preference VARCHAR(10) DEFAULT 'MEDIUM',
    
    -- Métricas de progresso
    overall_improvement_rate DECIMAL(5,2) DEFAULT 0.0,
    consistency_score DECIMAL(5,2) DEFAULT 50.0,
    adaptability_score DECIMAL(5,2) DEFAULT 50.0,
    
    -- Metadados
    confidence_level DECIMAL(5,2) DEFAULT 10.0, -- confiança das previsões
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    samples_count INTEGER DEFAULT 0,
    
    CONSTRAINT chk_processing_speed CHECK (processing_speed >= 0 AND processing_speed <= 100),
    CONSTRAINT chk_attention_span CHECK (attention_span >= 0 AND attention_span <= 100),
    CONSTRAINT chk_working_memory CHECK (working_memory >= 0 AND working_memory <= 100),
    CONSTRAINT chk_pattern_recognition CHECK (pattern_recognition >= 0 AND pattern_recognition <= 100)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_cognitive_profiles_user_id ON cognitive_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_cognitive_profiles_updated ON cognitive_profiles(last_updated);

-- Tabela de previsões de ML em tempo real
CREATE TABLE IF NOT EXISTS ml_predictions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    game_id VARCHAR(50) NOT NULL,
    
    -- Previsões do modelo
    predicted_difficulty VARCHAR(10) NOT NULL,
    predicted_score INTEGER,
    predicted_completion_time INTEGER, -- em segundos
    predicted_accuracy DECIMAL(5,2),
    
    -- Configurações adaptivas recomendadas
    recommended_settings JSONB DEFAULT '{}',
    
    -- Confiança e métricas do modelo
    prediction_confidence DECIMAL(5,2) DEFAULT 50.0,
    model_version VARCHAR(20) DEFAULT '1.0',
    features_used JSONB DEFAULT '[]',
    
    -- Validação posterior
    actual_difficulty VARCHAR(10),
    actual_score INTEGER,
    actual_completion_time INTEGER,
    actual_accuracy DECIMAL(5,2),
    
    prediction_accuracy DECIMAL(5,2), -- quão precisa foi a previsão
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    validated_at TIMESTAMP,
    
    CONSTRAINT chk_predicted_difficulty CHECK (predicted_difficulty IN ('EASY', 'MEDIUM', 'HARD')),
    CONSTRAINT chk_actual_difficulty CHECK (actual_difficulty IN ('EASY', 'MEDIUM', 'HARD'))
);

-- Índices para ML
CREATE INDEX IF NOT EXISTS idx_ml_predictions_user_game ON ml_predictions(user_id, game_id);
CREATE INDEX IF NOT EXISTS idx_ml_predictions_created ON ml_predictions(created_at);
CREATE INDEX IF NOT EXISTS idx_ml_predictions_confidence ON ml_predictions(prediction_confidence);

-- Tabela de features (características) extraídas para ML
CREATE TABLE IF NOT EXISTS ml_features (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    game_id VARCHAR(50) NOT NULL,
    session_id INTEGER REFERENCES game_sessions(id),
    
    -- Features temporais
    session_duration INTEGER, -- duração total em segundos
    pause_frequency INTEGER DEFAULT 0, -- quantas vezes pausou
    avg_response_time DECIMAL(8,2), -- tempo médio de resposta
    response_time_variance DECIMAL(8,2), -- variação nos tempos
    
    -- Features de performance
    accuracy_trend DECIMAL(5,2), -- tendência da accuracy (-100 a 100)
    error_pattern TEXT, -- padrão de erros identificado
    learning_curve_slope DECIMAL(8,4), -- inclinação da curva de aprendizado
    
    -- Features comportamentais
    interaction_frequency DECIMAL(5,2), -- interações por minuto
    help_usage_frequency INTEGER DEFAULT 0, -- uso de ajuda
    retry_frequency INTEGER DEFAULT 0, -- tentativas repetidas
    
    -- Features específicas por jogo
    memory_game_features JSONB DEFAULT '{}',
    color_match_features JSONB DEFAULT '{}',
    logic_game_features JSONB DEFAULT '{}',
    creativity_features JSONB DEFAULT '{}',
    number_features JSONB DEFAULT '{}',
    
    -- Features derivadas
    cognitive_load_estimate DECIMAL(5,2) DEFAULT 50.0,
    engagement_score DECIMAL(5,2) DEFAULT 50.0,
    frustration_indicators JSONB DEFAULT '[]',
    
    extracted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_cognitive_load CHECK (cognitive_load_estimate >= 0 AND cognitive_load_estimate <= 100),
    CONSTRAINT chk_engagement CHECK (engagement_score >= 0 AND engagement_score <= 100)
);

-- Índices para features
CREATE INDEX IF NOT EXISTS idx_ml_features_user_game ON ml_features(user_id, game_id);
CREATE INDEX IF NOT EXISTS idx_ml_features_session ON ml_features(session_id);
CREATE INDEX IF NOT EXISTS idx_ml_features_extracted ON ml_features(extracted_at);

-- 4. ESTRUTURA PARA MODELOS DE IA AVANÇADOS
-- ===================================================================

-- Tabela de modelos de IA treinados
CREATE TABLE IF NOT EXISTS ai_models (
    id SERIAL PRIMARY KEY,
    model_name VARCHAR(100) NOT NULL UNIQUE,
    model_type VARCHAR(50) NOT NULL, -- 'difficulty_predictor', 'engagement_classifier', etc.
    
    -- Arquitetura do modelo
    architecture JSONB NOT NULL, -- descrição da arquitetura
    hyperparameters JSONB DEFAULT '{}',
    feature_importance JSONB DEFAULT '{}',
    
    -- Métricas de performance
    training_accuracy DECIMAL(5,2),
    validation_accuracy DECIMAL(5,2),
    test_accuracy DECIMAL(5,2),
    f1_score DECIMAL(5,2),
    precision_score DECIMAL(5,2),
    recall_score DECIMAL(5,2),
    
    -- Metadados de treinamento
    training_samples INTEGER,
    validation_samples INTEGER,
    training_duration INTEGER, -- em segundos
    
    -- Versioning
    version VARCHAR(20) NOT NULL,
    parent_version VARCHAR(20),
    
    -- Deploy info
    is_active BOOLEAN DEFAULT FALSE,
    deployed_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de logs de IA para debugging
CREATE TABLE IF NOT EXISTS ai_logs (
    id SERIAL PRIMARY KEY,
    model_name VARCHAR(100) REFERENCES ai_models(model_name),
    user_id INTEGER REFERENCES users(id),
    
    log_type VARCHAR(50) NOT NULL, -- 'prediction', 'training', 'error', 'performance'
    log_level VARCHAR(20) DEFAULT 'INFO', -- 'DEBUG', 'INFO', 'WARN', 'ERROR'
    
    message TEXT,
    data JSONB DEFAULT '{}',
    
    processing_time_ms INTEGER,
    memory_usage_mb DECIMAL(8,2),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para AI
CREATE INDEX IF NOT EXISTS idx_ai_models_type ON ai_models(model_type);
CREATE INDEX IF NOT EXISTS idx_ai_models_active ON ai_models(is_active);
CREATE INDEX IF NOT EXISTS idx_ai_logs_model ON ai_logs(model_name);
CREATE INDEX IF NOT EXISTS idx_ai_logs_type ON ai_logs(log_type, created_at);

-- 5. VIEWS PARA ANÁLISE DE DADOS
-- ===================================================================

-- View consolidada de performance por usuário
CREATE OR REPLACE VIEW user_performance_summary AS
SELECT 
    u.id as user_id,
    u.username,
    COUNT(DISTINCT gs.game_id) as games_played,
    COUNT(gs.id) as total_sessions,
    AVG(gs.accuracy) as avg_accuracy,
    AVG(gs.score) as avg_score,
    AVG(gs.time_spent) as avg_time_spent,
    
    -- Performance por dificuldade
    AVG(CASE WHEN gs.difficulty = 'EASY' THEN gs.accuracy END) as easy_avg_accuracy,
    AVG(CASE WHEN gs.difficulty = 'MEDIUM' THEN gs.accuracy END) as medium_avg_accuracy,
    AVG(CASE WHEN gs.difficulty = 'HARD' THEN gs.accuracy END) as hard_avg_accuracy,
    
    -- Tendências temporais
    (SELECT gs2.accuracy FROM game_sessions gs2 WHERE gs2.user_id = u.id ORDER BY gs2.created_at DESC LIMIT 1) as latest_accuracy,
    (SELECT gs2.accuracy FROM game_sessions gs2 WHERE gs2.user_id = u.id ORDER BY gs2.created_at ASC LIMIT 1) as first_accuracy,
    
    -- Estatísticas de engajamento
    COUNT(gs.id) FILTER (WHERE gs.completed = true) * 100.0 / COUNT(gs.id) as completion_rate,
    
    MAX(gs.created_at) as last_played,
    MIN(gs.created_at) as first_played
FROM users u
LEFT JOIN game_sessions gs ON u.id = gs.user_id
GROUP BY u.id, u.username;

-- View de análise de jogos
CREATE OR REPLACE VIEW game_analytics AS
SELECT 
    gs.game_id,
    gs.difficulty,
    COUNT(*) as total_sessions,
    AVG(gs.accuracy) as avg_accuracy,
    STDDEV(gs.accuracy) as accuracy_stddev,
    AVG(gs.score) as avg_score,
    AVG(gs.time_spent) as avg_time_spent,
    
    -- Distribuição de performance
    PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY gs.accuracy) as accuracy_q1,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY gs.accuracy) as accuracy_median,
    PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY gs.accuracy) as accuracy_q3,
    
    -- Métricas de engajamento
    COUNT(*) FILTER (WHERE gs.completed = true) * 100.0 / COUNT(*) as completion_rate,
    AVG(EXTRACT(EPOCH FROM (gs.created_at - LAG(gs.created_at) OVER (PARTITION BY gs.user_id ORDER BY gs.created_at)))) as avg_session_gap_seconds
    
FROM game_sessions gs
GROUP BY gs.game_id, gs.difficulty
ORDER BY gs.game_id, gs.difficulty;

-- 6. INSERÇÃO DE DADOS PADRÃO PARA ML
-- ===================================================================

-- Parâmetros adaptativos padrão para todos os jogos implementados
INSERT INTO adaptive_ml_parameters (game_id, difficulty, parameters) VALUES
-- Memory Game
('memory-game', 'EASY', '{"pairs": 4, "timeLimit": 120, "hintDuration": 1000, "maxMistakes": 3}'),
('memory-game', 'MEDIUM', '{"pairs": 6, "timeLimit": 180, "hintDuration": 800, "maxMistakes": 2}'),
('memory-game', 'HARD', '{"pairs": 8, "timeLimit": 240, "hintDuration": 500, "maxMistakes": 1}'),

-- Color Match
('color-match', 'EASY', '{"correctItems": 3, "incorrectItems": 2, "timeLimit": 60, "hints": true}'),
('color-match', 'MEDIUM', '{"correctItems": 4, "incorrectItems": 3, "timeLimit": 45, "hints": false}'),
('color-match', 'HARD', '{"correctItems": 5, "incorrectItems": 4, "timeLimit": 30, "hints": false}'),

-- Image Association
('image-association', 'EASY', '{"pairs": 4, "categories": 2, "timeLimit": 90, "showCategories": true}'),
('image-association', 'MEDIUM', '{"pairs": 6, "categories": 3, "timeLimit": 75, "showCategories": false}'),
('image-association', 'HARD', '{"pairs": 8, "categories": 4, "timeLimit": 60, "showCategories": false}'),

-- Musical Sequence
('musical-sequence', 'EASY', '{"maxNotes": 3, "speed": 1000, "repetitions": 2}'),
('musical-sequence', 'MEDIUM', '{"maxNotes": 5, "speed": 800, "repetitions": 1}'),
('musical-sequence', 'HARD', '{"maxNotes": 7, "speed": 600, "repetitions": 1}'),

-- Letter Recognition
('letter-recognition', 'EASY', '{"focusLetters": ["A", "E", "O"], "timeLimit": 15, "audioHints": true}'),
('letter-recognition', 'MEDIUM', '{"focusLetters": ["A", "B", "C", "D", "E", "F", "G", "H"], "timeLimit": 10, "audioHints": true}'),
('letter-recognition', 'HARD', '{"focusLetters": ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P"], "timeLimit": 8, "audioHints": false}'),

-- Number Counting
('number-counting', 'EASY', '{"maxCount": 5, "minCount": 1, "options": 3, "timeLimit": 30}'),
('number-counting', 'MEDIUM', '{"maxCount": 10, "minCount": 1, "options": 4, "timeLimit": 25}'),
('number-counting', 'HARD', '{"maxCount": 15, "minCount": 5, "options": 5, "timeLimit": 20}'),

-- Creative Painting
('creative-painting', 'EASY', '{"brushSizes": [5, 10], "colorPalette": 8, "timeLimit": 300, "guidance": true}'),
('creative-painting', 'MEDIUM', '{"brushSizes": [3, 5, 8, 12], "colorPalette": 12, "timeLimit": 240, "guidance": false}'),
('creative-painting', 'HARD', '{"brushSizes": [1, 3, 5, 8, 12, 15], "colorPalette": 16, "timeLimit": 180, "guidance": false}')

ON CONFLICT (game_id, difficulty) DO UPDATE SET
parameters = EXCLUDED.parameters,
updated_at = CURRENT_TIMESTAMP;

-- 7. TRIGGERS PARA MANUTENÇÃO AUTOMÁTICA
-- ===================================================================

-- Trigger para atualizar perfis cognitivos automaticamente
CREATE OR REPLACE FUNCTION update_cognitive_profile()
RETURNS TRIGGER AS $$
BEGIN
    -- Inserir ou atualizar perfil cognitivo baseado na nova sessão
    INSERT INTO cognitive_profiles (user_id, samples_count, last_updated)
    VALUES (NEW.user_id, 1, CURRENT_TIMESTAMP)
    ON CONFLICT (user_id) DO UPDATE SET
        samples_count = cognitive_profiles.samples_count + 1,
        last_updated = CURRENT_TIMESTAMP,
        -- Atualizar métricas baseadas na performance
        processing_speed = CASE 
            WHEN NEW.time_spent > 0 THEN 
                LEAST(100, GREATEST(0, cognitive_profiles.processing_speed * 0.9 + (100 - NEW.time_spent/10) * 0.1))
            ELSE cognitive_profiles.processing_speed
        END,
        overall_improvement_rate = CASE
            WHEN cognitive_profiles.samples_count > 1 THEN
                LEAST(100, GREATEST(-100, (NEW.accuracy - 50) * 0.1 + cognitive_profiles.overall_improvement_rate * 0.9))
            ELSE (NEW.accuracy - 50) * 0.1
        END;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger
DROP TRIGGER IF EXISTS trigger_update_cognitive_profile ON game_sessions;
CREATE TRIGGER trigger_update_cognitive_profile
    AFTER INSERT ON game_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_cognitive_profile();

-- 8. VALIDAÇÃO E RELATÓRIO FINAL
-- ===================================================================

-- Relatório de validação
SELECT 
    'ESTRUTURA CRIADA PARA ML' as status,
    COUNT(*) as total_tables
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('cognitive_profiles', 'ml_predictions', 'ml_features', 'ai_models', 'ai_logs');

SELECT 
    'PARÂMETROS ML INSERIDOS' as status,
    COUNT(*) as total_parameters
FROM adaptive_ml_parameters;

SELECT 
    'JOGOS COM PARÂMETROS' as status,
    COUNT(DISTINCT game_id) as games_covered
FROM adaptive_ml_parameters;

-- Verificar integridade dos dados
SELECT 
    'INTEGRIDADE DOS DADOS' as status,
    CASE 
        WHEN COUNT(*) FILTER (WHERE accuracy > 100) = 0 THEN 'OK'
        ELSE 'PROBLEMAS ENCONTRADOS'
    END as accuracy_check,
    CASE
        WHEN COUNT(*) FILTER (WHERE difficulty NOT IN ('EASY', 'MEDIUM', 'HARD')) = 0 THEN 'OK'
        ELSE 'PROBLEMAS ENCONTRADOS'
    END as difficulty_check
FROM game_sessions;
