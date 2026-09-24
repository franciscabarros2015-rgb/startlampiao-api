// ==========================================
// STARTLAMPIÃO - DEV SHOWCASE API
// DTO DE TECHNOLOGY
// ==========================================


// ==========================================
// DTO DE ENTRADA
// Valida os dados recebidos para tecnologia
// ==========================================

function validarTechnologyEntrada(dados) {

    const {
        name,
        description
    } = dados;


    // ------------------------------------------
    // Nome obrigatório e não vazio
    // ------------------------------------------

    if (
        !name ||
        typeof name !== "string" ||
        name.trim() === ""
    ) {

        return {
            valido: false,
            erro: "O nome da tecnologia é obrigatório."
        };

    }


    // ------------------------------------------
    // Dados tratados - DTO de entrada
    // ------------------------------------------

    return {

        valido: true,

        dados: {

            name: name.trim(),

            description:
                typeof description === "string" &&
                description.trim() !== ""
                    ? description.trim()
                    : null

        }

    };

}


// ==========================================
// DTO DE SAÍDA
// Define os dados devolvidos pela API
// ==========================================

function technologySaida(technology) {

    return {

        id: technology.id,

        name: technology.name,

        description: technology.description,

        created_at: technology.created_at

    };

}


// ==========================================
// EXPORTAÇÃO
// ==========================================

module.exports = {
    validarTechnologyEntrada,
    technologySaida
};