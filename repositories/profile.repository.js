// ==========================================
// STARTLAMPIÃO - DEV SHOWCASE API
// REPOSITÓRIO DE PROFILE
// ==========================================

const pool = require("../config/db");


// ==========================================
// CRIAR PERFIL
// ==========================================

async function criarProfile(dados) {

    const {
        name,
        email,
        bio,
        github_url,
        linkedin_url
    } = dados;

    const resultado = await pool.query(
        `
        INSERT INTO profiles (
            name,
            email,
            bio,
            github_url,
            linkedin_url
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
        `,
        [
            name,
            email,
            bio,
            github_url,
            linkedin_url
        ]
    );

    return resultado.rows[0];
}


// ==========================================
// BUSCAR PERFIL PELO ID
// ==========================================

async function buscarProfilePorId(id) {

    const resultado = await pool.query(
        `
        SELECT
            id,
            name,
            email,
            bio,
            github_url,
            linkedin_url,
            created_at
        FROM profiles
        WHERE id = $1;
        `,
        [id]
    );

    return resultado.rows[0] || null;
}


// ==========================================
// EXPORTAÇÃO
// ==========================================

module.exports = {
    criarProfile,
    buscarProfilePorId
};