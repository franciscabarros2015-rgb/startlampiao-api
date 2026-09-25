// ==========================================
// STARTLAMPIÃO - DEV SHOWCASE API
// TRATAMENTO GLOBAL DE ERROS
// ATIVIDADE 2
// ==========================================


// ==========================================
// ROTA NÃO ENCONTRADA - 404
// ==========================================

function rotaNaoEncontrada(req, res, next) {

    const erro = new Error(
        `Rota não encontrada: ${req.method} ${req.originalUrl}`
    );

    erro.status = 404;

    next(erro);
}


// ==========================================
// TRATAMENTO GLOBAL DE ERROS
// ==========================================

function errorHandler(
    erro,
    req,
    res,
    next
) {

    console.error(
        "Erro capturado pelo middleware global:",
        erro.message
    );


    // ==========================================
    // DEFINIR STATUS
    // ==========================================

    const status =
        erro.status ||
        erro.statusCode ||
        500;


    // ==========================================
    // DEFINIR MENSAGEM
    // ==========================================

    const mensagem =
        status === 500
            ? "Erro interno do servidor."
            : erro.message;


    // ==========================================
    // RESPOSTA PADRONIZADA
    // ==========================================

    return res.status(status).json({

        sucesso: false,

        status,

        mensagem

    });
}


// ==========================================
// EXPORTAÇÃO
// ==========================================

module.exports = {
    rotaNaoEncontrada,
    errorHandler
};