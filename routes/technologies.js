// ==========================================
// STARTLAMPIÃO - DEV SHOWCASE API
// ROTAS DE TECNOLOGIAS
// ==========================================

const express = require("express");
const router = express.Router();


// ==========================================
// DTO
// ==========================================

const {
    validarTechnologyEntrada,
    technologySaida
} = require("../dtos/technology.dto");


// ==========================================
// REPOSITÓRIO
// ==========================================

const {
    criarTechnology,
    listarTechnologies
} = require("../repositories/technology.repository");


// ==========================================
// POST /api/technologies
// CADASTRAR UMA NOVA TECNOLOGIA
// ==========================================

router.post("/", async (req, res) => {

    try {

        // ----------------------------------
        // DTO DE ENTRADA E VALIDAÇÕES
        // ----------------------------------

        const validacao =
            validarTechnologyEntrada(req.body);

        if (!validacao.valido) {

            return res.status(400).json({
                erro: validacao.erro
            });

        }


        // ----------------------------------
        // PERSISTÊNCIA PELO REPOSITÓRIO
        // ----------------------------------

        const technology =
            await criarTechnology(validacao.dados);


        // ----------------------------------
        // DTO DE SAÍDA
        // ----------------------------------

        return res.status(201).json({

            mensagem:
                "Tecnologia cadastrada com sucesso.",

            tecnologia:
                technologySaida(technology)

        });


    } catch (error) {

        console.error(
            "Erro ao cadastrar tecnologia:",
            error
        );


        // ----------------------------------
        // TECNOLOGIA DUPLICADA
        // ----------------------------------

        if (error.code === "23505") {

            return res.status(400).json({
                erro:
                    "Essa tecnologia já está cadastrada."
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

        // ----------------------------------
        // CONSULTA PELO REPOSITÓRIO
        // ----------------------------------

        const technologies =
            await listarTechnologies();


        // ----------------------------------
        // DTO DE SAÍDA
        // ----------------------------------

        const resultado =
            technologies.map(technologySaida);


        return res.status(200).json(
            resultado
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