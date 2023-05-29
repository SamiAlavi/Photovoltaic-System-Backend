const swaggerOptions = {
    "openapi": "3.0.0",
    "info": {
        "title": "Your API Documentation",
        "version": "1.0.0",
        "description": "API documentation for your Express.js project with Swagger"
    },
    "servers": [
        {
            "url": "http://localhost:3000"
        }
    ],
    "paths": {
        "/": {
            "get": {
                "summary": "Application health check",
                "responses": {
                    "200": {
                        "description": "OK",
                        "content": {
                            "application/json": {}
                        }
                    }
                }
            }
        }
    }
}

export default swaggerOptions;