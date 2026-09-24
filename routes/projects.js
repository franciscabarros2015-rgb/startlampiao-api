// ==========================================
// STARTLAMPIÃO - DEV SHOWCASE API
// ROTAS DE PROJETOS
// ==========================================

const express = require("express");
const router = express.Router();

const pool = require("../config/db");


// ==========================================
// DTO
// ==========================================

const {
    validarProjectEntrada,
    projectSaida
} = require("../dtos/project.dto");


// ==========================================
// REPOSITÓRIO
// ==========================================

const {
    criarProject,
    listarProjects,
    buscarProjectPorId,
    profileExiste
} = require("../repositories/project.repository");


// ==========================================
// 1. LISTAR TODOS OS PROJETOS
// GET /api/projects
// ==========================================

router.get("/", async (req, res) => {

    try {

        const projects =
            await listarProjects();

        const resultado =
            projects.map(projectSaida);

        return res.status(200).json(
            resultado
        );

    } catch (erro) {

        console.error(
            "Erro ao listar projetos:",
            erro
        );

        return res.status(500).json({
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

        // ----------------------------------
        // VALIDAÇÃO DO ID
        // ----------------------------------

        if (!/^\d+$/.test(id)) {

            return res.status(400).json({
                mensagem:
                    "O ID do projeto é inválido."
            });

        }

        const project =
            await buscarProjectPorId(id);

        if (!project) {

            return res.status(404).json({
                mensagem:
                    "Projeto não encontrado."
            });

        }

        return res.status(200).json(
            projectSaida(project)
        );

    } catch (erro) {

        console.error(
            "Erro ao buscar projeto:",
            erro
        );

        return res.status(500).json({
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

        // ----------------------------------
        // DTO DE ENTRADA E VALIDAÇÕES
        // ----------------------------------

        const validacao =
            validarProjectEntrada(req.body);

        if (!validacao.valido) {

            return res.status(400).json({
                erro: validacao.erro
            });

        }

        // ----------------------------------
        // VERIFICA SE O PERFIL EXISTE
        // ----------------------------------

        const existe =
            await profileExiste(
                validacao.dados.profile_id
            );

        if (!existe) {

            return res.status(404).json({
                mensagem:
                    "Perfil não encontrado."
            });

        }

        // ----------------------------------
        // PERSISTÊNCIA PELO REPOSITÓRIO
        // ----------------------------------

        const project =
            await criarProject(
                validacao.dados
            );

        // ----------------------------------
        // DTO DE SAÍDA
        // ----------------------------------

        return res.status(201).json({

            mensagem:
                "Projeto cadastrado com sucesso.",

            projeto:
                projectSaida(project)

        });

    } catch (erro) {

        console.error(
            "Erro ao cadastrar projeto:",
            erro
        );

        return res.status(500).json({
            mensagem:
                "Erro ao cadastrar projeto."
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


        // ----------------------------------
        // VALIDAÇÃO
        // ----------------------------------

        if (!technology_id) {

            return res.status(400).json({
                mensagem:
                    "O campo technology_id é obrigatório."
            });

        }


        // ----------------------------------
        // VERIFICA SE O PROJETO EXISTE
        // ----------------------------------

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
                mensagem:
                    "Projeto não encontrado."
            });

        }


        // ----------------------------------
        // VERIFICA SE A TECNOLOGIA EXISTE
        // ----------------------------------

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
                mensagem:
                    "Tecnologia não encontrada."
            });

        }


        // ----------------------------------
        // VERIFICA SE A ASSOCIAÇÃO JÁ EXISTE
        // ----------------------------------

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

        if (
            relacionamentoExistente.rows.length > 0
        ) {

            return res.status(409).json({
                mensagem:
                    "Essa tecnologia já está associada ao projeto."
            });

        }


        // ----------------------------------
        // CRIA O RELACIONAMENTO
        // ----------------------------------

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


        return res.status(201).json({

            mensagem:
                "Tecnologia associada ao projeto com sucesso.",

            projeto:
                projeto.rows[0],

            tecnologia:
                tecnologia.rows[0]

        });

    } catch (erro) {

        console.error(
            "Erro ao associar tecnologia:",
            erro
        );

        return res.status(500).json({
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


        // ----------------------------------
        // VERIFICA SE O PROJETO EXISTE
        // ----------------------------------

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
                mensagem:
                    "Projeto não encontrado."
            });

        }


        // ----------------------------------
        // BUSCA AS TECNOLOGIAS RELACIONADAS
        // ----------------------------------

        const tecnologias =
            await pool.query(
                `
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
                `,
                [project_id]
            );


        return res.status(200).json({

            projeto:
                projeto.rows[0],

            tecnologias:
                tecnologias.rows

        });

    } catch (erro) {

        console.error(
            "Erro ao listar tecnologias do projeto:",
            erro
        );

        return res.status(500).json({
            mensagem:
                "Erro ao listar tecnologias do projeto."
        });

    }

});


// ==========================================
// EXPORTAÇÃO DAS ROTAS
// ==========================================

module.exports = router;