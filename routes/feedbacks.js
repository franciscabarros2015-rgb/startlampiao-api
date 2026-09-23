// ==========================================
// STARTLAMPIÃO - API BACKEND
// ROTAS DE FEEDBACKS
// ==========================================

const express = require("express");
const router = express.Router();

const pool = require("../config/db");


// ==========================================
// 1. LISTAR TODOS OS FEEDBACKS
// GET /api/feedbacks
// ==========================================

router.get("/", async (req, res) => {

    try {

        const resultado = await pool.query(`
            SELECT
                f.id,
                f.comment,
                f.rating,
                f.project_id,
                p.title AS project_title,
                f.created_at
            FROM feedbacks f
            INNER JOIN projects p
                ON p.id = f.project_id
            ORDER BY f.id;
        `);

        res.status(200).json(resultado.rows);

    } catch (erro) {

        console.error(
            "Erro ao listar feedbacks:",
            erro.message
        );

        res.status(500).json({
            mensagem: "Erro ao listar feedbacks."
        });

    }

});


// ==========================================
// 2. BUSCAR FEEDBACK PELO ID
// GET /api/feedbacks/:id
// ==========================================

router.get("/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const resultado = await pool.query(`
            SELECT
                f.id,
                f.comment,
                f.rating,
                f.project_id,
                p.title AS project_title,
                f.created_at
            FROM feedbacks f
            INNER JOIN projects p
                ON p.id = f.project_id
            WHERE f.id = $1;
        `, [id]);

        if (resultado.rows.length === 0) {

            return res.status(404).json({
                mensagem: "Feedback não encontrado."
            });

        }

        res.status(200).json(resultado.rows[0]);

    } catch (erro) {

        console.error(
            "Erro ao buscar feedback:",
            erro.message
        );

        res.status(500).json({
            mensagem: "Erro ao buscar feedback."
        });

    }

});


// ==========================================
// 3. CADASTRAR FEEDBACK
// POST /api/feedbacks
// ==========================================

router.post("/", async (req, res) => {

    try {

        const {
            comment,
            rating,
            project_id
        } = req.body;

        // ======================================
        // VALIDA CAMPOS OBRIGATÓRIOS
        // ======================================

        if (!comment || !project_id) {

            return res.status(400).json({
                mensagem:
                    "Os campos comment e project_id são obrigatórios."
            });

        }

        // ======================================
        // VALIDA A NOTA
        // ======================================

        if (
            rating !== undefined &&
            rating !== null &&
            (
                !Number.isInteger(rating) ||
                rating < 1 ||
                rating > 5
            )
        ) {

            return res.status(400).json({
                mensagem:
                    "A avaliação deve ser um número inteiro entre 1 e 5."
            });

        }

        // ======================================
        // VERIFICA SE O PROJETO EXISTE
        // ======================================

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

        // ======================================
        // CADASTRA O FEEDBACK
        // ======================================

        const resultado = await pool.query(`
            INSERT INTO feedbacks (
                comment,
                rating,
                project_id
            )
            VALUES ($1, $2, $3)
            RETURNING *;
        `, [
            comment,
            rating ?? null,
            project_id
        ]);

        res.status(201).json({

            mensagem:
                "Feedback cadastrado com sucesso.",

            feedback: resultado.rows[0]

        });

    } catch (erro) {

        console.error(
            "Erro ao cadastrar feedback:",
            erro.message
        );

        res.status(500).json({
            mensagem: "Erro ao cadastrar feedback."
        });

    }

});


// ==========================================
// 4. LISTAR FEEDBACKS DE UM PROJETO
// GET /api/feedbacks/project/:projectId
// ==========================================

router.get("/project/:projectId", async (req, res) => {

    try {

        const { projectId } = req.params;

        // ======================================
        // VERIFICA SE O PROJETO EXISTE
        // ======================================

        const projeto = await pool.query(
            `
            SELECT id, title
            FROM projects
            WHERE id = $1;
            `,
            [projectId]
        );

        if (projeto.rows.length === 0) {

            return res.status(404).json({
                mensagem: "Projeto não encontrado."
            });

        }

        // ======================================
        // BUSCA OS FEEDBACKS
        // ======================================

        const feedbacks = await pool.query(`
            SELECT
                id,
                comment,
                rating,
                project_id,
                created_at
            FROM feedbacks
            WHERE project_id = $1
            ORDER BY id;
        `, [projectId]);

        res.status(200).json({

            projeto: projeto.rows[0],

            feedbacks: feedbacks.rows

        });

    } catch (erro) {

        console.error(
            "Erro ao listar feedbacks do projeto:",
            erro.message
        );

        res.status(500).json({
            mensagem:
                "Erro ao listar feedbacks do projeto."
        });

    }

});


// ==========================================
// EXPORTAÇÃO
// ==========================================

module.exports = router;