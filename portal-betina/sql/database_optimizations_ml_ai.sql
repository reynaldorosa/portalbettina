-- =============================================================================
-- OTIMIZAÇÕES E MELHORIAS DO BANCO DE DADOS PARA ML/IA
-- Portal Betina - Sistema Neuropedagógico Adaptativo
-- Data: 07/06/2025
-- =============================================================================

-- PARTE 1: ÍNDICES ADICIONAIS PARA PERFORMANCE EM QUERIES DE ML/IA
-- =============================================================================

-- Índices compostos para análises temporais de performance
CREATE INDEX IF NOT EXISTS idx_game_sessions_user_created 
ON game_sessions(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_game_sessions_difficulty_performance 
ON game_sessions(difficulty, accuracy, score) 
WHERE completed = true;

-- Índices para análises de sequências de jogos
CREATE INDEX IF NOT EXISTS idx_game_sessions_sequence 
ON game_sessions(user_id, game_id, created_at);

-- Índices para busca por padrões de erro
CREATE INDEX IF NOT EXISTS idx_game_sessions_error_analysis 
ON game_sessions(user_id, game_id, (total_attempts - correct_answers));

-- Índices para features de ML baseadas em tempo
CREATE INDEX IF NOT EXISTS idx_ml_features_temporal 
ON ml_features(user_id, extracted_at DESC);

-- Índices para análise de confiança de predições
CREATE INDEX IF NOT EXISTS idx_ml_predictions_validation 
ON ml_predictions(prediction_confidence DESC, created_at) 
WHERE validated_at IS NOT NULL;

-- PARTE 2: NOVAS TABELAS PARA ANÁLISES AVANÇADAS DE ML/IA
-- =============================================================================

-- Tabela para armazenar padrões de aprendizagem detectados
CREATE TABLE IF NOT EXISTS learning_patterns (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    pattern_type VARCHAR(50) NOT NULL, -- 'improvement', 'plateau', 'regression', 'breakthrough'
    game_context VARCHAR(50), -- Jogo específico ou 'global'
    pattern_description TEXT,
    strength_score NUMERIC(5,2) CHECK (strength_score >= 0 AND strength_score <= 100),
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    validated BOOLEAN DEFAULT FALSE,
    validation_source VARCHAR(50), -- 'automatic', 'specialist', 'parent'
    metadata JSONB DEFAULT '{}'
);

-- Tabela para métricas de engajamento detalhadas
CREATE TABLE IF NOT EXISTS engagement_metrics (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    session_id INTEGER REFERENCES game_sessions(id),
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

-- Tabela para recomendações de IA personalizadas
CREATE TABLE IF NOT EXISTS ai_recommendations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
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

-- Tabela para dados de neuroplasticidade e adaptação
CREATE TABLE IF NOT EXISTS neuroplasticity_tracking (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
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

-- PARTE 3: FUNÇÕES PARA MACHINE LEARNING E ANÁLISES
-- =============================================================================

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
    AND created_at >= CURRENT_DATE - INTERVAL '%s days' % p_days
    AND completed = true;
    
    -- Calcular tendência de melhoria
    WITH session_trends AS (
        SELECT 
            ROW_NUMBER() OVER (ORDER BY created_at) as seq,
            accuracy
        FROM game_sessions 
        WHERE user_id = p_user_id 
        AND created_at >= CURRENT_DATE - INTERVAL '%s days' % p_days
        AND completed = true
    )
    SELECT 
        COALESCE(
            (COUNT(*) * SUM(seq * accuracy) - SUM(seq) * SUM(accuracy)) / 
            (COUNT(*) * SUM(seq * seq) - SUM(seq) * SUM(seq)),
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
    AND created_at >= CURRENT_DATE - INTERVAL '%s days' % p_days
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

-- PARTE 4: TRIGGERS PARA ATUALIZAÇÕES AUTOMÁTICAS
-- =============================================================================

-- Trigger para atualizar métricas de engajamento automaticamente
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

-- Criar trigger se não existir
DROP TRIGGER IF EXISTS trigger_update_engagement ON game_sessions;
CREATE TRIGGER trigger_update_engagement
    AFTER INSERT ON game_sessions
    FOR EACH ROW EXECUTE FUNCTION update_engagement_metrics();

-- PARTE 5: VIEWS PARA DASHBOARDS E ANÁLISES
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
WHERE gs.completed = true
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

-- PARTE 6: ÍNDICES PARA AS NOVAS TABELAS
-- =============================================================================

-- Índices para learning_patterns
CREATE INDEX IF NOT EXISTS idx_learning_patterns_user_type 
ON learning_patterns(user_id, pattern_type);

CREATE INDEX IF NOT EXISTS idx_learning_patterns_detection 
ON learning_patterns(detected_at DESC, strength_score DESC);

-- Índices para engagement_metrics
CREATE INDEX IF NOT EXISTS idx_engagement_metrics_user_session 
ON engagement_metrics(user_id, session_id);

CREATE INDEX IF NOT EXISTS idx_engagement_metrics_calculated 
ON engagement_metrics(calculated_at DESC);

-- Índices para ai_recommendations
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_user_status 
ON ai_recommendations(user_id, status);

CREATE INDEX IF NOT EXISTS idx_ai_recommendations_priority 
ON ai_recommendations(priority DESC, created_at);

-- Índices para neuroplasticity_tracking
CREATE INDEX IF NOT EXISTS idx_neuroplasticity_user_domain 
ON neuroplasticity_tracking(user_id, cognitive_domain);

CREATE INDEX IF NOT EXISTS idx_neuroplasticity_improvement 
ON neuroplasticity_tracking(improvement_rate DESC, calculated_at);

-- PARTE 7: CONFIGURAÇÕES DE PERFORMANCE PARA ML
-- =============================================================================

-- Configurar work_mem para queries complexas de ML
-- (Executar como superuser se necessário)
-- ALTER SYSTEM SET work_mem = '256MB';
-- ALTER SYSTEM SET shared_buffers = '512MB';
-- ALTER SYSTEM SET effective_cache_size = '2GB';
-- SELECT pg_reload_conf();

-- PARTE 8: COMENTÁRIOS E DOCUMENTAÇÃO
-- =============================================================================

COMMENT ON TABLE learning_patterns IS 'Armazena padrões de aprendizagem detectados automaticamente pelo sistema de IA';
COMMENT ON TABLE engagement_metrics IS 'Métricas detalhadas de engajamento do usuário para análises comportamentais';
COMMENT ON TABLE ai_recommendations IS 'Recomendações personalizadas geradas pelo sistema de IA';
COMMENT ON TABLE neuroplasticity_tracking IS 'Tracking da neuroplasticidade e adaptação cognitiva do usuário';

COMMENT ON FUNCTION calculate_adaptive_learning_score(INTEGER, INTEGER) IS 'Calcula score de aprendizagem adaptativa baseado em múltiplas métricas';
COMMENT ON FUNCTION detect_learning_patterns(INTEGER) IS 'Detecta padrões de aprendizagem em sessões recentes do usuário';

-- =============================================================================
-- FIM DAS OTIMIZAÇÕES
-- =============================================================================
