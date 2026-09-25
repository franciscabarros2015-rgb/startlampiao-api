// ==========================================
// DEVSHOWCASE API
// EXECUTAR ATUALIZACAO DO BANCO - ATIVIDADE 2
// ==========================================

require("dotenv").config();

const fs = require("fs");
const path = require("path");

const pool = require("../config/db");

// Caminho do arquivo SQL da Atividade 2
const caminhoSQL = path.join(
    __dirname,
    "update-atividade2.sql"
);

async function executarAtualizacao() {
    try {
        console.log("====================================");
        console.log("ATUALIZACAO DO BANCO - ATIVIDADE 2");
        console.log("====================================");

        // Ler o arquivo SQL
        const sql = fs.readFileSync(
            caminhoSQL,
            "utf8"
        );

        // Executar a atualização
        await pool.query(sql);

        console.log("");
        console.log("Banco atualizado com sucesso!");
        console.log("");
        console.log("Novas colunas adicionadas em projects:");
        console.log("- average_rating");
        console.log("- upvotes");
        console.log("");
        console.log("====================================");
    } catch (erro) {
        console.error("");
        console.error("Erro ao atualizar o banco:");
        console.error(erro);
    } finally {
        await pool.end();
    }
}

executarAtualizacao();