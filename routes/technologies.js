// ==========================================
// STARTLAMPIÃO - DEV SHOWCASE API
// ROTAS DE TECNOLOGIAS
// ==========================================

const express = require("express");
const router = express.Router();

const pool = require("../config/db");

// ==========================================
// POST /api/technologies
// CADASTRAR UMA NOVA TECNOLOGIA
// ==========================================

router.post("/", async (req, res) => {

    try {

        const {
            name,
            description
        } = req.body;

        // ======================================
        // VALIDAÇÃO DO NOME
        // ======================================

        if (!name || name.trim() === "") {

            return res.status(400).json({
                erro: "O nome da tecnologia é obrigatório."
            });

        }

        // ======================================
        // INSERÇÃO NO POSTGRESQL
        // ======================================

        const resultado = await pool.query(
            `
            INSERT INTO technologies
                (
                    name,
                    description
                )
            VALUES ($1, $2)
            RETURNING *;
            `,
            [
                name.trim(),
                description ? description.trim() : null
            ]
        );

        return res.status(201).json({
            mensagem: "Tecnologia cadastrada com sucesso.",
            tecnologia: resultado.rows[0]
        });

    } catch (error) {

        console.error(
            "Erro ao cadastrar tecnologia:",
            error
        );

        if (error.code === "23505") {

            return res.status(400).json({
                erro: "Essa tecnologia já está cadastrada."
            });

        }

        return res.status(500).json({
            erro: "Erro interno do servidor."
        });

    }

});

// ==========================================
// GET /api/technologies
// LISTAR TODAS AS TECNOLOGIAS
// ==========================================

router.get("/", async (req, res) => {

    try {

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

        return res.status(200).json(
            resultado.rows
        );

    } catch (error) {

        console.error(
            "Erro ao listar tecnologias:",
            error
        );

        return res.status(500).json({
            erro: "Erro interno do servidor."
        });

    }

});

// ==========================================
// EXPORTA AS ROTAS
// ==========================================

module.exports = router;