-- ======================================================
-- CORREÇÃO DAS VIEWS MULTISSENSORIAIS
-- ======================================================
-- Corrige os JOINs que estavam incorretos no script original

-- Drop das views que falharam (se existirem)
DROP VIEW IF EXISTS multisensory_session_analysis CASCADE;

-- Recria a view de análise de sessões multissensoriais com JOINs corretos
CREATE OR REPLACE VIEW multisensory_session_analysis AS
SELECT 
    gs.id as session_id,
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
LEFT JOIN mobile_sensor_data msd ON gs.id::varchar = msd.session_id
LEFT JOIN geolocation_data gd ON gs.id::varchar = gd.session_id
LEFT JOIN neurodivergence_metrics nm ON gs.id::varchar = nm.session_id
LEFT JOIN multisensory_interactions mi ON gs.id::varchar = mi.session_id
LEFT JOIN accessibility_metrics am ON gs.id::varchar = am.session_id
WHERE gs.data->>'session_type' = 'advanced_multisensory'
GROUP BY gs.id, gs.user_id, gs.game_id, gs.created_at;

COMMENT ON VIEW multisensory_session_analysis IS 'Análise detalhada de sessões com coleta multissensorial (com JOINs corretos)';
