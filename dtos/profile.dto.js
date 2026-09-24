// ==========================================
// STARTLAMPIÃO - DEV SHOWCASE API
// DTO DE PROFILE
// ==========================================


// ==========================================
// DTO DE ENTRADA
// Valida os dados recebidos para criar perfil
// ==========================================

function validarProfileEntrada(dados) {

    const {
        name,
        email,
        bio,
        github_url,
        linkedin_url
    } = dados;


    // ------------------------------------------
    // Nome obrigatório
    // ------------------------------------------

    if (
        !name ||
        typeof name !== "string" ||
        name.trim() === ""
    ) {

        return {
            valido: false,
            erro: "O nome é obrigatório."
        };

    }


    // ------------------------------------------
    // E-mail obrigatório
    // ------------------------------------------

    if (
        !email ||
        typeof email !== "string" ||
        email.trim() === ""
    ) {

        return {
            valido: false,
            erro: "O e-mail é obrigatório."
        };

    }


    // ------------------------------------------
    // Formato do e-mail
    // ------------------------------------------

    const emailValido =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailValido.test(email.trim())) {

        return {
            valido: false,
            erro: "Informe um e-mail válido."
        };

    }


    // ------------------------------------------
    // Função para validar URLs
    // ------------------------------------------

    function urlValida(url) {

        if (!url) {
            return true;
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


    // ------------------------------------------
    // URL do GitHub
    // ------------------------------------------

    if (!urlValida(github_url)) {

        return {
            valido: false,
            erro: "A URL do GitHub é inválida."
        };

    }


    // ------------------------------------------
    // URL do LinkedIn
    // ------------------------------------------

    if (!urlValida(linkedin_url)) {

        return {
            valido: false,
            erro: "A URL do LinkedIn é inválida."
        };

    }


    // ------------------------------------------
    // Dados tratados - DTO de entrada
    // ------------------------------------------

    return {

        valido: true,

        dados: {

            name: name.trim(),

            email: email.trim(),

            bio:
                typeof bio === "string" && bio.trim() !== ""
                    ? bio.trim()
                    : null,

            github_url:
                github_url || null,

            linkedin_url:
                linkedin_url || null

        }

    };

}


// ==========================================
// DTO DE SAÍDA
// Define os dados devolvidos pela API
// ==========================================

function profileSaida(profile) {

    return {

        id: profile.id,

        name: profile.name,

        email: profile.email,

        bio: profile.bio,

        github_url: profile.github_url,

        linkedin_url: profile.linkedin_url,

        created_at: profile.created_at

    };

}


// ==========================================
// EXPORTAÇÃO
// ==========================================

module.exports = {
    validarProfileEntrada,
    profileSaida
};