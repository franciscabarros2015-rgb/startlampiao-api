// ==========================================
// STARTLAMPIÃO - API BACKEND
// ROTAS DE PROJETOS
// ==========================================

const express = require("express");
const router = express.Router();

const pool = require("../config/db");


// ==========================================
// 1. LISTAR TODOS OS PROJETOS
// GET /api/projects
// ==========================================

router.get("/", async (req, res) => {

    try {

        const resultado = await pool.query(`
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
        `);

        res.status(200).json(resultado.rows);

    } catch (erro) {

        console.error(
            "Erro ao listar projetos:",
            erro.message
        );

        res.status(500).json({
            mensagem: "Erro ao listar projetos."
        });

    }

});


// ==========================================
// 2. BUSCAR PROJETO PELO ID
// GET /api/projects/:id
// ==========================================

router.get("/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const resultado = await pool.query(`
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
        `, [id]);

        if (resultado.rows.length === 0) {

            return res.status(404).json({
                mensagem: "Projeto não encontrado."
            });

        }

        res.status(200).json(resultado.rows[0]);

    } catch (erro) {

        console.error(
            "Erro ao buscar projeto:",
            erro.message
        );

        res.status(500).json({
            mensagem: "Erro ao buscar projeto."
        });

    }

});


// ==========================================
// 3. CADASTRAR NOVO PROJETO
// POST /api/projects
// ==========================================

router.post("/", async (req, res) => {

    try {

        const {
            title,
            description,
            project_url,
            repository_url,
            profile_id
        } = req.body;

        // ------------------------------------------
        // Validação dos campos obrigatórios
        // ------------------------------------------

        if (!title || !profile_id) {

            return res.status(400).json({
                mensagem:
                    "Os campos title e profile_id são obrigatórios."
            });

        }

        // ------------------------------------------
        // Verifica se o perfil existe
        // ------------------------------------------

        const perfil = await pool.query(
            `
            SELECT id
            FROM profiles
            WHERE id = $1;
            `,
            [profile_id]
        );

        if (perfil.rows.length === 0) {

            return res.status(404).json({
                mensagem: "Perfil não encontrado."
            });

        }

        // ------------------------------------------
        // Cadastra o projeto
        // ------------------------------------------

        const resultado = await pool.query(`
            INSERT INTO projects (
                title,
                description,
                project_url,
                repository_url,
                profile_id
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `, [
            title,
            description || null,
            project_url || null,
            repository_url || null,
            profile_id
        ]);

        res.status(201).json({
            mensagem: "Projeto cadastrado com sucesso.",
            projeto: resultado.rows[0]
        });

    } catch (erro) {

        console.error(
            "Erro ao cadastrar projeto:",
            erro.message
        );

        res.status(500).json({
            mensagem: "Erro ao cadastrar projeto."
        });

    }

});


// ==========================================
// 4. ASSOCIAR TECNOLOGIA AO PROJETO
// POST /api/projects/:id/technologies
// ==========================================

router.post("/:id/technologies", async (req, res) => {

    try {

        const project_id = req.params.id;

        const {
            technology_id
        } = req.body;

        // ------------------------------------------
        // Validação
        // ------------------------------------------

        if (!technology_id) {

            return res.status(400).json({
                mensagem:
                    "O campo technology_id é obrigatório."
            });

        }

        // ------------------------------------------
        // Verifica se o projeto existe
        // ------------------------------------------

        const projeto = await pool.query(
            `
            SELECT id, title
            FROM projects
            WHERE id = $1;
            `,
            [project_id]
        );

        if (projeto.rows.length === 0) {

            return res.status(404).json({
                mensagem: "Projeto não encontrado."
            });

        }

        // ------------------------------------------
        // Verifica se a tecnologia existe
        // ------------------------------------------

        const tecnologia = await pool.query(
            `
            SELECT id, name
            FROM technologies
            WHERE id = $1;
            `,
            [technology_id]
        );

        if (tecnologia.rows.length === 0) {

            return res.status(404).json({
                mensagem: "Tecnologia não encontrada."
            });

        }

        // ------------------------------------------
        // Verifica se o relacionamento já existe
        // ------------------------------------------

        const relacionamentoExistente =
            await pool.query(
                `
                SELECT *
                FROM project_technologies
                WHERE project_id = $1
                AND technology_id = $2;
                `,
                [
                    project_id,
                    technology_id
                ]
            );

        if (relacionamentoExistente.rows.length > 0) {

            return res.status(409).json({
                mensagem:
                    "Essa tecnologia já está associada ao projeto."
            });

        }

        // ------------------------------------------
        // Cria o relacionamento
        // ------------------------------------------

        await pool.query(
            `
            INSERT INTO project_technologies (
                project_id,
                technology_id
            )
            VALUES ($1, $2);
            `,
            [
                project_id,
                technology_id
            ]
        );

        res.status(201).json({

            mensagem:
                "Tecnologia associada ao projeto com sucesso.",

            projeto: projeto.rows[0],

            tecnologia: tecnologia.rows[0]

        });

    } catch (erro) {

        console.error(
            "Erro ao associar tecnologia:",
            erro.message
        );

        res.status(500).json({
            mensagem:
                "Erro ao associar tecnologia ao projeto."
        });

    }

});


// ==========================================
// 5. LISTAR TECNOLOGIAS DE UM PROJETO
// GET /api/projects/:id/technologies
// ==========================================

router.get("/:id/technologies", async (req, res) => {

    try {

        const project_id = req.params.id;

        // ------------------------------------------
        // Primeiro verifica se o projeto existe
        // ------------------------------------------

        const projeto = await pool.query(
            `
            SELECT id, title
            FROM projects
            WHERE id = $1;
            `,
            [project_id]
        );

        if (projeto.rows.length === 0) {

            return res.status(404).json({
                mensagem: "Projeto não encontrado."
            });

        }

        // ------------------------------------------
        // Busca as tecnologias relacionadas
        // ------------------------------------------

        const tecnologias = await pool.query(`
            SELECT
                t.id,
                t.name,
                t.description,
                t.created_at
            FROM technologies t
            INNER JOIN project_technologies pt
                ON pt.technology_id = t.id
            WHERE pt.project_id = $1
            ORDER BY t.id;
        `, [project_id]);

        res.status(200).json({

            projeto: projeto.rows[0],

            tecnologias: tecnologias.rows

        });

    } catch (erro) {

        console.error(
            "Erro ao listar tecnologias do projeto:",
            erro.message
        );

        res.status(500).json({
            mensagem:
                "Erro ao listar tecnologias do projeto."
        });

    }

});


// ==========================================
// EXPORTAÇÃO DAS ROTAS
// ==========================================

module.exports = router;