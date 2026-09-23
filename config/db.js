// ==========================================
// STARTLAMPIÃO
// CONFIGURAÇÃO DO BANCO DE DADOS POSTGRESQL
// ==========================================

const { Pool } = require("pg");

// ==========================================
// CRIAÇÃO DO POOL DE CONEXÕES
// ==========================================

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,

    ssl: {
        rejectUnauthorized: false
    }
});

// ==========================================
// EVENTO DE CONEXÃO
// ==========================================

pool.on("connect", () => {
    console.log("PostgreSQL conectado com sucesso!");
});

// ==========================================
// EVENTO DE ERRO
// ==========================================

pool.on("error", (erro) => {
    console.error(
        "Erro inesperado na conexão com PostgreSQL:",
        erro.message
    );
});

// ==========================================
// EXPORTAÇÃO
// ==========================================

module.exports = pool;