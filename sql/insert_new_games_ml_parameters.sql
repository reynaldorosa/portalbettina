-- Inserir parâmetros ML para os novos jogos
-- Visual Patterns
INSERT INTO adaptive_ml_parameters (game_id, difficulty, parameters) VALUES
('visual-patterns', 'easy', '{"sequenceLength": 3, "timeLimit": 30, "hintsEnabled": true, "maxMistakes": 3}'),
('visual-patterns', 'medium', '{"sequenceLength": 5, "timeLimit": 25, "hintsEnabled": true, "maxMistakes": 2}'),
('visual-patterns', 'hard', '{"sequenceLength": 7, "timeLimit": 20, "hintsEnabled": false, "maxMistakes": 1}')
ON CONFLICT (game_id, difficulty) DO UPDATE SET
parameters = EXCLUDED.parameters;

-- Emotional Puzzle  
INSERT INTO adaptive_ml_parameters (game_id, difficulty, parameters) VALUES
('emotional-puzzle', 'easy', '{"pieceCount": 2, "timeLimit": 60, "contextHints": true, "emotionCategories": ["happy", "sad"]}'),
('emotional-puzzle', 'medium', '{"pieceCount": 3, "timeLimit": 45, "contextHints": true, "emotionCategories": ["happy", "sad", "surprised"]}'),
('emotional-puzzle', 'hard', '{"pieceCount": 4, "timeLimit": 30, "contextHints": false, "emotionCategories": ["happy", "sad", "surprised", "calm"]}')
ON CONFLICT (game_id, difficulty) DO UPDATE SET
parameters = EXCLUDED.parameters;
