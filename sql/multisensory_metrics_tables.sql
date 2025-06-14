-- ======================================================
-- SISTEMA DE MÉTRICAS MULTISSENSORIAIS - TABELAS ESPECÍFICAS
-- ======================================================
-- Data: Junho 2025
-- Objetivo: Criar tabelas especializadas para dados de sensores móveis,
--          geolocalização e métricas de neurodivergência coletados pelo MultisensoryMetricsCollector

-- ======================================================
-- 1. TABELA PARA DADOS DE SENSORES MÓVEIS
-- ======================================================
CREATE TABLE IF NOT EXISTS mobile_sensor_data (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    user_id INTEGER REFERENCES users(id),
    
    -- Metadados da coleta
    timestamp BIGINT NOT NULL, -- timestamp em milliseconds
    device_info JSONB DEFAULT '{}',
    
    -- Dados do acelerômetro
    accelerometer_x DECIMAL(10,6),
    accelerometer_y DECIMAL(10,6),
    accelerometer_z DECIMAL(10,6),
    acceleration_magnitude DECIMAL(10,6),
    
    -- Dados do giroscópio
    gyroscope_x DECIMAL(10,6),
    gyroscope_y DECIMAL(10,6),
    gyroscope_z DECIMAL(10,6),
    rotation_rate DECIMAL(10,6),
    
    -- Orientação do dispositivo
    orientation_alpha DECIMAL(10,3), -- compass heading
    orientation_beta DECIMAL(10,3),  -- tilt front/back
    orientation_gamma DECIMAL(10,3), -- tilt left/right
    orientation_absolute BOOLEAN DEFAULT FALSE,
    
    -- Análises derivadas
    movement_intensity DECIMAL(5,3) DEFAULT 0,
    stability_score DECIMAL(5,3) DEFAULT 0,
    interaction_type VARCHAR(50), -- 'tap', 'shake', 'rotation', 'tilt'
    
    -- Contexto da atividade
    activity_phase VARCHAR(100),
    current_task VARCHAR(100),
    difficulty_level VARCHAR(20),
    
    -- Índices
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_mobile_sensor_session ON mobile_sensor_data(session_id);
CREATE INDEX IF NOT EXISTS idx_mobile_sensor_user ON mobile_sensor_data(user_id);
CREATE INDEX IF NOT EXISTS idx_mobile_sensor_timestamp ON mobile_sensor_data(timestamp);
CREATE INDEX IF NOT EXISTS idx_mobile_sensor_interaction ON mobile_sensor_data(interaction_type);

-- ======================================================
-- 2. TABELA PARA DADOS DE GEOLOCALIZAÇÃO E MOVIMENTO
-- ======================================================
CREATE TABLE IF NOT EXISTS geolocation_data (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    user_id INTEGER REFERENCES users(id),
    
    -- Metadados da coleta
    timestamp BIGINT NOT NULL,
    sample_number INTEGER DEFAULT 0,
    
    -- Dados de localização
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    altitude DECIMAL(10,3),
    accuracy DECIMAL(10,3), -- em metros
    altitude_accuracy DECIMAL(10,3),
    heading DECIMAL(6,3), -- direção em graus
    speed DECIMAL(8,3), -- velocidade em m/s
    
    -- Análises de movimento
    movement_pattern VARCHAR(50), -- 'stationary', 'walking', 'transport', 'unknown'
    distance_from_start DECIMAL(10,3),
    total_distance_moved DECIMAL(10,3),
    average_speed DECIMAL(8,3),
    
    -- Contexto ambiental
    indoor_probability DECIMAL(5,3) DEFAULT 0, -- 0-1, probabilidade de estar em ambiente interno
    session_phase VARCHAR(100),
    activity_context VARCHAR(200),
    
    -- Privacy e segurança
    is_approximate BOOLEAN DEFAULT TRUE, -- dados aproximados para privacidade
    privacy_level INTEGER DEFAULT 3, -- 1=baixa, 2=média, 3=alta privacidade
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_geolocation_session ON geolocation_data(session_id);
CREATE INDEX IF NOT EXISTS idx_geolocation_user ON geolocation_data(user_id);
CREATE INDEX IF NOT EXISTS idx_geolocation_timestamp ON geolocation_data(timestamp);
CREATE INDEX IF NOT EXISTS idx_geolocation_pattern ON geolocation_data(movement_pattern);

-- ======================================================
-- 3. TABELA PARA MÉTRICAS DE NEURODIVERGÊNCIA
-- ======================================================
CREATE TABLE IF NOT EXISTS neurodivergence_metrics (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    user_id INTEGER REFERENCES users(id),
    
    -- Metadados
    timestamp BIGINT NOT NULL,
    metric_type VARCHAR(100) NOT NULL, -- 'repetitive_pattern', 'stimulation_seeking', etc.
    
    -- Dados do comportamento
    behavior_intensity DECIMAL(5,3) DEFAULT 0, -- 0-100
    behavior_duration INTEGER DEFAULT 0, -- em milliseconds
    behavior_frequency INTEGER DEFAULT 1,
    
    -- Contexto específico
    trigger_context JSONB DEFAULT '{}',
    response_pattern JSONB DEFAULT '{}',
    adaptation_strategy JSONB DEFAULT '{}',
    
    -- Tipos específicos de métricas
    -- Padrões repetitivos
    repetition_count INTEGER,
    repetition_interval INTEGER, -- tempo entre repetições
    
    -- Busca por estimulação
    stimulation_type VARCHAR(50), -- 'visual', 'auditory', 'tactile'
    stimulation_intensity DECIMAL(5,3),
    
    -- Sobrecarga sensorial
    overload_indicators JSONB DEFAULT '{}',
    recovery_time INTEGER, -- tempo para se recuperar
    
    -- Mudanças de atenção
    attention_shift_reason VARCHAR(100),
    focus_duration INTEGER,
    distraction_source VARCHAR(100),
    
    -- Episódios de hiperfoco
    hyperfocus_duration INTEGER,
    hyperfocus_intensity DECIMAL(5,3),
    task_engagement_level DECIMAL(5,3),
    
    -- Comportamentos de evitação
    avoidance_trigger VARCHAR(100),
    avoidance_strategy VARCHAR(100),
    alternative_chosen VARCHAR(100),
    
    -- Tentativas de autorregulação
    regulation_technique VARCHAR(100),
    regulation_effectiveness DECIMAL(5,3),
    regulation_duration INTEGER,
    
    -- Adaptações e estratégias
    adaptation_type VARCHAR(100),
    adaptation_success DECIMAL(5,3),
    user_initiated BOOLEAN DEFAULT FALSE,
    
    -- Stimming (autoestimulação)
    stimming_type VARCHAR(100),
    stimming_trigger VARCHAR(100),
    stimming_effect VARCHAR(50), -- 'calming', 'focusing', 'expressing'
    
    -- Desafios de função executiva
    executive_challenge_type VARCHAR(100),
    task_switching_difficulty DECIMAL(5,3),
    planning_assistance_needed BOOLEAN DEFAULT FALSE,
    
    -- Padrões de comunicação social
    communication_preference VARCHAR(100),
    social_interaction_comfort DECIMAL(5,3),
    processing_time_needed INTEGER,
    
    -- Equilíbrio rigidez/flexibilidade
    rigidity_level DECIMAL(5,3),
    flexibility_demonstrated DECIMAL(5,3),
    change_adaptation_time INTEGER,
    
    -- Análises e insights
    pattern_confidence DECIMAL(5,3), -- 0-1, confiança na detecção do padrão
    recommendation_generated BOOLEAN DEFAULT FALSE,
    accommodation_suggested JSONB DEFAULT '{}',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_neurodivergence_session ON neurodivergence_metrics(session_id);
CREATE INDEX IF NOT EXISTS idx_neurodivergence_user ON neurodivergence_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_neurodivergence_type ON neurodivergence_metrics(metric_type);
CREATE INDEX IF NOT EXISTS idx_neurodivergence_timestamp ON neurodivergence_metrics(timestamp);
CREATE INDEX IF NOT EXISTS idx_neurodivergence_intensity ON neurodivergence_metrics(behavior_intensity);

-- ======================================================
-- 4. TABELA PARA MÉTRICAS DE ACESSIBILIDADE
-- ======================================================
CREATE TABLE IF NOT EXISTS accessibility_metrics (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    user_id INTEGER REFERENCES users(id),
    
    -- Metadados
    timestamp BIGINT NOT NULL,
    metric_category VARCHAR(100) NOT NULL, -- 'assistive_tech', 'accommodation', 'customization'
    
    -- Uso de tecnologia assistiva
    assistive_tech_type VARCHAR(100), -- 'screen_reader', 'voice_control', 'switch_access'
    usage_duration INTEGER, -- em milliseconds
    usage_effectiveness DECIMAL(5,3), -- 0-1
    errors_encountered INTEGER DEFAULT 0,
    
    -- Eficácia de acomodações
    accommodation_type VARCHAR(100), -- 'high_contrast', 'large_text', 'reduced_motion'
    accommodation_setting JSONB DEFAULT '{}',
    user_satisfaction DECIMAL(5,3), -- 0-1
    task_completion_improvement DECIMAL(5,3),
    
    -- Preferências de customização
    customization_applied JSONB DEFAULT '{}',
    user_initiated_change BOOLEAN DEFAULT FALSE,
    customization_retention INTEGER, -- tempo que manteve a configuração
    
    -- Mudanças adaptativas de interface
    interface_adaptation_trigger VARCHAR(100),
    adaptation_type VARCHAR(100),
    adaptation_success DECIMAL(5,3),
    user_override BOOLEAN DEFAULT FALSE,
    
    -- Respostas a ajustes de dificuldade
    difficulty_before VARCHAR(20),
    difficulty_after VARCHAR(20),
    performance_change DECIMAL(5,3), -- -1 a 1, mudança na performance
    frustration_level_change DECIMAL(5,3),
    
    -- Uso de ferramentas de suporte
    support_tool_type VARCHAR(100), -- 'hints', 'audio_cues', 'visual_guides'
    tool_usage_frequency INTEGER,
    tool_effectiveness DECIMAL(5,3),
    
    -- Frequência de pausas
    break_initiated_by VARCHAR(50), -- 'user', 'system', 'automatic'
    break_duration INTEGER,
    break_reason VARCHAR(100),
    recovery_time INTEGER, -- tempo até retomar atividade produtiva
    
    -- Mitigação de fadiga
    fatigue_indicators JSONB DEFAULT '{}',
    mitigation_strategy VARCHAR(100),
    strategy_effectiveness DECIMAL(5,3),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_accessibility_session ON accessibility_metrics(session_id);
CREATE INDEX IF NOT EXISTS idx_accessibility_user ON accessibility_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_accessibility_category ON accessibility_metrics(metric_category);
CREATE INDEX IF NOT EXISTS idx_accessibility_timestamp ON accessibility_metrics(timestamp);

-- ======================================================
-- 5. TABELA PARA INTERAÇÕES MULTISSENSORIAIS
-- ======================================================
CREATE TABLE IF NOT EXISTS multisensory_interactions (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    user_id INTEGER REFERENCES users(id),
    
    -- Metadados da interação
    timestamp BIGINT NOT NULL,
    interaction_id VARCHAR(100) NOT NULL, -- ID único da interação
    
    -- Modalidades sensoriais envolvidas
    visual_component BOOLEAN DEFAULT FALSE,
    auditory_component BOOLEAN DEFAULT FALSE,
    tactile_component BOOLEAN DEFAULT FALSE,
    motor_component BOOLEAN DEFAULT FALSE,
    
    -- Dados da interação visual
    visual_element_type VARCHAR(100), -- 'button', 'image', 'text', 'animation'
    visual_position JSONB DEFAULT '{}', -- {x, y} coordinates
    visual_response_time INTEGER,
    visual_accuracy DECIMAL(5,3),
    eye_movement_pattern VARCHAR(100),
    
    -- Dados da interação auditiva
    audio_type VARCHAR(100), -- 'instruction', 'feedback', 'music', 'effect'
    audio_response_time INTEGER,
    audio_comprehension DECIMAL(5,3),
    volume_preference DECIMAL(5,3),
    
    -- Dados da interação tátil
    touch_type VARCHAR(100), -- 'tap', 'swipe', 'pinch', 'long_press'
    touch_pressure DECIMAL(5,3),
    touch_duration INTEGER,
    touch_accuracy DECIMAL(5,3),
    gesture_complexity DECIMAL(5,3),
    
    -- Integração multissensorial
    modality_combination VARCHAR(200), -- ex: 'visual_auditory', 'tactile_visual'
    integration_success DECIMAL(5,3), -- quão bem as modalidades foram integradas
    processing_efficiency DECIMAL(5,3),
    cognitive_load DECIMAL(5,3),
    
    -- Contexto da tarefa
    task_type VARCHAR(100),
    task_difficulty VARCHAR(20),
    task_phase VARCHAR(100),
    expected_modality VARCHAR(100), -- modalidade esperada para a tarefa
    
    -- Resultados da interação
    interaction_success BOOLEAN DEFAULT FALSE,
    error_type VARCHAR(100),
    correction_attempts INTEGER DEFAULT 0,
    help_requested BOOLEAN DEFAULT FALSE,
    
    -- Análises comportamentais
    engagement_level DECIMAL(5,3),
    frustration_indicators JSONB DEFAULT '{}',
    motivation_level DECIMAL(5,3),
    confidence_level DECIMAL(5,3),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_multisensory_session ON multisensory_interactions(session_id);
CREATE INDEX IF NOT EXISTS idx_multisensory_user ON multisensory_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_multisensory_timestamp ON multisensory_interactions(timestamp);
CREATE INDEX IF NOT EXISTS idx_multisensory_modality ON multisensory_interactions(modality_combination);
CREATE INDEX IF NOT EXISTS idx_multisensory_task ON multisensory_interactions(task_type);

-- ======================================================
-- 6. VIEWS PARA ANÁLISES AGREGADAS
-- ======================================================

-- View para análise de padrões sensoriais por usuário
CREATE OR REPLACE VIEW user_sensory_patterns AS
SELECT 
    u.id as user_id,
    u.username,
    -- Padrões de sensor móvel
    AVG(msd.movement_intensity) as avg_movement_intensity,
    AVG(msd.stability_score) as avg_stability,
    -- Padrões de neurodivergência mais comuns
    (SELECT metric_type FROM neurodivergence_metrics nm2 
     WHERE nm2.user_id = u.id 
     GROUP BY metric_type 
     ORDER BY COUNT(*) DESC LIMIT 1) as dominant_neurodivergence_pattern,
    -- Modalidades sensoriais preferidas
    (SELECT modality_combination FROM multisensory_interactions mi2 
     WHERE mi2.user_id = u.id AND mi2.integration_success > 0.7
     GROUP BY modality_combination 
     ORDER BY COUNT(*) DESC LIMIT 1) as preferred_sensory_modality,
    -- Eficácia de acessibilidade
    AVG(am.user_satisfaction) as avg_accessibility_satisfaction,
    -- Contadores
    COUNT(DISTINCT msd.session_id) as sessions_with_sensor_data,
    COUNT(DISTINCT nm.session_id) as sessions_with_neurodivergence_data
FROM users u
LEFT JOIN mobile_sensor_data msd ON u.id = msd.user_id
LEFT JOIN neurodivergence_metrics nm ON u.id = nm.user_id
LEFT JOIN accessibility_metrics am ON u.id = am.user_id
GROUP BY u.id, u.username;

-- View para análise de sessões multissensoriais
CREATE OR REPLACE VIEW multisensory_session_analysis AS
SELECT 
    gs.session_id,
    gs.user_id,
    gs.game_id,
    gs.created_at,
    -- Dados de sensores móveis
    COUNT(msd.id) as mobile_sensor_readings,
    AVG(msd.movement_intensity) as avg_movement_intensity,
    AVG(msd.stability_score) as avg_stability,
    -- Dados de geolocalização
    COUNT(gd.id) as geolocation_readings,
    MAX(gd.total_distance_moved) as total_distance,
    -- Métricas de neurodivergência
    COUNT(nm.id) as neurodivergence_events,
    AVG(nm.behavior_intensity) as avg_behavior_intensity,
    -- Interações multissensoriais
    COUNT(mi.id) as multisensory_interactions,
    AVG(mi.integration_success) as avg_integration_success,
    AVG(mi.engagement_level) as avg_engagement,
    -- Métricas de acessibilidade
    COUNT(am.id) as accessibility_events,
    AVG(am.user_satisfaction) as avg_accessibility_satisfaction
FROM game_sessions gs
LEFT JOIN mobile_sensor_data msd ON gs.session_id = msd.session_id
LEFT JOIN geolocation_data gd ON gs.session_id = gd.session_id
LEFT JOIN neurodivergence_metrics nm ON gs.session_id = nm.session_id
LEFT JOIN multisensory_interactions mi ON gs.session_id = mi.session_id
LEFT JOIN accessibility_metrics am ON gs.session_id = am.session_id
WHERE gs.data->>'session_type' = 'advanced_multisensory'
GROUP BY gs.session_id, gs.user_id, gs.game_id, gs.created_at;

-- ======================================================
-- 7. FUNCTIONS PARA ANÁLISES AVANÇADAS
-- ======================================================

-- Função para calcular score de integração multissensorial
CREATE OR REPLACE FUNCTION calculate_multisensory_integration_score(p_user_id INTEGER, p_timeframe_days INTEGER DEFAULT 30)
RETURNS DECIMAL(5,3) AS $$
DECLARE
    integration_score DECIMAL(5,3);
BEGIN
    SELECT COALESCE(AVG(
        CASE 
            WHEN integration_success > 0.8 THEN 1.0
            WHEN integration_success > 0.6 THEN 0.8
            WHEN integration_success > 0.4 THEN 0.6
            WHEN integration_success > 0.2 THEN 0.4
            ELSE 0.2
        END
    ), 0.5)
    INTO integration_score
    FROM multisensory_interactions
    WHERE user_id = p_user_id 
    AND created_at > CURRENT_DATE - INTERVAL '%d days' % p_timeframe_days;
    
    RETURN integration_score;
END;
$$ LANGUAGE plpgsql;

-- Função para identificar padrões de neurodivergência dominantes
CREATE OR REPLACE FUNCTION identify_dominant_neurodivergence_patterns(p_user_id INTEGER, p_limit INTEGER DEFAULT 3)
RETURNS TABLE(metric_type VARCHAR, frequency BIGINT, avg_intensity DECIMAL) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        nm.metric_type,
        COUNT(*) as frequency,
        AVG(nm.behavior_intensity) as avg_intensity
    FROM neurodivergence_metrics nm
    WHERE nm.user_id = p_user_id
    AND nm.created_at > CURRENT_DATE - INTERVAL '30 days'
    GROUP BY nm.metric_type
    ORDER BY frequency DESC, avg_intensity DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- ======================================================
-- COMENTÁRIOS E DOCUMENTAÇÃO
-- ======================================================

COMMENT ON TABLE mobile_sensor_data IS 'Dados coletados de sensores móveis (acelerômetro, giroscópio, orientação) durante sessões de atividades';
COMMENT ON TABLE geolocation_data IS 'Dados de geolocalização e padrões de movimento (com privacidade preservada)';
COMMENT ON TABLE neurodivergence_metrics IS 'Métricas específicas para identificação e acomodação de padrões neurodivergentes';
COMMENT ON TABLE accessibility_metrics IS 'Métricas de uso e eficácia de recursos de acessibilidade';
COMMENT ON TABLE multisensory_interactions IS 'Interações que envolvem múltiplas modalidades sensoriais';

COMMENT ON VIEW user_sensory_patterns IS 'Análise agregada de padrões sensoriais e comportamentais por usuário';
COMMENT ON VIEW multisensory_session_analysis IS 'Análise detalhada de sessões com coleta multissensorial';

COMMENT ON FUNCTION calculate_multisensory_integration_score IS 'Calcula score de 0-1 para capacidade de integração multissensorial do usuário';
COMMENT ON FUNCTION identify_dominant_neurodivergence_patterns IS 'Identifica os padrões de neurodivergência mais frequentes para um usuário';
