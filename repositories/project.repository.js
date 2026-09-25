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
// LISTAR PROJETOS
// COM FILTRO POR TECNOLOGIA E PAGINAÇÃO
// ATIVIDADE 2
// ==========================================

async function listarProjects(opcoes = {}) {

    const {
        technology,
        page = 1,
        limit = 10
    } = opcoes;

    const offset =
        (page - 1) * limit;


    // ==========================================
    // SEM FILTRO POR TECNOLOGIA
    // ==========================================

    if (!technology) {

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
                p.average_rating,
                p.upvotes,
                p.created_at
            FROM projects p
            INNER JOIN profiles pr
                ON pr.id = p.profile_id
            ORDER BY p.id
            LIMIT $1
            OFFSET $2;
            `,
            [
                limit,
                offset
            ]
        );

        return resultado.rows;
    }


    // ==========================================
    // COM FILTRO POR TECNOLOGIA
    // ==========================================

    const resultado = await pool.query(
        `
        SELECT DISTINCT
            p.id,
            p.title,
            p.description,
            p.project_url,
            p.repository_url,
            p.profile_id,
            pr.name AS profile_name,
            p.average_rating,
            p.upvotes,
            p.created_at
        FROM projects p
        INNER JOIN profiles pr
            ON pr.id = p.profile_id
        INNER JOIN project_technologies pt
            ON pt.project_id = p.id
        INNER JOIN technologies t
            ON t.id = pt.technology_id
        WHERE LOWER(t.name) =
            LOWER($1)
        ORDER BY p.id
        LIMIT $2
        OFFSET $3;
        `,
        [
            technology,
            limit,
            offset
        ]
    );

    return resultado.rows;
}


// ==========================================
// CONTAR PROJETOS
// PARA PAGINAÇÃO
// ==========================================

async function contarProjects(technology) {

    // ==========================================
    // SEM FILTRO POR TECNOLOGIA
    // ==========================================

    if (!technology) {

        const resultado = await pool.query(
            `
            SELECT COUNT(*)::INTEGER AS total
            FROM projects;
            `
        );

        return resultado.rows[0].total;
    }


    // ==========================================
    // COM FILTRO POR TECNOLOGIA
    // ==========================================

    const resultado = await pool.query(
        `
        SELECT
            COUNT(
                DISTINCT p.id
            )::INTEGER AS total
        FROM projects p
        INNER JOIN project_technologies pt
            ON pt.project_id = p.id
        INNER JOIN technologies t
            ON t.id = pt.technology_id
        WHERE LOWER(t.name) =
            LOWER($1);
        `,
        [technology]
    );

    return resultado.rows[0].total;
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
            p.average_rating,
            p.upvotes,
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
// INCREMENTAR UPVOTE DO PROJETO
// ==========================================

async function incrementarUpvote(id) {

    const resultado = await pool.query(
        `
        UPDATE projects
        SET upvotes = upvotes + 1
        WHERE id = $1
        RETURNING
            id,
            title,
            average_rating,
            upvotes;
        `,
        [id]
    );

    return resultado.rows[0] || null;
}


// ==========================================
// EXPORTAÇÃO
// ==========================================

module.exports = {
    criarProject,
    listarProjects,
    contarProjects,
    buscarProjectPorId,
    profileExiste,
    incrementarUpvote
};