// ==========================================
// STARTLAMPIÃO - API BACKEND
// ARQUIVO PRINCIPAL DO SERVIDOR
// ==========================================

require("dotenv").config();

const express = require("express");
const cors = require("cors");

// Banco de dados
const pool = require("./config/db");

// Swagger
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

// Rotas
const profilesRoutes =
    require("./routes/profiles");

const technologiesRoutes =
    require("./routes/technologies");

const projectsRoutes =
    require("./routes/projects");

const feedbacksRoutes =
    require("./routes/feedbacks");

// Tratamento global de erros
const {
    rotaNaoEncontrada,
    errorHandler
} = require("./middlewares/errorHandler");

const app = express();

// Middlewares
app.use(cors());
app.use(
    express.json()
);

// ==========================================
// SWAGGER / OPENAPI
// ==========================================

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

// ==========================================
// ROTA INICIAL
// ==========================================

app.get("/", (req, res) => {
    res.status(200).json({
        sucesso: true,
        mensagem:
            "API do StartLampião funcionando!"
    });
});

// ==========================================
// TESTE DO BANCO
// ==========================================

app.get(
    "/teste-banco",
    async (req, res, next) => {
        try {
            const resultado =
                await pool.query(
                    "SELECT NOW() AS data_hora"
                );

            return res.status(200).json({
                sucesso: true,
                mensagem:
                    "Conexão com PostgreSQL realizada com sucesso!",
                banco:
                    resultado.rows[0]
            });
        } catch (erro) {
            next(erro);
        }
    }
);

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
// TRATAMENTO GLOBAL DE ERROS
// IMPORTANTE: DEVE FICAR DEPOIS DAS ROTAS
// ==========================================

app.use(
    rotaNaoEncontrada
);

app.use(
    errorHandler
);

// ==========================================
// INICIALIZAÇÃO DO SERVIDOR
// ==========================================

const PORT =
    process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(
        `Servidor StartLampião rodando na porta ${PORT}`
    );
});