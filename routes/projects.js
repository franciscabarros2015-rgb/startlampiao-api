// ==========================================
// STARTLAMPIÃO - DEV SHOWCASE API
// ROTAS DE PROJETOS
// ATIVIDADE 1 + ATIVIDADE 2
// ==========================================

const express = require("express");
const router = express.Router();

const pool = require("../config/db");


// ==========================================
// DTO DE PROJECT
// ==========================================

const {
    validarProjectEntrada,
    projectSaida
} = require("../dtos/project.dto");


// ==========================================
// DTO DE FEEDBACK
// ==========================================

const {
    validarFeedbackEntrada,
    feedbackSaida
} = require("../dtos/feedback.dto");


// ==========================================
// REPOSITÓRIO DE PROJECT
// ==========================================

const {
    criarProject,
    buscarProjectPorId,
    profileExiste
} = require("../repositories/project.repository");


// ==========================================
// SERVICE DE PROJECT
// ==========================================

const {
    listarProjectsComFiltros,
    adicionarUpvote
} = require("../services/project.service");


// ==========================================
// SERVICE DE FEEDBACK
// ==========================================

const {
    registrarFeedback
} = require("../services/feedback.service");


// ==========================================
// FUNÇÃO AUXILIAR PARA CRIAR ERROS
// ==========================================

function criarErro(status, mensagem) {

    const erro = new Error(mensagem);

    erro.status = status;

    return erro;
}


// ==========================================
// 1. LISTAR PROJETOS
// GET /api/projects
//
// EXEMPLOS:
// /api/projects?page=1&limit=5
// /api/projects?technology=JavaScript&page=1&limit=5
// ==========================================

router.get("/", async (req, res, next) => {

    try {

        const resultado =
            await listarProjectsComFiltros(
                req.query
            );

        const projetos =
            resultado.projetos.map(
                projectSaida
            );

        return res.status(200).json({

            projetos,

            paginacao:
                resultado.paginacao,

            filtro:
                resultado.filtro

        });

    } catch (erro) {

        next(erro);

    }

});


// ==========================================
// 2. BUSCAR PROJETO PELO ID
// GET /api/projects/:id
// ==========================================

router.get("/:id", async (req, res, next) => {

    try {

        const { id } =
            req.params;


        // ----------------------------------
        // VALIDAR ID
        // ----------------------------------

        if (!/^\d+$/.test(id)) {

            throw criarErro(
                400,
                "O ID do projeto é inválido."
            );

        }


        // ----------------------------------
        // BUSCAR PROJETO
        // ----------------------------------

        const project =
            await buscarProjectPorId(id);


        if (!project) {

            throw criarErro(
                404,
                "Projeto não encontrado."
            );

        }


        return res.status(200).json(
            projectSaida(project)
        );

    } catch (erro) {

        next(erro);

    }

});


// ==========================================
// 3. CADASTRAR NOVO PROJETO
// POST /api/projects
// ==========================================

router.post("/", async (req, res, next) => {

    try {

        // ----------------------------------
        // DTO DE ENTRADA
        // ----------------------------------

        const validacao =
            validarProjectEntrada(
                req.body
            );


        if (!validacao.valido) {

            throw criarErro(
                400,
                validacao.erro
            );

        }


        // ----------------------------------
        // VERIFICAR PERFIL
        // ----------------------------------

        const existe =
            await profileExiste(
                validacao.dados.profile_id
            );


        if (!existe) {

            throw criarErro(
                404,
                "Perfil não encontrado."
            );

        }


        // ----------------------------------
        // CRIAR PROJETO
        // ----------------------------------

        const project =
            await criarProject(
                validacao.dados
            );


        return res.status(201).json({

            mensagem:
                "Projeto cadastrado com sucesso.",

            projeto:
                projectSaida(project)

        });

    } catch (erro) {

        next(erro);

    }

});


// ==========================================
// 4. ASSOCIAR TECNOLOGIA AO PROJETO
// POST /api/projects/:id/technologies
// ==========================================

