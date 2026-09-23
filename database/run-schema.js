// ==========================================
// STARTLAMPIÃO
// EXECUÇÃO DO SCHEMA DO BANCO DE DADOS
// ==========================================

// Carrega as variáveis do arquivo .env
require("dotenv").config();

const fs = require("fs");
const path = require("path");

const pool = require("../config/db");

// ==========================================
// FUNÇÃO PARA EXECUTAR O SCHEMA
// ==========================================

async function runSchema() {
    try {

        // Localiza o arquivo schema.sql
        const schemaPath = path.join(
            __dirname,
            "schema.sql"
        );

        // Lê o conteúdo do schema.sql
        const schema = fs.readFileSync(
            schemaPath,
            "utf8"
        );

        // Executa os comandos SQL no PostgreSQL
        await pool.query(schema);

        console.log("====================================");
        console.log("SCHEMA EXECUTADO COM SUCESSO!");
        console.log("Tabelas criadas no PostgreSQL.");
        console.log("====================================");

    } catch (error) {

        console.error("====================================");
        console.error("ERRO AO EXECUTAR O SCHEMA");
        console.error("====================================");

        console.error(error);

    } finally {

        // Encerra a conexão após executar o schema
        await pool.end();
    }
}

// ==========================================
// EXECUTA A FUNÇÃO
// ==========================================

runSchema();