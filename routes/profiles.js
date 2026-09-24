// ==========================================
// STARTLAMPIÃO - DEV SHOWCASE API
// ROTAS DE PERFIS
// ==========================================

const express = require("express");
const router = express.Router();


// ==========================================
// DTO
// ==========================================

const {
    validarProfileEntrada,
    profileSaida
} = require("../dtos/profile.dto");


// ==========================================
// REPOSITÓRIO
// ==========================================

const {
    criarProfile,
    buscarProfilePorId
} = require("../repositories/profile.repository");


// ==========================================
// POST /api/profiles
// CADASTRAR UM NOVO PERFIL
// ==========================================

router.post("/", async (req, res) => {

    try {

        // ----------------------------------
        // DTO DE ENTRADA E VALIDAÇÕES
        // ----------------------------------

        const validacao =
            validarProfileEntrada(req.body);

        if (!validacao.valido) {

            return res.status(400).json({
                erro: validacao.erro
            });

        }


        // ----------------------------------
        // PERSISTÊNCIA PELO REPOSITÓRIO
        // ----------------------------------

        const profile =
            await criarProfile(validacao.dados);


        // ----------------------------------
        // DTO DE SAÍDA
        // ----------------------------------

        return res.status(201).json({

            mensagem:
                "Perfil cadastrado com sucesso.",

            perfil:
                profileSaida(profile)

        });


    } catch (error) {

        console.error(
            "Erro ao cadastrar perfil:",
            error
        );


        // ----------------------------------
        // E-MAIL DUPLICADO
        // ----------------------------------

        if (error.code === "23505") {

            return res.status(400).json({
                erro:
                    "Já existe um perfil com esse e-mail."
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


        // ----------------------------------
        // VALIDAÇÃO DO ID
        // ----------------------------------

        if (!/^\d+$/.test(id)) {

            return res.status(400).json({
                erro: "O ID informado é inválido."
            });

        }


        // ----------------------------------
        // CONSULTA PELO REPOSITÓRIO
        // ----------------------------------

        const profile =
            await buscarProfilePorId(id);


        // ----------------------------------
        // PERFIL NÃO ENCONTRADO
        // ----------------------------------

        if (!profile) {

            return res.status(404).json({
                erro: "Perfil não encontrado."
            });

        }


        // ----------------------------------
        // DTO DE SAÍDA
        // ----------------------------------

        return res.status(200).json(
            profileSaida(profile)
        );


    } catch (error) {

        console.error(
            "Erro ao buscar perfil:",
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