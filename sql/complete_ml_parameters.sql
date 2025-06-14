-- ===================================================================
-- COMPLETAR PARÂMETROS ML PARA TODOS OS JOGOS DO PORTAL BETINA
-- Script para adicionar parâmetros ausentes e corrigir inconsistências
-- ===================================================================

-- 1. ADICIONAR PARÂMETROS PARA JOGOS AUSENTES
-- ===================================================================

-- Memory Game - parâmetros completos
INSERT INTO adaptive_ml_parameters (game_id, difficulty, parameters) VALUES 
('memory-game', 'EASY', '{"pairs": 4, "timeLimit": 120, "hintDuration": 1000, "showHints": true}'),
('memory-game', 'MEDIUM', '{"pairs": 6, "timeLimit": 180, "hintDuration": 800, "showHints": true}'),
('memory-game', 'HARD', '{"pairs": 8, "timeLimit": 240, "hintDuration": 500, "showHints": false}')
ON CONFLICT DO NOTHING;

-- Color Match - parâmetros completos
INSERT INTO adaptive_ml_parameters (game_id, difficulty, parameters) VALUES 
('color-match', 'EASY', '{"correctItems": 2, "incorrectItems": 2, "timeLimit": 60, "colors": ["red", "blue", "green"]}'),
('color-match', 'MEDIUM', '{"correctItems": 3, "incorrectItems": 3, "timeLimit": 45, "colors": ["red", "blue", "green", "yellow"]}'),
('color-match', 'HARD', '{"correctItems": 4, "incorrectItems": 4, "timeLimit": 30, "colors": ["red", "blue", "green", "yellow", "purple", "orange"]}')
ON CONFLICT DO NOTHING;

-- Musical Sequence - parâmetros completos
INSERT INTO adaptive_ml_parameters (game_id, difficulty, parameters) VALUES 
('musical-sequence', 'EASY', '{"maxNotes": 3, "speed": 1000, "instruments": ["piano"], "timeLimit": 120}'),
('musical-sequence', 'MEDIUM', '{"maxNotes": 5, "speed": 800, "instruments": ["piano", "guitar"], "timeLimit": 180}'),
('musical-sequence', 'HARD', '{"maxNotes": 7, "speed": 600, "instruments": ["piano", "guitar", "violin"], "timeLimit": 240}')
ON CONFLICT DO NOTHING;

-- Creative Painting - parâmetros completos
INSERT INTO adaptive_ml_parameters (game_id, difficulty, parameters) VALUES 
('creative-painting', 'EASY', '{"minStrokes": 3, "minColors": 1, "timeLimit": 180, "challengeType": "free-draw", "brushSizes": [5, 10]}'),
('creative-painting', 'MEDIUM', '{"minStrokes": 5, "minColors": 2, "timeLimit": 120, "challengeType": "guided", "brushSizes": [3, 5, 8]}'),
('creative-painting', 'HARD', '{"minStrokes": 8, "minColors": 4, "timeLimit": 90, "challengeType": "complex", "brushSizes": [2, 3, 5, 8, 10]}')
ON CONFLICT DO NOTHING;

-- 2. VERIFICAÇÃO E RELATÓRIO FINAL
-- ===================================================================

-- Relatório de cobertura de jogos
SELECT 
    'COBERTURA DE JOGOS' as status,
    COUNT(DISTINCT game_id) as total_games_with_params
FROM adaptive_ml_parameters;

-- Verificar se todos os jogos têm parâmetros para todas as dificuldades
SELECT 
    'PARÂMETROS COMPLETOS' as status,
    game_id,
    COUNT(DISTINCT difficulty) as difficulties_count,
    string_agg(difficulty, ', ' ORDER BY difficulty) as difficulties_available
FROM adaptive_ml_parameters 
GROUP BY game_id
ORDER BY game_id;

-- Verificar jogos sem parâmetros (se houver)
SELECT 
    'JOGOS SEM PARÂMETROS' as problema,
    gs.game_id,
    COUNT(*) as sessions_count
FROM game_sessions gs
LEFT JOIN adaptive_ml_parameters amp ON gs.game_id = amp.game_id
WHERE amp.game_id IS NULL
GROUP BY gs.game_id
ORDER BY sessions_count DESC;

-- Relatório final de integridade
SELECT 
    'ANÁLISE FINAL' as status,
    (SELECT COUNT(DISTINCT game_id) FROM game_sessions) as games_in_use,
    (SELECT COUNT(DISTINCT game_id) FROM adaptive_ml_parameters) as games_with_params,
    (SELECT COUNT(*) FROM adaptive_ml_parameters) as total_parameter_sets
;
