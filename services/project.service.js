// ==========================================
// STARTLAMPIÃO - DEV SHOWCASE API
// SERVICE DE PROJECT
// ATIVIDADE 2
// ==========================================

const {
    listarProjects,
    contarProjects,
    buscarProjectPorId,
    incrementarUpvote
} = require("../repositories/project.repository");


// ==========================================
// REGRA DE NEGÓCIO
// LISTAR PROJETOS COM PAGINAÇÃO E FILTRO
// ==========================================

async function listarProjectsComFiltros(query) {

    // ==========================================
    // RECEBER PARÂMETROS
    // ==========================================

    const {
        technology
    } = query;

    const page =
        query.page !== undefined
            ? Number(query.page)
            : 1;

    const limit =
        query.limit !== undefined
            ? Number(query.limit)
            : 10;


    // ==========================================
    // VALIDAR PAGE
    // ==========================================

    if (
        !Number.isInteger(page) ||
        page <= 0
    ) {

        const erro = new Error(
            "O parâmetro page deve ser um número inteiro maior que zero."
        );

        erro.status = 400;

        throw erro;
    }


    // ==========================================
    // VALIDAR LIMIT
    // ==========================================

    if (
        !Number.isInteger(limit) ||
        limit <= 0
    ) {

        const erro = new Error(
            "O parâmetro limit deve ser um número inteiro maior que zero."
        );

        erro.status = 400;

        throw erro;
    }


    // ==========================================
    // LIMITAR QUANTIDADE POR PÁGINA
    // ==========================================

    if (limit > 100) {

        const erro = new Error(
            "O parâmetro limit não pode ser maior que 100."
        );

        erro.status = 400;

        throw erro;
    }


    // ==========================================
    // TRATAR FILTRO DE TECNOLOGIA
    // ==========================================

    let tecnologia = null;

    if (
        typeof technology === "string" &&
        technology.trim() !== ""
    ) {

        tecnologia =
            technology.trim();

    }


    // ==========================================
    // BUSCAR PROJETOS
    // ==========================================

    const projetos =
        await listarProjects({
            technology: tecnologia,
            page,
            limit
        });


    // ==========================================
    // CONTAR TOTAL DE PROJETOS
    // ==========================================

    const total =
        await contarProjects(
            tecnologia
        );


    // ==========================================
    // CALCULAR TOTAL DE PÁGINAS
    // ==========================================

    const totalPages =
        Math.ceil(
            total / limit
        );


    // ==========================================
    // RETORNAR RESULTADO
    // ==========================================

    return {

        projetos,

        paginacao: {
            page,
            limit,
            total,
            totalPages
        },

        filtro: {
            technology: tecnologia
        }

    };
}


// ==========================================
// REGRA DE NEGÓCIO
// ADICIONAR UPVOTE
// ==========================================

async function adicionarUpvote(projectId) {

    // Converter e verificar se o ID é válido
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

    const projetoExistente =
        await buscarProjectPorId(id);

    if (!projetoExistente) {

        const erro = new Error(
            "Projeto não encontrado."
        );

        erro.status = 404;

        throw erro;
    }


    // ==========================================
    // INCREMENTAR O UPVOTE
    // ==========================================

    const projetoAtualizado =
        await incrementarUpvote(id);

    return projetoAtualizado;
}


// ==========================================
// EXPORTAÇÃO
// ==========================================

module.exports = {
    listarProjectsComFiltros,
    adicionarUpvote
};