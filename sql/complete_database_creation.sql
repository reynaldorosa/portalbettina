-- =============================================================================
-- SCRIPT COMPLETO DE CRIAÇÃO DO BANCO DE DADOS
-- Portal Betina - Sistema Neuropedagógico Adaptativo com ML/IA
-- Data: 07/06/2025
-- Versão: 2.0 - Otimizado para Machine Learning e Inteligência Artificial
-- =============================================================================

-- CONFIGURAÇÕES INICIAIS
-- =============================================================================
SET client_encoding = 'UTF8';
SET timezone = 'UTC';

-- EXTENSÕES NECESSÁRIAS
-- =============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- PARTE 1: TABELAS PRINCIPAIS DO SISTEMA
-- =============================================================================

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255),
    display_name VARCHAR(255),
    is_anonymous BOOLEAN DEFAULT TRUE,
    age INTEGER,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de perfis de usuário (para múltiplos perfis por conta)
CREATE TABLE IF NOT EXISTS user_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    profile_name VARCHAR(100) NOT NULL,
    display_name VARCHAR(255),
    age INTEGER,
    is_active BOOLEAN DEFAULT FALSE,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, profile_name)
);

-- Tabela de configurações de acessibilidade
CREATE TABLE IF NOT EXISTS accessibility_settings (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    font_size VARCHAR(20) DEFAULT 'medium',
    contrast VARCHAR(20) DEFAULT 'normal',
    audio_enabled BOOLEAN DEFAULT TRUE,
    animations BOOLEAN DEFAULT TRUE,
    text_to_speech BOOLEAN DEFAULT FALSE,
    color_blind_support BOOLEAN DEFAULT FALSE,
    high_contrast BOOLEAN DEFAULT FALSE,
    large_cursor BOOLEAN DEFAULT FALSE,
    reduced_motion BOOLEAN DEFAULT FALSE,
    settings JSONB DEFAULT '{}',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela principal de sessões de jogo
CREATE TABLE IF NOT EXISTS game_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    game_id VARCHAR(50) NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    score INTEGER DEFAULT 0,
    accuracy NUMERIC(5,2) DEFAULT 0,
    time_spent INTEGER DEFAULT 0, -- em segundos
    completed BOOLEAN DEFAULT TRUE,
    correct_answers INTEGER DEFAULT 0,
    total_attempts INTEGER DEFAULT 0,
    data JSONB DEFAULT '{}', -- dados específicos do jogo
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints para garantir qualidade dos dados
    CONSTRAINT chk_score CHECK (score >= 0),
    CONSTRAINT chk_accuracy CHECK (accuracy >= 0 AND accuracy <= 100),
    CONSTRAINT chk_time_spent CHECK (time_spent >= 0),
    CONSTRAINT chk_correct_answers CHECK (correct_answers >= 0),
    CONSTRAINT chk_total_attempts CHECK (total_attempts >= 0),
    CONSTRAINT chk_difficulty CHECK (difficulty IN ('EASY', 'MEDIUM', 'HARD'))
);

-- PARTE 2: TABELAS PARA MACHINE LEARNING E IA
-- =============================================================================

