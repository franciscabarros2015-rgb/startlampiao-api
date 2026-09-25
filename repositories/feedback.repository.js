// ==========================================
// STARTLAMPIÃO - DEV SHOWCASE API
// REPOSITÓRIO DE FEEDBACK
// ATIVIDADE 2
// ==========================================

const pool = require("../config/db");


// ==========================================
// CRIAR FEEDBACK
// ==========================================

async function criarFeedback(projectId, dados) {

    const {
        comment,
        rating
    } = dados;

    const resultado = await pool.query(
        `
        INSERT INTO feedbacks (
            comment,
            rating,
            project_id
        )
        VALUES ($1, $2, $3)
        RETURNING *;
        `,
        [
            comment,
            rating,
            projectId
        ]
    );

    return resultado.rows[0];
}


// ==========================================
// CALCULAR MÉDIA DAS AVALIAÇÕES
// ==========================================

async function calcularMediaProjeto(projectId) {

    const resultado = await pool.query(
        `
        SELECT
            COALESCE(
                AVG(rating),
                0
            ) AS average_rating
        FROM feedbacks
        WHERE project_id = $1;
        `,
        [projectId]
    );

    return Number(
        resultado.rows[0].average_rating
    );
}


// ==========================================
// ATUALIZAR MÉDIA DO PROJETO
// ==========================================

async function atualizarMediaProjeto(
    projectId,
    media
) {

    const resultado = await pool.query(
        `
        UPDATE projects
        SET average_rating = $1
        WHERE id = $2
        RETURNING
            id,
            title,
            average_rating,
            upvotes;
        `,
        [
            media,
            projectId
        ]
    );

    return resultado.rows[0] || null;
}


// ==========================================
// EXPORTAÇÃO
// ==========================================

module.exports = {
    criarFeedback,
    calcularMediaProjeto,
    atualizarMediaProjeto
};