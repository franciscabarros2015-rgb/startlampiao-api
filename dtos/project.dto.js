// ==========================================
// STARTLAMPIÃO - DEV SHOWCASE API
// DTO DE PROJECT
// ==========================================


// ==========================================
// FUNÇÃO AUXILIAR
// VALIDA URL HTTP OU HTTPS
// ==========================================

function urlValida(url) {

    // URL é opcional.
    // Se não for informada, é considerada válida.
    if (!url) {
        return true;
    }

    if (typeof url !== "string") {
        return false;
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


// ==========================================
// DTO DE ENTRADA
// Valida os dados recebidos para criar projeto
// ==========================================

function validarProjectEntrada(dados) {

    const {
        title,
        description,
        project_url,
        repository_url,
        profile_id
    } = dados;


    // ------------------------------------------
    // Título obrigatório e não vazio
    // ------------------------------------------

    if (
        !title ||
        typeof title !== "string" ||
        title.trim() === ""
    ) {

        return {
            valido: false,
            erro: "O título do projeto é obrigatório."
        };

    }


    // ------------------------------------------
    // Profile ID obrigatório
    // ------------------------------------------

    if (
        profile_id === undefined ||
        profile_id === null ||
        profile_id === ""
    ) {

        return {
            valido: false,
            erro: "O profile_id é obrigatório."
        };

    }


    // ------------------------------------------
    // Profile ID deve ser inteiro positivo
    // ------------------------------------------

    const profileIdNumero = Number(profile_id);

    if (
        !Number.isInteger(profileIdNumero) ||
        profileIdNumero <= 0
    ) {

        return {
            valido: false,
            erro: "O profile_id deve ser um número inteiro válido."
        };

    }


    // ------------------------------------------
    // Validação da URL do projeto
    // ------------------------------------------

    if (!urlValida(project_url)) {

        return {
            valido: false,
            erro: "A URL do projeto é inválida."
        };

    }


    // ------------------------------------------
    // Validação da URL do repositório
    // ------------------------------------------

    if (!urlValida(repository_url)) {

        return {
            valido: false,
            erro: "A URL do repositório é inválida."
        };

    }


    // ------------------------------------------
    // Dados tratados - DTO de entrada
    // ------------------------------------------

    return {

        valido: true,

        dados: {

            title: title.trim(),

            description:
                typeof description === "string" &&
                description.trim() !== ""
                    ? description.trim()
                    : null,

            project_url:
                typeof project_url === "string" &&
                project_url.trim() !== ""
                    ? project_url.trim()
                    : null,

            repository_url:
                typeof repository_url === "string" &&
                repository_url.trim() !== ""
                    ? repository_url.trim()
                    : null,

            profile_id: profileIdNumero

        }

    };

}


// ==========================================
// DTO DE SAÍDA
// Define os dados devolvidos pela API
// ==========================================

function projectSaida(project) {

    return {

        id: project.id,

        title: project.title,

        description: project.description,

        project_url: project.project_url,

        repository_url: project.repository_url,

        profile_id: project.profile_id,

        profile_name:
            project.profile_name !== undefined
                ? project.profile_name
                : undefined,

        average_rating:
            project.average_rating !== undefined
                ? project.average_rating
                : undefined,

        upvotes:
            project.upvotes !== undefined
                ? project.upvotes
                : undefined,

        created_at: project.created_at

    };

}


// ==========================================
// EXPORTAÇÃO
// ==========================================

module.exports = {
    validarProjectEntrada,
    projectSaida
};