-- Perfis cognitivos dos usuários (base para ML)
CREATE TABLE IF NOT EXISTS cognitive_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    
    -- Capacidades cognitivas fundamentais (0-100)
    processing_speed NUMERIC(5,2) DEFAULT 50.0,
    attention_span NUMERIC(5,2) DEFAULT 50.0,
    working_memory NUMERIC(5,2) DEFAULT 50.0,
    pattern_recognition NUMERIC(5,2) DEFAULT 50.0,
    
    -- Estilos de aprendizagem (0-100)
    visual_learner_score NUMERIC(5,2) DEFAULT 50.0,
    auditory_learner_score NUMERIC(5,2) DEFAULT 50.0,
    kinesthetic_learner_score NUMERIC(5,2) DEFAULT 50.0,
    
    -- Preferências e características (WEAK/MEDIUM/STRONG)
    memory_preference VARCHAR(10) DEFAULT 'MEDIUM',
    logic_preference VARCHAR(10) DEFAULT 'MEDIUM',
    creativity_preference VARCHAR(10) DEFAULT 'MEDIUM',
    numbers_preference VARCHAR(10) DEFAULT 'MEDIUM',
    colors_preference VARCHAR(10) DEFAULT 'MEDIUM',
    
    -- Métricas de progresso e adaptação
    overall_improvement_rate NUMERIC(5,2) DEFAULT 0.0,
    consistency_score NUMERIC(5,2) DEFAULT 50.0,
    adaptability_score NUMERIC(5,2) DEFAULT 50.0,
    confidence_level NUMERIC(5,2) DEFAULT 10.0,
    
    -- Metadados
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    samples_count INTEGER DEFAULT 0,
    
    -- Constraints para garantir ranges válidos
    CONSTRAINT chk_processing_speed CHECK (processing_speed >= 0 AND processing_speed <= 100),
    CONSTRAINT chk_attention_span CHECK (attention_span >= 0 AND attention_span <= 100),
    CONSTRAINT chk_working_memory CHECK (working_memory >= 0 AND working_memory <= 100),
    CONSTRAINT chk_pattern_recognition CHECK (pattern_recognition >= 0 AND pattern_recognition <= 100),
    CONSTRAINT chk_visual_learner CHECK (visual_learner_score >= 0 AND visual_learner_score <= 100),
    CONSTRAINT chk_auditory_learner CHECK (auditory_learner_score >= 0 AND auditory_learner_score <= 100),
    CONSTRAINT chk_kinesthetic_learner CHECK (kinesthetic_learner_score >= 0 AND kinesthetic_learner_score <= 100),
    CONSTRAINT chk_memory_pref CHECK (memory_preference IN ('WEAK', 'MEDIUM', 'STRONG')),
    CONSTRAINT chk_logic_pref CHECK (logic_preference IN ('WEAK', 'MEDIUM', 'STRONG')),
    CONSTRAINT chk_creativity_pref CHECK (creativity_preference IN ('WEAK', 'MEDIUM', 'STRONG')),
    CONSTRAINT chk_numbers_pref CHECK (numbers_preference IN ('WEAK', 'MEDIUM', 'STRONG')),
    CONSTRAINT chk_colors_pref CHECK (colors_preference IN ('WEAK', 'MEDIUM', 'STRONG'))
);

-- Features extraídas para machine learning
CREATE TABLE IF NOT EXISTS ml_features (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    game_id VARCHAR(50) NOT NULL,
    session_id INTEGER REFERENCES game_sessions(id) ON DELETE CASCADE,
    
    -- Features temporais
    session_duration INTEGER, -- duração da sessão em segundos
    pause_frequency INTEGER DEFAULT 0, -- número de pausas
    avg_response_time NUMERIC(8,2), -- tempo médio de resposta
    response_time_variance NUMERIC(8,2), -- variância dos tempos de resposta
    
    -- Features de performance
    accuracy_trend NUMERIC(5,2), -- tendência de acurácia na sessão
    error_pattern TEXT, -- padrão de erros identificado
    learning_curve_slope NUMERIC(8,4), -- inclinação da curva de aprendizado
    interaction_frequency NUMERIC(5,2), -- frequência de interações
    
    -- Features comportamentais
    help_usage_frequency INTEGER DEFAULT 0, -- quantas vezes pediu ajuda
    retry_frequency INTEGER DEFAULT 0, -- quantas vezes repetiu ações
    
    -- Features específicas por tipo de jogo (armazenadas como JSON)
    memory_game_features JSONB DEFAULT '{}',
    color_match_features JSONB DEFAULT '{}',
    logic_game_features JSONB DEFAULT '{}',
    creativity_features JSONB DEFAULT '{}',
    number_features JSONB DEFAULT '{}',
    
    -- Features psicológicas estimadas
    cognitive_load_estimate NUMERIC(5,2) DEFAULT 50.0,
    engagement_score NUMERIC(5,2) DEFAULT 50.0,
    frustration_indicators JSONB DEFAULT '[]',
    
    extracted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT chk_cognitive_load CHECK (cognitive_load_estimate >= 0 AND cognitive_load_estimate <= 100),
    CONSTRAINT chk_engagement CHECK (engagement_score >= 0 AND engagement_score <= 100)
);

