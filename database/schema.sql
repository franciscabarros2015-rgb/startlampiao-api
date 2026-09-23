-- ==========================================
-- DEVSHOWCASE API
-- MODELAGEM DO BANCO DE DADOS
-- ATIVIDADE 1
-- ==========================================


-- ==========================================
-- PROFILE
-- Perfil do desenvolvedor
-- ==========================================

CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    bio TEXT,
    github_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ==========================================
-- TECHNOLOGY
-- Tecnologias utilizadas nos projetos
-- ==========================================

CREATE TABLE technologies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ==========================================
-- PROJECT
-- Projetos dos desenvolvedores
-- ==========================================

CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    project_url VARCHAR(255),
    repository_url VARCHAR(255),

    profile_id INTEGER NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_project_profile
        FOREIGN KEY (profile_id)
        REFERENCES profiles(id)
        ON DELETE CASCADE
);


-- ==========================================
-- FEEDBACK
-- Opiniões sobre os projetos
-- ==========================================

CREATE TABLE feedbacks (
    id SERIAL PRIMARY KEY,

    comment TEXT NOT NULL,

    rating INTEGER,

    project_id INTEGER NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT check_rating
        CHECK (rating >= 1 AND rating <= 5),

    CONSTRAINT fk_feedback_project
        FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE
);


-- ==========================================
-- RELACIONAMENTO PROJECT x TECHNOLOGY
-- Project N:N Technology
-- ==========================================

CREATE TABLE project_technologies (
    project_id INTEGER NOT NULL,

    technology_id INTEGER NOT NULL,

    PRIMARY KEY (project_id, technology_id),

    CONSTRAINT fk_project_technology_project
        FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_project_technology_technology
        FOREIGN KEY (technology_id)
        REFERENCES technologies(id)
        ON DELETE CASCADE
);