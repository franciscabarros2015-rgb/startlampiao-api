// ==========================================
// STARTLAMPIÃO - API BACKEND
// ARQUIVO PRINCIPAL DO SERVIDOR
// ==========================================

// Carrega as variáveis do arquivo .env
require("dotenv").config();

const express = require("express");
const cors = require("cors");

// Conexão com PostgreSQL
const pool = require("./config/db");

// ==========================================
// IMPORTAÇÃO DAS ROTAS
// ==========================================

const profilesRoutes = require("./routes/profiles");
const technologiesRoutes = require("./routes/technologies");
const projectsRoutes = require("./routes/projects");
const feedbacksRoutes = require("./routes/feedbacks");

// ==========================================
// CRIAÇÃO DA APLICAÇÃO
// ==========================================

const app = express();

// ==========================================
// MIDDLEWARES
// ==========================================

app.use(cors());
app.use(express.json());

// ==========================================
// ROTA INICIAL
// ==========================================

app.get("/", (req, res) => {

    res.status(200).json({
        sucesso: true,
        mensagem: "API do StartLampião funcionando!"
    });

});

// ==========================================
// ROTA PARA TESTAR O POSTGRESQL
// ==========================================

app.get("/teste-banco", async (req, res) => {

    try {

        const resultado = await pool.query(
            "SELECT NOW() AS data_hora"
        );

        res.status(200).json({
            sucesso: true,
            mensagem:
                "Conexão com PostgreSQL realizada com sucesso!",
            banco: resultado.rows[0]
        });

    } catch (erro) {

        console.error(
            "Erro ao consultar PostgreSQL:",
            erro.message
        );

        res.status(500).json({
            sucesso: false,
            mensagem:
                "Erro ao conectar com o PostgreSQL."
        });

    }

});

// ==========================================
// ROTAS DA API
// ==========================================

app.use(
    "/api/profiles",
    profilesRoutes
);

app.use(
    "/api/technologies",
    technologiesRoutes
);

app.use(
    "/api/projects",
    projectsRoutes
);

app.use(
    "/api/feedbacks",
    feedbacksRoutes
);

// ==========================================
// PORTA DO SERVIDOR
// ==========================================

const PORT = process.env.PORT || 3000;

// ==========================================
// INICIAR SERVIDOR
// ==========================================

app.listen(PORT, () => {

    console.log(
        `Servidor StartLampião rodando na porta ${PORT}`
    );

});