-- Predições do modelo de ML
CREATE TABLE IF NOT EXISTS ml_predictions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    game_id VARCHAR(50) NOT NULL,
    
    -- Predições
    predicted_difficulty VARCHAR(10) NOT NULL,
    predicted_score INTEGER,
    predicted_completion_time INTEGER,
    predicted_accuracy NUMERIC(5,2),
    recommended_settings JSONB DEFAULT '{}',
    
    -- Metadados do modelo
    prediction_confidence NUMERIC(5,2) DEFAULT 50.0,
    model_version VARCHAR(20) DEFAULT '1.0',
    features_used JSONB DEFAULT '[]',
    
    -- Validação posterior (para avaliar acurácia do modelo)
    actual_difficulty VARCHAR(10),
    actual_score INTEGER,
    actual_completion_time INTEGER,
    actual_accuracy NUMERIC(5,2),
    prediction_accuracy NUMERIC(5,2), -- quão precisa foi a predição
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    validated_at TIMESTAMP,
    
    -- Constraints
    CONSTRAINT chk_predicted_difficulty CHECK (predicted_difficulty IN ('EASY', 'MEDIUM', 'HARD')),
    CONSTRAINT chk_actual_difficulty CHECK (actual_difficulty IN ('EASY', 'MEDIUM', 'HARD'))
);

-- Parâmetros adaptativos do sistema
CREATE TABLE IF NOT EXISTS adaptive_ml_parameters (
    id SERIAL PRIMARY KEY,
    game_id VARCHAR(50) NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    parameters JSONB NOT NULL, -- parâmetros específicos do jogo/dificuldade
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Constraint para evitar duplicatas
    CONSTRAINT uq_adaptive_params UNIQUE(game_id, difficulty)
);

