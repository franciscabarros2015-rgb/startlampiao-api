// ==========================================
// STARTLAMPIÃO
// VERIFICAÇÃO DAS TABELAS DO POSTGRESQL
// ==========================================

require("dotenv").config();

const pool = require("../config/db");

async function checkTables() {

    try {

        // ==========================================
        // LISTAR TODAS AS TABELAS
        // ==========================================

        const tabelas = await pool.query(`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
            ORDER BY table_name;
        `);

        console.log("====================================");
        console.log("TABELAS ENCONTRADAS NO BANCO");
        console.log("====================================");

        tabelas.rows.forEach((tabela, indice) => {

            console.log(
                `${indice + 1}. ${tabela.table_name}`
            );

        });

        // ==========================================
        // VERIFICAR COLUNAS DE FEEDBACKS
        // ==========================================

        const colunas = await pool.query(`
            SELECT
                column_name,
                data_type,
                is_nullable,
                column_default
            FROM information_schema.columns
            WHERE table_schema = 'public'
            AND table_name = 'feedbacks'
            ORDER BY ordinal_position;
        `);

        console.log("");
        console.log("====================================");
        console.log("COLUNAS DA TABELA FEEDBACKS");
        console.log("====================================");

        console.table(colunas.rows);

        // ==========================================
        // VERIFICAR RELACIONAMENTOS
        // ==========================================

        const relacionamentos = await pool.query(`
            SELECT
                kcu.column_name AS coluna,
                ccu.table_name AS tabela_referenciada,
                ccu.column_name AS coluna_referenciada
            FROM information_schema.table_constraints tc
            JOIN information_schema.key_column_usage kcu
                ON tc.constraint_name = kcu.constraint_name
                AND tc.table_schema = kcu.table_schema
            JOIN information_schema.constraint_column_usage ccu
                ON ccu.constraint_name = tc.constraint_name
                AND ccu.table_schema = tc.table_schema
            WHERE tc.constraint_type = 'FOREIGN KEY'
            AND tc.table_name = 'feedbacks';
        `);

        console.log("");
        console.log("====================================");
        console.log("RELACIONAMENTOS DE FEEDBACKS");
        console.log("====================================");

        if (relacionamentos.rows.length === 0) {

            console.log(
                "Nenhum relacionamento encontrado."
            );

        } else {

            console.table(relacionamentos.rows);

        }

        console.log("====================================");

    } catch (erro) {

        console.error(
            "Erro ao verificar banco:",
            erro.message
        );

    } finally {

        await pool.end();

    }

}

checkTables();