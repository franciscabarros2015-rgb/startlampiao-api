// ==========================================
// STARTLAMPIÃO - DEV SHOWCASE API
// DTO DE FEEDBACK
// ATIVIDADE 2
// ==========================================


// ==========================================
// VALIDAR ENTRADA DO FEEDBACK
// ==========================================

function validarFeedbackEntrada(dados) {

    const {
        comment,
        rating
    } = dados;


    // ==========================================
    // VALIDAR COMENTÁRIO
    // ==========================================

    if (
        !comment ||
        typeof comment !== "string" ||
        comment.trim() === ""
    ) {

        return {
            valido: false,
            erro: "O comentário é obrigatório."
        };

    }


    // ==========================================
    // VALIDAR NOTA
    // A nota deve ser um número inteiro de 1 a 5
    // ==========================================

    const nota = Number(rating);

    if (
        !Number.isInteger(nota) ||
        nota < 1 ||
        nota > 5
    ) {

        return {
            valido: false,
            erro: "A avaliação deve ser um número inteiro de 1 a 5."
        };

    }


    // ==========================================
    // DADOS VALIDADOS
    // ==========================================

    return {

        valido: true,

        dados: {
            comment: comment.trim(),
            rating: nota
        }

    };
}


// ==========================================
// DTO DE SAÍDA
// ==========================================

function feedbackSaida(feedback) {

    return {
        id: feedback.id,
        comment: feedback.comment,
        rating: feedback.rating,
        project_id: feedback.project_id,
        created_at: feedback.created_at
    };

}


// ==========================================
// EXPORTAÇÃO
// ==========================================

module.exports = {
    validarFeedbackEntrada,
    feedbackSaida
};