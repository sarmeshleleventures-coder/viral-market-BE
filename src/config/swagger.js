import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Viral Market E-commerce API",
      version: "1.0.0",
      description: "API documentation for the Viral Market e-commerce backend",
    },
    servers: [
      { url: "https://viral-market-be.onrender.com", description: "Production" },
      { url: "http://localhost:5000", description: "Local" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "John Doe" },
            email: { type: "string", example: "john@example.com" },
            created_at: { type: "string", format: "date-time" },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            user: { $ref: "#/components/schemas/User" },
            accessToken: { type: "string", example: "eyJhbGciOiJIUzI1NiIs..." },
            refreshToken: { type: "string", example: "eyJhbGciOiJIUzI1NiIs..." },
          },
        },
        Product: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Wireless Headphones" },
            description: { type: "string", example: "Noise cancelling, 30h battery" },
            price: { type: "string", example: "2999.99" },
            stock: { type: "integer", example: 50 },
            image_url: { type: "string", example: "https://example.com/img.jpg" },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
          },
        },
      },
    },
  },
  // Scan route files for @swagger JSDoc annotations
  apis: ["./src/routes/*.js"],
};

export const swaggerSpec = swaggerJSDoc(options);
