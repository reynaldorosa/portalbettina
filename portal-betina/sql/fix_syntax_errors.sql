-- Correção de sintaxe SQL para consultas problemáticas
-- Arquivo criado para corrigir erros de sintaxe identificados

-- Verificar jogos sem parâmetros ML (VERSÃO CORRIGIDA)
SELECT DISTINCT
    'JOGOS SEM PARÂMETROS ML' as problema,
    gs.game_id
FROM game_sessions gs
LEFT JOIN adaptive_ml_parameters amp ON gs.game_id = amp.game_id
WHERE amp.game_id IS NULL;

-- Verificar se constraint UNIQUE já existe
SELECT constraint_name, constraint_type 
FROM information_schema.table_constraints 
WHERE table_name = 'adaptive_ml_parameters' 
AND constraint_type = 'UNIQUE';

-- Adicionar constraint UNIQUE se não existir (será ignorada se já existir)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'adaptive_ml_parameters' 
        AND constraint_name = 'unique_game_difficulty'
    ) THEN
        ALTER TABLE adaptive_ml_parameters 
        ADD CONSTRAINT unique_game_difficulty UNIQUE(game_id, difficulty);
    END IF;
END $$;

-- Verificar se os novos jogos têm parâmetros ML
SELECT 
    amp.game_id,
    amp.difficulty,
    amp.parameters
FROM adaptive_ml_parameters amp
WHERE amp.game_id IN ('visual-patterns', 'emotional-puzzle')
ORDER BY amp.game_id, amp.difficulty;
