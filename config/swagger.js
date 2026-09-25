const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "StartLampião - DevShowcase API",
            version: "2.0.0",
            description:
                "Documentação da API desenvolvida nas atividades de Programação Backend."
        },

        servers: [
            {
                url: "http://localhost:3000",
                description: "Servidor local"
            }
        ],

        tags: [
            {
                name: "Profiles",
                description: "Operações relacionadas aos perfis"
            },
            {
                name: "Technologies",
                description: "Operações relacionadas às tecnologias"
            },
            {
                name: "Projects",
                description: "Operações relacionadas aos projetos"
            },
            {
                name: "Feedbacks",
                description: "Avaliações dos projetos"
            }
        ],

        paths: {
            "/api/profiles": {
                post: {
                    tags: ["Profiles"],
                    summary: "Cadastrar um novo perfil",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    required: ["name", "email"],
                                    properties: {
                                        name: {
                                            type: "string",
                                            example: "Francisca Barros"
                                        },
                                        email: {
                                            type: "string",
                                            format: "email",
                                            example: "francisca@email.com"
                                        },
                                        bio: {
                                            type: "string",
                                            example: "Desenvolvedora"
                                        },
                                        github_url: {
                                            type: "string",
                                            example: "https://github.com/usuario"
                                        },
                                        linkedin_url: {
                                            type: "string",
                                            example: "https://www.linkedin.com"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        201: {
                            description: "Perfil cadastrado com sucesso"
                        },
                        400: {
                            description: "Dados inválidos"
                        }
                    }
                }
            },

            "/api/profiles/{id}": {
                get: {
                    tags: ["Profiles"],
                    summary: "Buscar perfil pelo ID",
                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            required: true,
                            schema: {
                                type: "integer"
                            }
                        }
                    ],
                    responses: {
                        200: {
                            description: "Perfil encontrado"
                        },
                        404: {
                            description: "Perfil não encontrado"
                        }
                    }
                }
            },

            "/api/technologies": {
                get: {
                    tags: ["Technologies"],
                    summary: "Listar tecnologias",
                    responses: {
                        200: {
                            description: "Lista de tecnologias"
                        }
                    }
                },

                post: {
                    tags: ["Technologies"],
                    summary: "Cadastrar uma tecnologia",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    required: ["name"],
                                    properties: {
                                        name: {
                                            type: "string",
                                            example: "Node.js"
                                        },
                                        description: {
                                            type: "string",
                                            example:
                                                "Tecnologia utilizada no backend"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        201: {
                            description:
                                "Tecnologia cadastrada com sucesso"
                        },
                        400: {
                            description: "Dados inválidos"
                        }
                    }
                }
            },

            "/api/projects": {
                get: {
                    tags: ["Projects"],
                    summary:
                        "Listar projetos com filtro e paginação",
                    parameters: [
                        {
                            name: "technology",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string"
                            },
                            description:
                                "Filtrar pela tecnologia"
                        },
                        {
                            name: "page",
                            in: "query",
                            required: false,
                            schema: {
                                type: "integer",
                                default: 1
                            }
                        },
                        {
                            name: "limit",
                            in: "query",
                            required: false,
                            schema: {
                                type: "integer",
                                default: 10
                            }
                        }
                    ],
                    responses: {
                        200: {
                            description: "Lista de projetos"
                        },
                        400: {
                            description:
                                "Parâmetros de paginação inválidos"
                        }
                    }
                },

                post: {
                    tags: ["Projects"],
                    summary: "Cadastrar um projeto",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    required: [
                                        "title",
                                        "profile_id"
                                    ],
                                    properties: {
                                        title: {
                                            type: "string",
                                            example: "StartLampião"
                                        },
                                        description: {
                                            type: "string",
                                            example:
                                                "Projeto de aplicação web"
                                        },
                                        project_url: {
                                            type: "string",
                                            example:
                                                "https://startlampiao.com"
                                        },
                                        repository_url: {
                                            type: "string",
                                            example:
                                                "https://github.com/usuario/projeto"
                                        },
                                        profile_id: {
                                            type: "integer",
                                            example: 1
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        201: {
                            description:
                                "Projeto cadastrado com sucesso"
                        },
                        400: {
                            description: "Dados inválidos"
                        },
                        404: {
                            description: "Perfil não encontrado"
                        }
                    }
                }
            },

            "/api/projects/{id}": {
                get: {
                    tags: ["Projects"],
                    summary: "Buscar projeto pelo ID",
                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            required: true,
                            schema: {
                                type: "integer"
                            }
                        }
                    ],
                    responses: {
                        200: {
                            description: "Projeto encontrado"
                        },
                        404: {
                            description: "Projeto não encontrado"
                        }
                    }
                }
            },

            "/api/projects/{id}/upvote": {
                put: {
                    tags: ["Projects"],
                    summary:
                        "Adicionar um upvote ao projeto",
                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            required: true,
                            schema: {
                                type: "integer"
                            }
                        }
                    ],
                    responses: {
                        200: {
                            description:
                                "Upvote registrado com sucesso"
                        },
                        400: {
                            description: "ID inválido"
                        },
                        404: {
                            description: "Projeto não encontrado"
                        }
                    }
                }
            },

            "/api/projects/{id}/feedbacks": {
                post: {
                    tags: ["Feedbacks"],
                    summary:
                        "Cadastrar uma avaliação para um projeto",
                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            required: true,
                            schema: {
                                type: "integer"
                            }
                        }
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    required: [
                                        "comment",
                                        "rating"
                                    ],
                                    properties: {
                                        comment: {
                                            type: "string",
                                            example:
                                                "Projeto muito bem desenvolvido."
                                        },
                                        rating: {
                                            type: "integer",
                                            minimum: 1,
                                            maximum: 5,
                                            example: 5
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        201: {
                            description:
                                "Feedback registrado com sucesso"
                        },
                        400: {
                            description:
                                "Avaliação ou dados inválidos"
                        },
                        404: {
                            description: "Projeto não encontrado"
                        }
                    }
                }
            }
        }
    },

    apis: []
};

const swaggerSpec =
    swaggerJsdoc(options);

module.exports = swaggerSpec;