router.post(
    "/:id/technologies",
    async (req, res, next) => {

    try {

        const project_id =
            req.params.id;

        const {
            technology_id
        } = req.body;


        // ----------------------------------
        // VALIDAR ID DO PROJETO
        // ----------------------------------

        if (!/^\d+$/.test(project_id)) {

            throw criarErro(
                400,
                "O ID do projeto é inválido."
            );

        }


        // ----------------------------------
        // VALIDAR TECHNOLOGY_ID
        // ----------------------------------

        if (
            technology_id === undefined ||
            technology_id === null ||
            technology_id === ""
        ) {

            throw criarErro(
                400,
                "O campo technology_id é obrigatório."
            );

        }


        const technologyIdNumero =
            Number(technology_id);


        if (
            !Number.isInteger(
                technologyIdNumero
            ) ||
            technologyIdNumero <= 0
        ) {

            throw criarErro(
                400,
                "O technology_id deve ser um número inteiro válido."
            );

        }


        // ----------------------------------
        // VERIFICAR PROJETO
        // ----------------------------------

        const projeto =
            await pool.query(
                `
                SELECT id, title
                FROM projects
                WHERE id = $1;
                `,
                [project_id]
            );


        if (
            projeto.rows.length === 0
        ) {

            throw criarErro(
                404,
                "Projeto não encontrado."
            );

        }


        // ----------------------------------
        // VERIFICAR TECNOLOGIA
        // ----------------------------------

        const tecnologia =
            await pool.query(
                `
                SELECT id, name
                FROM technologies
                WHERE id = $1;
                `,
                [technologyIdNumero]
            );


        if (
            tecnologia.rows.length === 0
        ) {

            throw criarErro(
                404,
                "Tecnologia não encontrada."
            );

        }


        // ----------------------------------
        // VERIFICAR ASSOCIAÇÃO
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
                    technologyIdNumero
                ]
            );


        if (
            relacionamentoExistente
                .rows.length > 0
        ) {

            throw criarErro(
                409,
                "Essa tecnologia já está associada ao projeto."
            );

        }


        // ----------------------------------
        // CRIAR ASSOCIAÇÃO
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
                technologyIdNumero
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

        next(erro);

    }

});


// ==========================================
// 5. LISTAR TECNOLOGIAS DE UM PROJETO
// GET /api/projects/:id/technologies
// ==========================================

router.get(
    "/:id/technologies",
    async (req, res, next) => {

    try {

        const project_id =
            req.params.id;


        // ----------------------------------
        // VALIDAR ID
        // ----------------------------------

        if (!/^\d+$/.test(project_id)) {

            throw criarErro(
                400,
                "O ID do projeto é inválido."
            );

        }


        // ----------------------------------
        // VERIFICAR PROJETO
        // ----------------------------------

        const projeto =
            await pool.query(
                `
                SELECT id, title
                FROM projects
                WHERE id = $1;
                `,
                [project_id]
            );


        if (
            projeto.rows.length === 0
        ) {

            throw criarErro(
                404,
                "Projeto não encontrado."
            );

        }


        // ----------------------------------
        // BUSCAR TECNOLOGIAS
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

        next(erro);

    }

});


// ==========================================
// 6. ADICIONAR UPVOTE AO PROJETO
// PUT /api/projects/:id/upvote
// ATIVIDADE 2
// ==========================================

router.put(
    "/:id/upvote",
    async (req, res, next) => {

    try {

        const projeto =
            await adicionarUpvote(
                req.params.id
            );


        return res.status(200).json({

            mensagem:
                "Upvote registrado com sucesso.",

            projeto

        });

    } catch (erro) {

        next(erro);

    }

});


// ==========================================
// 7. CADASTRAR FEEDBACK NO PROJETO
// POST /api/projects/:id/feedbacks
// ATIVIDADE 2
// ==========================================

router.post(
    "/:id/feedbacks",
    async (req, res, next) => {

    try {

        // ----------------------------------
        // VALIDAR FEEDBACK
        // ----------------------------------

        const validacao =
            validarFeedbackEntrada(
                req.body
            );


        if (!validacao.valido) {

            throw criarErro(
                400,
                validacao.erro
            );

        }


        // ----------------------------------
        // SERVICE
        // ----------------------------------

        const resultado =
            await registrarFeedback(
                req.params.id,
                validacao.dados
            );


        // ----------------------------------
        // RESPOSTA
        // ----------------------------------

        return res.status(201).json({

            mensagem:
                "Feedback registrado com sucesso.",

            feedback:
                feedbackSaida(
                    resultado.feedback
                ),

            projeto:
                resultado.projeto

        });

    } catch (erro) {

        next(erro);

    }

});


// ==========================================
// EXPORTAÇÃO DAS ROTAS
// ==========================================

module.exports = router;