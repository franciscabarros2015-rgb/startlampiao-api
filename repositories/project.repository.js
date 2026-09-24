// ==========================================
// STARTLAMPIÃO - DEV SHOWCASE API
// REPOSITÓRIO DE PROJECT
// ==========================================

const pool = require("../config/db");


// ==========================================
// CRIAR PROJETO
// ==========================================

async function criarProject(dados) {

    const {
        title,
        description,
        project_url,
        repository_url,
        profile_id
    } = dados;

    const resultado = await pool.query(
        `
        INSERT INTO projects (
            title,
            description,
            project_url,
            repository_url,
            profile_id
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
        `,
        [
            title,
            description,
            project_url,
            repository_url,
            profile_id
        ]
    );

    return resultado.rows[0];
}


// ==========================================
// LISTAR TODOS OS PROJETOS
// ==========================================

async function listarProjects() {

    const resultado = await pool.query(
        `
        SELECT
            p.id,
            p.title,
            p.description,
            p.project_url,
            p.repository_url,
            p.profile_id,
            pr.name AS profile_name,
            p.created_at
        FROM projects p
        INNER JOIN profiles pr
            ON pr.id = p.profile_id
        ORDER BY p.id;
        `
    );

    return resultado.rows;
}


// ==========================================
// BUSCAR PROJETO PELO ID
// ==========================================

async function buscarProjectPorId(id) {

    const resultado = await pool.query(
        `
        SELECT
            p.id,
            p.title,
            p.description,
            p.project_url,
            p.repository_url,
            p.profile_id,
            pr.name AS profile_name,
            p.created_at
        FROM projects p
        INNER JOIN profiles pr
            ON pr.id = p.profile_id
        WHERE p.id = $1;
        `,
        [id]
    );

    return resultado.rows[0] || null;
}


// ==========================================
// VERIFICAR SE UM PERFIL EXISTE
// ==========================================

async function profileExiste(id) {

    const resultado = await pool.query(
        `
        SELECT id
        FROM profiles
        WHERE id = $1;
        `,
        [id]
    );

    return resultado.rows.length > 0;
}


// ==========================================
// EXPORTAÇÃO
// ==========================================

module.exports = {
    criarProject,
    listarProjects,
    buscarProjectPorId,
    profileExiste
};