// ==========================================
// DEVSHOWCASE API
// VERIFICAR TABELA PROJECTS
// ATIVIDADE 2
// ==========================================

require("dotenv").config();

const pool = require("../config/db");

async function verificarProjects() {
    try {
        console.log("====================================");
        console.log("COLUNAS DA TABELA PROJECTS");
        console.log("====================================");

        const resultado = await pool.query(`
            SELECT
                column_name,
                data_type,
                is_nullable,
                column_default
            FROM information_schema.columns
            WHERE table_name = 'projects'
            ORDER BY ordinal_position;
        `);

        console.table(resultado.rows);

        console.log("====================================");
    } catch (erro) {
        console.error(
            "Erro ao verificar a tabela projects:",
            erro
        );
    } finally {
        await pool.end();
    }
}

verificarProjects();