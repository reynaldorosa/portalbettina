-- Criar tabelas para armazenar dados do Portal Betina

-- Tabela de usuários
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    display_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    preferences JSONB DEFAULT '{}',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de sessões de jogos
CREATE TABLE game_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    game_id VARCHAR(50) NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    score INTEGER DEFAULT 0,
    accuracy DECIMAL(5,2) DEFAULT 0,
    time_spent INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT TRUE,
    correct_answers INTEGER DEFAULT 0,
    total_attempts INTEGER DEFAULT 0,
    data JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para armazenar configurações de acessibilidade
CREATE TABLE accessibility_settings (
    user_id INTEGER REFERENCES users(id) PRIMARY KEY,
    high_contrast BOOLEAN DEFAULT FALSE,
    reduced_motion BOOLEAN DEFAULT FALSE,
    text_to_speech BOOLEAN DEFAULT FALSE,
    audio_hints BOOLEAN DEFAULT TRUE,
    larger_text BOOLEAN DEFAULT FALSE,
    screen_reader_support BOOLEAN DEFAULT FALSE,
    vibration_feedback BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para relatórios de progresso
CREATE TABLE progress_reports (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    report_data JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para perfis de usuário (privados por usuário)
CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    profile_name VARCHAR(100) NOT NULL,
    profile_icon VARCHAR(20) DEFAULT '👤',
    profile_color VARCHAR(7) DEFAULT '#4A90E2',
    age_range VARCHAR(20),
    special_needs TEXT[],
    preferences JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, profile_name)
);

-- Tabela para armazenar parâmetros do ML adaptativo
CREATE TABLE adaptive_ml_parameters (
    id SERIAL PRIMARY KEY,
    game_id VARCHAR(50) NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    parameters JSONB NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhorar a performance das consultas
CREATE INDEX idx_game_sessions_user_id ON game_sessions(user_id);
CREATE INDEX idx_game_sessions_game_id ON game_sessions(game_id);
CREATE INDEX idx_progress_reports_user_id ON progress_reports(user_id);

-- Inserir alguns dados iniciais de parâmetros de ML
INSERT INTO adaptive_ml_parameters (game_id, difficulty, parameters) VALUES 
('letter-recognition', 'easy', '{"focusLetters": ["A", "E", "O"], "timeLimit": 15, "audioHints": true}'),
('letter-recognition', 'medium', '{"focusLetters": ["A", "B", "C", "D", "E", "F", "G", "H"], "timeLimit": 10, "audioHints": false}'),
('letter-recognition', 'hard', '{"focusLetters": ["L", "M", "N", "P", "R", "S", "T", "V", "Z"], "timeLimit": 8, "audioHints": false}'),
('image-association', 'EASY', '{"categories": ["animals", "fruits"], "timeLimit": 20}'),
('image-association', 'MEDIUM', '{"categories": ["animals", "fruits", "toys", "vehicles"], "timeLimit": 15}'),
('image-association', 'HARD', '{"categories": ["all"], "timeLimit": 10}'),
('number-counting', 'EASY', '{"minCount": 1, "maxCount": 5, "options": 3}'),
('number-counting', 'MEDIUM', '{"minCount": 1, "maxCount": 10, "options": 4}'),
('number-counting', 'HARD', '{"minCount": 5, "maxCount": 15, "options": 5}');

-- Função para criar um usuário anônimo
CREATE OR REPLACE FUNCTION create_anonymous_user() RETURNS INTEGER AS $$
DECLARE
    new_user_id INTEGER;
BEGIN
    INSERT INTO users (username, display_name) 
    VALUES (
        'user_' || to_char(CURRENT_TIMESTAMP, 'YYYYMMDDHH24MISS') || '_' || floor(random() * 1000)::text,
        'Visitante ' || floor(random() * 1000)::text
    ) RETURNING id INTO new_user_id;
    
    -- Criar configurações de acessibilidade padrão
    INSERT INTO accessibility_settings (user_id) VALUES (new_user_id);
    
    RETURN new_user_id;
END;
$$ LANGUAGE plpgsql;
