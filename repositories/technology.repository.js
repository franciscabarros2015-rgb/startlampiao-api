// ==========================================
// STARTLAMPIÃO - DEV SHOWCASE API
// REPOSITÓRIO DE TECHNOLOGY
// ==========================================

const pool = require("../config/db");


// ==========================================
// CRIAR TECNOLOGIA
// ==========================================

async function criarTechnology(dados) {

    const {
        name,
        description
    } = dados;

    const resultado = await pool.query(
        `
        INSERT INTO technologies (
            name,
            description
        )
        VALUES ($1, $2)
        RETURNING *;
        `,
        [
            name,
            description
        ]
    );

    return resultado.rows[0];
}


// ==========================================
// LISTAR TODAS AS TECNOLOGIAS
// ==========================================

async function listarTechnologies() {

    const resultado = await pool.query(
        `
        SELECT
            id,
            name,
            description,
            created_at
        FROM technologies
        ORDER BY name ASC;
        `
    );

    return resultado.rows;
}


// ==========================================
// EXPORTAÇÃO
// ==========================================

module.exports = {
    criarTechnology,
    listarTechnologies
};