-- Modelos de IA registrados no sistema
CREATE TABLE IF NOT EXISTS ai_models (
    id SERIAL PRIMARY KEY,
    model_name VARCHAR(100) UNIQUE NOT NULL,
    model_type VARCHAR(50) NOT NULL, -- 'classification', 'regression', 'clustering', etc.
    architecture JSONB NOT NULL, -- estrutura do modelo
    hyperparameters JSONB DEFAULT '{}',
    feature_importance JSONB DEFAULT '{}',
    
    -- Métricas de performance
    training_accuracy NUMERIC(5,2),
    validation_accuracy NUMERIC(5,2),
    test_accuracy NUMERIC(5,2),
    f1_score NUMERIC(5,2),
    precision_score NUMERIC(5,2),
    recall_score NUMERIC(5,2),
    
    -- Informações de treinamento
    training_samples INTEGER,
    validation_samples INTEGER,
    training_duration INTEGER, -- em segundos
    
    -- Controle de versão
    version VARCHAR(20) NOT NULL,
    parent_version VARCHAR(20), -- versão pai se for uma evolução
    is_active BOOLEAN DEFAULT FALSE,
    deployed_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Logs de atividade da IA
CREATE TABLE IF NOT EXISTS ai_logs (
    id SERIAL PRIMARY KEY,
    model_name VARCHAR(100) REFERENCES ai_models(model_name),
    log_type VARCHAR(50) NOT NULL, -- 'prediction', 'training', 'error', 'performance'
    log_level VARCHAR(20) DEFAULT 'INFO', -- 'DEBUG', 'INFO', 'WARNING', 'ERROR'
    message TEXT,
    details JSONB DEFAULT '{}',
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    session_id INTEGER REFERENCES game_sessions(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PARTE 3: TABELAS PARA ANÁLISES AVANÇADAS
-- =============================================================================

-- Relatórios de progresso
CREATE TABLE IF NOT EXISTS progress_reports (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    report_data JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Padrões de aprendizagem detectados
CREATE TABLE IF NOT EXISTS learning_patterns (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    pattern_type VARCHAR(50) NOT NULL, -- 'improvement', 'plateau', 'regression', 'breakthrough'
    game_context VARCHAR(50), -- Jogo específico ou 'global'
    pattern_description TEXT,
    strength_score NUMERIC(5,2) CHECK (strength_score >= 0 AND strength_score <= 100),
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    validated BOOLEAN DEFAULT FALSE,
    validation_source VARCHAR(50), -- 'automatic', 'specialist', 'parent'
    metadata JSONB DEFAULT '{}'
);

-- Métricas de engajamento detalhadas
CREATE TABLE IF NOT EXISTS engagement_metrics (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    session_id INTEGER REFERENCES game_sessions(id) ON DELETE CASCADE,
    total_interactions INTEGER DEFAULT 0,
    pause_frequency INTEGER DEFAULT 0,
    avg_interaction_time NUMERIC(8,2),
    attention_drops INTEGER DEFAULT 0,
    help_seeking_frequency INTEGER DEFAULT 0,
    frustration_indicators JSONB DEFAULT '[]',
    flow_state_duration INTEGER DEFAULT 0, -- em segundos
    motivational_peaks JSONB DEFAULT '[]',
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Recomendações de IA personalizadas
CREATE TABLE IF NOT EXISTS ai_recommendations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    recommendation_type VARCHAR(50) NOT NULL, -- 'difficulty', 'game_sequence', 'break_time', 'reinforcement'
    priority INTEGER DEFAULT 1 CHECK (priority >= 1 AND priority <= 5),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    action_required JSONB, -- JSON com ações específicas
    reasoning TEXT, -- Explicação do porquê da recomendação
    confidence_score NUMERIC(5,2) CHECK (confidence_score >= 0 AND confidence_score <= 100),
    model_version VARCHAR(20),
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'applied', 'dismissed', 'expired'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    applied_at TIMESTAMP,
    effectiveness_score NUMERIC(5,2) -- Avaliação posterior da efetividade
);

-- Dados de neuroplasticidade e adaptação
CREATE TABLE IF NOT EXISTS neuroplasticity_tracking (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    cognitive_domain VARCHAR(50) NOT NULL, -- 'memory', 'attention', 'processing_speed', etc.
    baseline_score NUMERIC(5,2),
    current_score NUMERIC(5,2),
    improvement_rate NUMERIC(8,4), -- Taxa de melhoria por sessão
    adaptation_speed VARCHAR(20), -- 'fast', 'moderate', 'slow'
    difficulty_preference VARCHAR(20), -- 'challenge_seeking', 'comfort_zone', 'mixed'
    learning_style_dominance JSONB, -- Scores para cada estilo de aprendizagem
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    measurement_period INTEGER DEFAULT 7 -- dias considerados para o cálculo
);

-- PARTE 4: ÍNDICES PARA PERFORMANCE
-- =============================================================================

-- Índices básicos das tabelas principais
CREATE INDEX IF NOT EXISTS idx_users_created ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_active ON user_profiles(is_active);

-- Índices para game_sessions (críticos para performance)
CREATE INDEX IF NOT EXISTS idx_game_sessions_user_id ON game_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_game_id ON game_sessions(game_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_created ON game_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_game_sessions_user_created ON game_sessions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_game_sessions_difficulty_performance ON game_sessions(difficulty, accuracy, score) WHERE completed = true;
CREATE INDEX IF NOT EXISTS idx_game_sessions_sequence ON game_sessions(user_id, game_id, created_at);

-- Índices para cognitive_profiles
CREATE UNIQUE INDEX IF NOT EXISTS idx_cognitive_profiles_user_id_unique ON cognitive_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_cognitive_profiles_user_id ON cognitive_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_cognitive_profiles_updated ON cognitive_profiles(last_updated);

-- Índices para ml_features (essenciais para queries de ML)
CREATE INDEX IF NOT EXISTS idx_ml_features_user_game ON ml_features(user_id, game_id);
CREATE INDEX IF NOT EXISTS idx_ml_features_session ON ml_features(session_id);
CREATE INDEX IF NOT EXISTS idx_ml_features_extracted ON ml_features(extracted_at);
CREATE INDEX IF NOT EXISTS idx_ml_features_temporal ON ml_features(user_id, extracted_at DESC);

-- Índices para ml_predictions
CREATE INDEX IF NOT EXISTS idx_ml_predictions_user_game ON ml_predictions(user_id, game_id);
CREATE INDEX IF NOT EXISTS idx_ml_predictions_created ON ml_predictions(created_at);
CREATE INDEX IF NOT EXISTS idx_ml_predictions_confidence ON ml_predictions(prediction_confidence);
CREATE INDEX IF NOT EXISTS idx_ml_predictions_validation ON ml_predictions(prediction_confidence DESC, created_at) WHERE validated_at IS NOT NULL;

-- Índices para ai_models
CREATE INDEX IF NOT EXISTS idx_ai_models_type ON ai_models(model_type);
CREATE INDEX IF NOT EXISTS idx_ai_models_active ON ai_models(is_active);

-- Índices para ai_logs
CREATE INDEX IF NOT EXISTS idx_ai_logs_model ON ai_logs(model_name);
CREATE INDEX IF NOT EXISTS idx_ai_logs_type ON ai_logs(log_type, created_at);

-- Índices para progress_reports
CREATE INDEX IF NOT EXISTS idx_progress_reports_user_id ON progress_reports(user_id);

-- Índices para novas tabelas
CREATE INDEX IF NOT EXISTS idx_learning_patterns_user_type ON learning_patterns(user_id, pattern_type);
CREATE INDEX IF NOT EXISTS idx_learning_patterns_detection ON learning_patterns(detected_at DESC, strength_score DESC);
CREATE INDEX IF NOT EXISTS idx_engagement_metrics_user_session ON engagement_metrics(user_id, session_id);
CREATE INDEX IF NOT EXISTS idx_engagement_metrics_calculated ON engagement_metrics(calculated_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_user_status ON ai_recommendations(user_id, status);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_priority ON ai_recommendations(priority DESC, created_at);
CREATE INDEX IF NOT EXISTS idx_neuroplasticity_user_domain ON neuroplasticity_tracking(user_id, cognitive_domain);
CREATE INDEX IF NOT EXISTS idx_neuroplasticity_improvement ON neuroplasticity_tracking(improvement_rate DESC, calculated_at);

-- PARTE 5: FUNÇÕES E TRIGGERS
-- =============================================================================

-- Função para criar usuário anônimo
CREATE OR REPLACE FUNCTION create_anonymous_user()
RETURNS INTEGER AS $$
DECLARE
    new_user_id INTEGER;
BEGIN
    INSERT INTO users (is_anonymous) VALUES (TRUE) RETURNING id INTO new_user_id;
    RETURN new_user_id;
END;
$$ LANGUAGE plpgsql;

-- Função para atualizar perfil cognitivo
CREATE OR REPLACE FUNCTION update_cognitive_profile()
RETURNS TRIGGER AS $$
DECLARE
    current_profile RECORD;
    new_accuracy NUMERIC(5,2);
    improvement_factor NUMERIC(5,2);
BEGIN
    -- Buscar perfil cognitivo existente
    SELECT * INTO current_profile 
    FROM cognitive_profiles 
    WHERE user_id = NEW.user_id;
    
    -- Se não existir, criar um novo
    IF NOT FOUND THEN
        INSERT INTO cognitive_profiles (user_id) VALUES (NEW.user_id);
        SELECT * INTO current_profile 
        FROM cognitive_profiles 
        WHERE user_id = NEW.user_id;
    END IF;
    
    -- Calcular fator de melhoria baseado na acurácia
    new_accuracy := COALESCE(NEW.accuracy, 0);
    improvement_factor := CASE 
        WHEN new_accuracy >= 85 THEN 1.1
        WHEN new_accuracy >= 70 THEN 1.05
        WHEN new_accuracy >= 50 THEN 1.0
        ELSE 0.95
    END;
    
    -- Atualizar perfil cognitivo baseado no tipo de jogo
    UPDATE cognitive_profiles SET
        processing_speed = CASE 
            WHEN NEW.game_id LIKE '%memory%' OR NEW.game_id LIKE '%speed%' THEN
                LEAST(100, processing_speed * improvement_factor)
            ELSE processing_speed
        END,
        attention_span = CASE 
            WHEN NEW.game_id LIKE '%attention%' OR NEW.time_spent > 300 THEN
                LEAST(100, attention_span * improvement_factor)
            ELSE attention_span
        END,
        working_memory = CASE 
            WHEN NEW.game_id LIKE '%memory%' OR NEW.game_id LIKE '%sequence%' THEN
                LEAST(100, working_memory * improvement_factor)
            ELSE working_memory
        END,
        pattern_recognition = CASE 
            WHEN NEW.game_id LIKE '%pattern%' OR NEW.game_id LIKE '%logic%' THEN
                LEAST(100, pattern_recognition * improvement_factor)
            ELSE pattern_recognition
        END,
        samples_count = samples_count + 1,
        last_updated = CURRENT_TIMESTAMP
    WHERE user_id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualização automática do perfil cognitivo
DROP TRIGGER IF EXISTS trigger_update_cognitive_profile ON game_sessions;
CREATE TRIGGER trigger_update_cognitive_profile
    AFTER INSERT ON game_sessions
    FOR EACH ROW EXECUTE FUNCTION update_cognitive_profile();

-- Função para calcular score de aprendizagem adaptativa
CREATE OR REPLACE FUNCTION calculate_adaptive_learning_score(p_user_id INTEGER, p_days INTEGER DEFAULT 7)
RETURNS NUMERIC(5,2) AS $$
DECLARE
    learning_score NUMERIC(5,2);
    avg_accuracy NUMERIC(5,2);
    improvement_trend NUMERIC(8,4);
    consistency_score NUMERIC(5,2);
BEGIN
    -- Calcular precisão média dos últimos dias
    SELECT AVG(accuracy) INTO avg_accuracy
    FROM game_sessions 
    WHERE user_id = p_user_id 
    AND created_at >= CURRENT_DATE - (p_days || ' days')::INTERVAL
    AND completed = true;
    
    -- Calcular tendência de melhoria
    WITH session_trends AS (
        SELECT 
            ROW_NUMBER() OVER (ORDER BY created_at) as seq,
            accuracy
        FROM game_sessions 
        WHERE user_id = p_user_id 
        AND created_at >= CURRENT_DATE - (p_days || ' days')::INTERVAL
        AND completed = true
    )
    SELECT 
        COALESCE(
            (COUNT(*) * SUM(seq * accuracy) - SUM(seq) * SUM(accuracy)) / 
            NULLIF((COUNT(*) * SUM(seq * seq) - SUM(seq) * SUM(seq)), 0),
            0
        ) INTO improvement_trend
    FROM session_trends;
    
    -- Calcular consistência (inverso do desvio padrão normalizado)
    SELECT 
        CASE 
            WHEN STDDEV(accuracy) = 0 THEN 100
            ELSE GREATEST(0, 100 - (STDDEV(accuracy) / NULLIF(AVG(accuracy), 0) * 100))
        END INTO consistency_score
    FROM game_sessions 
    WHERE user_id = p_user_id 
    AND created_at >= CURRENT_DATE - (p_days || ' days')::INTERVAL
    AND completed = true;
    
    -- Combinar métricas em score final (0-100)
    learning_score := GREATEST(0, LEAST(100, 
        (COALESCE(avg_accuracy, 50) * 0.4) + 
        (GREATEST(-50, LEAST(50, improvement_trend * 1000)) + 50) * 0.4 +
        (COALESCE(consistency_score, 50) * 0.2)
    ));
    
    RETURN learning_score;
END;
$$ LANGUAGE plpgsql;

-- Função para detectar padrões de aprendizagem
CREATE OR REPLACE FUNCTION detect_learning_patterns(p_user_id INTEGER)
RETURNS TABLE(pattern_type VARCHAR, strength NUMERIC, description TEXT) AS $$
BEGIN
    -- Detectar padrão de melhoria consistente
    RETURN QUERY
    WITH recent_sessions AS (
        SELECT accuracy, created_at,
               LAG(accuracy) OVER (ORDER BY created_at) as prev_accuracy
        FROM game_sessions 
        WHERE user_id = p_user_id 
        AND created_at >= CURRENT_DATE - INTERVAL '14 days'
        AND completed = true
        ORDER BY created_at
    )
    SELECT 
        'consistent_improvement'::VARCHAR as pattern_type,
        CASE 
            WHEN COUNT(*) = 0 THEN 0::NUMERIC
            ELSE LEAST(100, (COUNT(*) FILTER (WHERE accuracy > prev_accuracy)::NUMERIC / 
                 NULLIF(COUNT(*) FILTER (WHERE prev_accuracy IS NOT NULL), 0) * 100))
        END as strength,
        CASE 
            WHEN COUNT(*) FILTER (WHERE accuracy > prev_accuracy) > COUNT(*) * 0.7 
            THEN 'Usuário demonstra melhoria consistente ao longo das sessões'
            ELSE 'Padrão de melhoria não identificado'
        END as description
    FROM recent_sessions 
    WHERE prev_accuracy IS NOT NULL;
END;
$$ LANGUAGE plpgsql;

-- Função para atualizar métricas de engajamento automaticamente
CREATE OR REPLACE FUNCTION update_engagement_metrics()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO engagement_metrics (user_id, session_id, total_interactions, avg_interaction_time)
    VALUES (
        NEW.user_id, 
        NEW.id,
        NEW.total_attempts,
        CASE WHEN NEW.total_attempts > 0 THEN NEW.time_spent::NUMERIC / NEW.total_attempts ELSE 0 END
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para métricas de engajamento
DROP TRIGGER IF EXISTS trigger_update_engagement ON game_sessions;
CREATE TRIGGER trigger_update_engagement
    AFTER INSERT ON game_sessions
    FOR EACH ROW EXECUTE FUNCTION update_engagement_metrics();

-- PARTE 6: VIEWS PARA DASHBOARDS E ANÁLISES
-- =============================================================================

-- View para dashboard de performance do usuário
CREATE OR REPLACE VIEW user_performance_dashboard AS
SELECT 
    u.id as user_id,
    COUNT(gs.id) as total_sessions,
    AVG(gs.accuracy) as avg_accuracy,
    AVG(gs.score) as avg_score,
    MAX(gs.created_at) as last_session,
    STRING_AGG(DISTINCT gs.game_id, ', ') as games_played,
    calculate_adaptive_learning_score(u.id) as learning_score,
    cp.processing_speed,
    cp.attention_span,
    cp.working_memory,
    cp.pattern_recognition
FROM users u
LEFT JOIN game_sessions gs ON u.id = gs.user_id
LEFT JOIN cognitive_profiles cp ON u.id = cp.user_id
WHERE gs.completed = true OR gs.completed IS NULL
GROUP BY u.id, cp.processing_speed, cp.attention_span, cp.working_memory, cp.pattern_recognition;

-- View para análise de dificuldade adaptativa
CREATE OR REPLACE VIEW adaptive_difficulty_analysis AS
WITH difficulty_performance AS (
    SELECT 
        user_id,
        game_id,
        difficulty,
        AVG(accuracy) as avg_accuracy,
        AVG(score) as avg_score,
        COUNT(*) as sessions_count,
        STDDEV(accuracy) as accuracy_consistency
    FROM game_sessions 
    WHERE completed = true
    GROUP BY user_id, game_id, difficulty
)
SELECT 
    dp.*,
    CASE 
        WHEN dp.avg_accuracy > 85 AND dp.accuracy_consistency < 10 THEN 'ready_for_harder'
        WHEN dp.avg_accuracy < 60 OR dp.accuracy_consistency > 25 THEN 'needs_easier'
        ELSE 'optimal_difficulty'
    END as recommendation
FROM difficulty_performance dp;

-- PARTE 7: DADOS INICIAIS
-- =============================================================================

-- Inserir parâmetros adaptativos iniciais
INSERT INTO adaptive_ml_parameters (game_id, difficulty, parameters) VALUES
('memory-game', 'EASY', '{"pairs": 4, "timeLimit": 120, "hintDuration": 1000}'),
('memory-game', 'MEDIUM', '{"pairs": 6, "timeLimit": 180, "hintDuration": 800}'),
('memory-game', 'HARD', '{"pairs": 8, "timeLimit": 240, "hintDuration": 500}'),
('color-match', 'EASY', '{"correctItems": 2, "incorrectItems": 2, "timeLimit": 60}'),
('color-match', 'MEDIUM', '{"correctItems": 3, "incorrectItems": 3, "timeLimit": 45}'),
('color-match', 'HARD', '{"correctItems": 4, "incorrectItems": 4, "timeLimit": 30}'),
('letter-recognition', 'EASY', '{"focusLetters": ["A", "E", "O"], "timeLimit": 15, "audioHints": true}'),
('letter-recognition', 'MEDIUM', '{"focusLetters": ["A", "B", "C", "D", "E", "F", "G", "H"], "timeLimit": 10, "audioHints": false}'),
('letter-recognition', 'HARD', '{"focusLetters": ["L", "M", "N", "P", "R", "S", "T", "V", "Z"], "timeLimit": 8, "audioHints": false}'),
('musical-sequence', 'EASY', '{"maxNotes": 3, "speed": 1000}'),
('musical-sequence', 'MEDIUM', '{"maxNotes": 5, "speed": 800}'),
('musical-sequence', 'HARD', '{"maxNotes": 7, "speed": 600}'),
('number-counting', 'EASY', '{"minCount": 1, "maxCount": 5, "options": 3}'),
('number-counting', 'MEDIUM', '{"minCount": 1, "maxCount": 10, "options": 4}'),
('number-counting', 'HARD', '{"minCount": 5, "maxCount": 15, "options": 5}'),
('image-association', 'EASY', '{"categories": ["animals", "fruits"], "timeLimit": 20}'),
('image-association', 'MEDIUM', '{"categories": ["animals", "fruits", "toys", "vehicles"], "timeLimit": 15}'),
('image-association', 'HARD', '{"categories": ["all"], "timeLimit": 10}'),
('creative-painting', 'EASY', '{"minStrokes": 3, "minColors": 1, "timeLimit": 180, "challengeType": "free-draw"}'),
('creative-painting', 'MEDIUM', '{"minStrokes": 5, "minColors": 2, "timeLimit": 120, "challengeType": "guided"}'),
('creative-painting', 'HARD', '{"minStrokes": 8, "minColors": 4, "timeLimit": 90, "challengeType": "complex"}'),
('visual-patterns', 'EASY', '{"sequenceLength": 3, "timeLimit": 30, "hintsEnabled": true, "maxMistakes": 3}'),
('visual-patterns', 'MEDIUM', '{"sequenceLength": 4, "timeLimit": 45, "hintsEnabled": false, "maxMistakes": 2}'),
('visual-patterns', 'HARD', '{"sequenceLength": 5, "timeLimit": 60, "hintsEnabled": false, "maxMistakes": 1}'),
('emotional-puzzle', 'EASY', '{"pieceCount": 4, "timeLimit": 120, "contextHints": true, "emotionCategories": ["happy", "sad"]}'),
('emotional-puzzle', 'MEDIUM', '{"pieceCount": 6, "timeLimit": 180, "contextHints": false, "emotionCategories": ["happy", "sad", "angry", "surprised"]}'),
('emotional-puzzle', 'HARD', '{"pieceCount": 9, "timeLimit": 240, "contextHints": false, "emotionCategories": ["happy", "sad", "angry", "surprised", "confused", "excited"]}')
ON CONFLICT DO NOTHING;

-- Criar modelo de IA inicial
INSERT INTO ai_models (model_name, model_type, architecture, version, is_active) VALUES
('cognitive_profile_classifier', 'classification', '{"type": "neural_network", "layers": [{"type": "dense", "units": 64}, {"type": "dropout", "rate": 0.3}, {"type": "dense", "units": 32}, {"type": "dense", "units": 16}]}', '1.0', true),
('difficulty_predictor', 'regression', '{"type": "random_forest", "n_estimators": 100, "max_depth": 10}', '1.0', true),
('engagement_analyzer', 'classification', '{"type": "gradient_boosting", "n_estimators": 50, "learning_rate": 0.1}', '1.0', true)
ON CONFLICT (model_name) DO NOTHING;

-- PARTE 8: COMENTÁRIOS E DOCUMENTAÇÃO
-- =============================================================================

COMMENT ON TABLE users IS 'Tabela principal de usuários do sistema';
COMMENT ON TABLE user_profiles IS 'Perfis múltiplos por usuário para diferentes crianças';
COMMENT ON TABLE game_sessions IS 'Registro de todas as sessões de jogo realizadas';
COMMENT ON TABLE cognitive_profiles IS 'Perfis cognitivos dos usuários baseados em ML';
COMMENT ON TABLE ml_features IS 'Features extraídas das sessões para treinamento de ML';
COMMENT ON TABLE ml_predictions IS 'Predições dos modelos de ML para cada usuário';
COMMENT ON TABLE ai_models IS 'Registro de modelos de IA utilizados no sistema';
COMMENT ON TABLE learning_patterns IS 'Padrões de aprendizagem detectados automaticamente';
COMMENT ON TABLE engagement_metrics IS 'Métricas detalhadas de engajamento do usuário';
COMMENT ON TABLE ai_recommendations IS 'Recomendações personalizadas geradas pela IA';
COMMENT ON TABLE neuroplasticity_tracking IS 'Tracking da neuroplasticidade e adaptação cognitiva';

COMMENT ON FUNCTION calculate_adaptive_learning_score(INTEGER, INTEGER) IS 'Calcula score de aprendizagem adaptativa baseado em múltiplas métricas';
COMMENT ON FUNCTION detect_learning_patterns(INTEGER) IS 'Detecta padrões de aprendizagem em sessões recentes do usuário';
COMMENT ON FUNCTION update_cognitive_profile() IS 'Atualiza automaticamente o perfil cognitivo após cada sessão';

-- =============================================================================
-- SCRIPT CONCLUÍDO - BANCO DE DADOS COMPLETO PARA ML/IA
-- Total de tabelas: 15
-- Total de índices: 29+
-- Total de funções: 4
-- Total de triggers: 2
-- Total de views: 2
-- =============================================================================
