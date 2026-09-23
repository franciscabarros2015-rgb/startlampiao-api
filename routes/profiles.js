// ==========================================
// STARTLAMPIÃO - DEV SHOWCASE API
// ROTAS DE PERFIS
// ==========================================

const express = require("express");
const router = express.Router();

const pool = require("../config/db");

// ==========================================
// POST /api/profiles
// CADASTRAR UM NOVO PERFIL
// ==========================================

router.post("/", async (req, res) => {

    try {

        const {
            name,
            email,
            bio,
            github_url,
            linkedin_url
        } = req.body;

        // ----------------------------------
        // VALIDAÇÃO DO NOME
        // ----------------------------------

        if (!name || name.trim() === "") {
            return res.status(400).json({
                erro: "O nome é obrigatório."
            });
        }

        // ----------------------------------
        // VALIDAÇÃO DO E-MAIL
        // ----------------------------------

        if (!email || email.trim() === "") {
            return res.status(400).json({
                erro: "O e-mail é obrigatório."
            });
        }

        const emailValido =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailValido.test(email)) {
            return res.status(400).json({
                erro: "Informe um e-mail válido."
            });
        }

        // ----------------------------------
        // VALIDAÇÃO DAS URLs OPCIONAIS
        // ----------------------------------

        function urlValida(url) {

            if (!url) {
                return true;
            }

            try {

                const endereco = new URL(url);

                return (
                    endereco.protocol === "http:" ||
                    endereco.protocol === "https:"
                );

            } catch {

                return false;
            }
        }

        if (!urlValida(github_url)) {
            return res.status(400).json({
                erro: "A URL do GitHub é inválida."
            });
        }

        if (!urlValida(linkedin_url)) {
            return res.status(400).json({
                erro: "A URL do LinkedIn é inválida."
            });
        }

        // ----------------------------------
        // INSERÇÃO NO POSTGRESQL
        // ----------------------------------

        const resultado = await pool.query(
            `
            INSERT INTO profiles
                (
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
                name.trim(),
                email.trim(),
                bio || null,
                github_url || null,
                linkedin_url || null
            ]
        );

        return res.status(201).json({
            mensagem: "Perfil cadastrado com sucesso.",
            perfil: resultado.rows[0]
        });

    } catch (error) {

        console.error("Erro ao cadastrar perfil:", error);

        // E-mail duplicado
        if (error.code === "23505") {
            return res.status(400).json({
                erro: "Já existe um perfil com esse e-mail."
            });
        }

        return res.status(500).json({
            erro: "Erro interno do servidor."
        });
    }
});


// ==========================================
// GET /api/profiles/:id
// BUSCAR PERFIL PELO ID
// ==========================================

router.get("/:id", async (req, res) => {

    try {

        const { id } = req.params;

        if (!/^\d+$/.test(id)) {
            return res.status(400).json({
                erro: "O ID informado é inválido."
            });
        }

        const resultado = await pool.query(
            `
            SELECT *
            FROM profiles
            WHERE id = $1;
            `,
            [id]
        );

        if (resultado.rows.length === 0) {

            return res.status(404).json({
                erro: "Perfil não encontrado."
            });

        }

        return res.status(200).json(
            resultado.rows[0]
        );

    } catch (error) {

        console.error("Erro ao buscar perfil:", error);

        return res.status(500).json({
            erro: "Erro interno do servidor."
        });
    }
});


// ==========================================
// EXPORTA AS ROTAS
// ==========================================

module.exports = router;