const swaggerConfig = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Photvoltaic System",
            version: "0.1.0",
            description: "Photvoltaic System",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
        },
        servers: [
            {
                url: "http://localhost:3000/api",
            },
        ],
        components: {
            "schemas": {
                "ICustomUserRecord": {
                    "type": "object",
                    "properties": {
                        "uid": {
                            "type": "string"
                        },
                        "email": {
                            "type": "string"
                        },
                        "accessToken": {
                            "type": "string"
                        },
                        "exp": {
                            "type": "number"
                        }
                    },
                    "required": [
                        "uid",
                        "email"
                    ]
                },
                "IProduct": {
                    "type": "object",
                    "properties": {
                        "id": {
                            "type": "string"
                        },
                        "model": {
                            "type": "string"
                        },
                        "company": {
                            "type": "string"
                        },
                        "area": {
                            "type": "number"
                        },
                        "power_peak": {
                            "type": "number"
                        },
                        "num_cells": {
                            "type": "string"
                        },
                        "efficiency": {
                            "type": "number"
                        }
                    },
                    "required": [
                        "id",
                        "model",
                        "company",
                        "area",
                        "power_peak",
                        "num_cells",
                        "efficiency"
                    ]
                },
                "IProject": {
                    "type": "object",
                    "properties": {
                        "id": {
                            "type": "string"
                        },
                        "products": {
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/IProductDetail"
                            }
                        },
                        "timeCreated": {
                            "type": "number"
                        },
                        "isActive": {
                            "type": "boolean"
                        }
                    },
                    "required": [
                        "id",
                        "products",
                        "timeCreated",
                        "isActive"
                    ]
                },
                "IProductDetail": {
                    "allOf": [
                        {
                            "$ref": "#/components/schemas/IProduct"
                        },
                        {
                            "type": "object",
                            "properties": {
                                "name": {
                                    "type": "string"
                                },
                                "orientation": {
                                    "type": "string",
                                    "enum": [
                                        "ORIENTATION"
                                    ]
                                },
                                "tiltAngle": {
                                    "type": "number"
                                },
                                "lat": {
                                    "type": "number"
                                },
                                "lng": {
                                    "type": "number"
                                },
                                "timestamp": {
                                    "type": "number"
                                },
                                "region": {
                                    "type": "string"
                                },
                                "isActive": {
                                    "type": "boolean"
                                },
                                "num_panels": {
                                    "type": "number"
                                },
                                "report": {
                                    "$ref": "#/components/schemas/IReportJSON"
                                }
                            },
                            "required": [
                                "name",
                                "orientation",
                                "tiltAngle",
                                "lat",
                                "lng",
                                "timestamp",
                                "region",
                                "isActive",
                                "num_panels"
                            ]
                        }
                    ]
                },
                "IProjectCollection": {
                    "type": "object",
                    "properties": {
                        "collectionId": {
                            "type": "string"
                        },
                        "documents": {
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/IProject"
                            }
                        }
                    },
                    "required": [
                        "collectionId",
                        "documents"
                    ]
                },
                "IWeatherData": {
                    "type": "object",
                    "additionalProperties": {
                        "type": "array",
                        "items": {
                            "$ref": "#/components/schemas/CurrentConditions"
                        }
                    }
                },
                "CurrentConditions": {
                    "type": "object",
                    "properties": {},
                    "additionalProperties": {
                        "type": "string"
                    }
                },
                "IReportDataRow": {
                    "type": "object",
                    "properties": {
                        "datetime": {
                            "type": "string"
                        },
                        "solarradiation": {
                            "type": "number"
                        },
                        "electricityGenerated": {
                            "type": "number"
                        }
                    },
                    "required": [
                        "datetime",
                        "solarradiation"
                    ]
                },
                "IReportData": {
                    "type": "object",
                    "additionalProperties": {
                        "type": "array",
                        "items": {
                            "$ref": "#/components/schemas/IReportDataRow"
                        }
                    }
                },
                "IReportJSONRow": {
                    "type": "object",
                    "properties": {
                        "datetimes": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "electrictyProduced": {
                            "type": "array",
                            "items": {
                                "type": "number"
                            }
                        }
                    },
                    "required": [
                        "datetimes",
                        "electrictyProduced"
                    ]
                },
                "IReportJSON": {
                    "type": "object",
                    "properties": {
                        "hourly": {
                            "$ref": "#/components/schemas/IReportJSONRow"
                        },
                        "daily": {
                            "$ref": "#/components/schemas/IReportJSONRow"
                        }
                    },
                    "required": [
                        "hourly",
                        "daily"
                    ]
                },
                "ICustomRequest": {
                    "allOf": [
                        {
                            "type": "object",
                            "properties": {
                                "userUid": {
                                    "type": "string"
                                }
                            },
                            "required": [
                                "userUid"
                            ]
                        }
                    ]
                },
                "IUserCredentials": {
                    "type": "object",
                    "properties": {
                        "email": {
                            "type": "string"
                        },
                        "password": {
                            "type": "string"
                        }
                    },
                    "required": [
                        "email",
                        "password"
                    ]
                },
                "ISignupRequest": {
                    "$ref": "#/components/schemas/IUserCredentials"
                },
                "ISigninRequest": {
                    "$ref": "#/components/schemas/ISignupRequest"
                },
                "IProfileUpdateRequest": {
                    "type": "object",
                    "properties": {
                        "email": {
                            "type": "string"
                        },
                        "currentPassword": {
                            "type": "string"
                        },
                        "newPassword": {
                            "type": "string"
                        }
                    },
                    "required": [
                        "email",
                        "currentPassword",
                        "newPassword"
                    ]
                },
                "IProfileDeleteRequest": {
                    "type": "object",
                    "properties": {
                        "email": {
                            "type": "string"
                        },
                        "currentPassword": {
                            "type": "string"
                        }
                    },
                    "required": [
                        "email"
                    ]
                },
                "IProjectCreateRequest": {
                    "type": "object",
                    "properties": {
                        "projectId": {
                            "type": "string"
                        }
                    },
                    "required": [
                        "projectId"
                    ]
                },
                "IProjectDeleteRequest": {
                    "$ref": "#/components/schemas/IProjectCreateRequest"
                },
                "IProductAddRequest": {
                    "type": "object",
                    "properties": {
                        "projectId": {
                            "type": "string"
                        },
                        "product": {
                            "$ref": "#/components/schemas/IProductDetail"
                        }
                    },
                    "required": [
                        "projectId",
                        "product"
                    ]
                },
                "IProductUpdateRequest": {
                    "$ref": "#/components/schemas/IProductAddRequest"
                },
                "IProductDeleteRequest": {
                    "$ref": "#/components/schemas/IProductAddRequest"
                },
                "IProductReportGenerateRequest": {
                    "$ref": "#/components/schemas/IProductAddRequest"
                },
                "ExtendedResponse": {
                    "type": "object",
                    "properties": {
                        "send": {
                            "type": "function"
                        },
                        "json": {
                            "type": "function"
                        }
                    }
                },
                "IErrorResponse": {
                    "type": "object",
                    "properties": {
                        "message": {
                            "type": "string"
                        }
                    },
                    "required": [
                        "message"
                    ]
                },
                "ISuccessResponse": {
                    "type": "object",
                    "properties": {
                        "message": {
                            "type": "string",
                            "enum": [
                                "Success"
                            ]
                        }
                    },
                    "required": [
                        "message"
                    ]
                },
                "IBooleanResponse": {
                    "type": "boolean"
                },
                "ISignupResponse": {
                    "$ref": "#/components/schemas/ICustomUserRecord"
                },
                "ISigninResponse": {
                    "$ref": "#/components/schemas/ISignupResponse"
                },
                "ISignoutResponse": {
                    "$ref": "#/components/schemas/ISuccessResponse"
                },
                "IProfileUpdateResponse": {
                    "$ref": "#/components/schemas/ISuccessResponse"
                },
                "IProfileDeleteResponse": {
                    "$ref": "#/components/schemas/ISuccessResponse"
                },
                "IProductsGetResponse": {
                    "type": "array",
                    "items": {
                        "$ref": "#/components/schemas/IProduct"
                    }
                },
                "IProjectsGetResponse": {
                    "type": "array",
                    "items": {
                        "$ref": "#/components/schemas/IProject"
                    }
                },
                "IProjectCreateResponse": {
                    "$ref": "#/components/schemas/IProject"
                },
                "IProjectDeleteResponse": {
                    "$ref": "#/components/schemas/IBooleanResponse"
                },
                "IProductAddResponse": {
                    "$ref": "#/components/schemas/ISuccessResponse"
                },
                "IProductUpdateResponse": {
                    "$ref": "#/components/schemas/ISuccessResponse"
                },
                "IProductDeleteResponse": {
                    "$ref": "#/components/schemas/ISuccessResponse"
                },
                "IProductReportGenerateResponse": {
                    "$ref": "#/components/schemas/IReportJSON"
                }
            }

        },
    },
    apis: ['./src/routers/*.ts'], // Specify the paths of your route files

};

export default swaggerConfig;
