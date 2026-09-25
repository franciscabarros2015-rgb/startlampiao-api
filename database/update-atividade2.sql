-- ==========================================
-- DEVSHOWCASE API
-- ATUALIZACAO DO BANCO DE DADOS
-- ATIVIDADE 2
-- ==========================================

-- Adiciona a nota media dos feedbacks ao projeto
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS average_rating NUMERIC(3,2) NOT NULL DEFAULT 0;

-- Adiciona a quantidade de upvotes ao projeto
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS upvotes INTEGER NOT NULL DEFAULT 0;

-- Garante que a quantidade de upvotes nunca seja negativa
ALTER TABLE projects
ADD CONSTRAINT check_upvotes
CHECK (upvotes >= 0);