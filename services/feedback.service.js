// ==========================================
// STARTLAMPIÃO - DEV SHOWCASE API
// SERVICE DE FEEDBACK
// ATIVIDADE 2
// ==========================================

const {
    buscarProjectPorId
} = require("../repositories/project.repository");

const {
    criarFeedback,
    calcularMediaProjeto,
    atualizarMediaProjeto
} = require("../repositories/feedback.repository");


// ==========================================
// REGRA DE NEGÓCIO
// REGISTRAR FEEDBACK E ATUALIZAR MÉDIA
// ==========================================

async function registrarFeedback(
    projectId,
    dados
) {

    // ==========================================
    // VALIDAR ID DO PROJETO
    // ==========================================

    const id = Number(projectId);

    if (
        !Number.isInteger(id) ||
        id <= 0
    ) {

        const erro = new Error(
            "O ID do projeto é inválido."
        );

        erro.status = 400;

        throw erro;
    }


    // ==========================================
    // VERIFICAR SE O PROJETO EXISTE
    // ==========================================

    const projeto =
        await buscarProjectPorId(id);

    if (!projeto) {

        const erro = new Error(
            "Projeto não encontrado."
        );

        erro.status = 404;

        throw erro;
    }


    // ==========================================
    // CRIAR O FEEDBACK
    // ==========================================

    const feedback =
        await criarFeedback(
            id,
            dados
        );


    // ==========================================
    // CALCULAR A NOVA MÉDIA
    // ==========================================

    const media =
        await calcularMediaProjeto(id);


    // ==========================================
    // ATUALIZAR A MÉDIA NO PROJETO
    // ==========================================

    const projetoAtualizado =
        await atualizarMediaProjeto(
            id,
            media
        );


    // ==========================================
    // RETORNAR RESULTADO
    // ==========================================

    return {
        feedback,
        projeto: projetoAtualizado
    };
}


// ==========================================
// EXPORTAÇÃO
// ==========================================

module.exports = {
    registrarFeedback
};