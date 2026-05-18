export const openApiSpec = {
  openapi: "3.1.0",
  info: {
    title: "Madrid For Fun API",
    version: "0.1.0",
    description:
      "A small classroom API for React students. It serves a curated snapshot of Madrid event data adapted from Glorp Explorer."
  },
  servers: [{ url: "http://localhost:3001" }],
  paths: {
    "/api/health": {
      get: {
        summary: "Check that the API is running",
        responses: {
          200: {
            description: "API status"
          }
        }
      }
    },
    "/api/meta": {
      get: {
        summary: "Get categories, districts, moods, and dataset info",
        responses: {
          200: {
            description: "Metadata for building filters and onboarding"
          }
        }
      }
    },
    "/api/events": {
      get: {
        summary: "List events",
        parameters: [
          {
            name: "when",
            in: "query",
            schema: { type: "string", enum: ["today", "tomorrow", "weekend", "week"] }
          },
          { name: "category", in: "query", schema: { type: "string" } },
          {
            name: "categories",
            in: "query",
            description: "Comma-separated categories, for example music,theater",
            schema: { type: "string" }
          },
          { name: "district", in: "query", schema: { type: "string" } },
          { name: "free", in: "query", schema: { type: "boolean" } },
          { name: "q", in: "query", schema: { type: "string" } },
          { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
          { name: "page", in: "query", schema: { type: "integer", default: 1 } }
        ],
        responses: {
          200: {
            description: "A paginated event list"
          }
        }
      }
    },
    "/api/events/{id}": {
      get: {
        summary: "Get one event by id",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } }
        ],
        responses: {
          200: { description: "Event found" },
          404: { description: "Event not found" }
        }
      }
    },
    "/api/plans": {
      get: {
        summary: "Generate plan suggestions from query params",
        parameters: [
          {
            name: "mood",
            in: "query",
            schema: {
              type: "string",
              enum: ["cultural", "date", "friends", "free", "night", "weird"]
            }
          },
          {
            name: "when",
            in: "query",
            schema: { type: "string", enum: ["today", "tomorrow", "weekend", "week"] }
          },
          { name: "district", in: "query", schema: { type: "string" } },
          { name: "categories", in: "query", schema: { type: "string" } },
          { name: "budget", in: "query", schema: { type: "string", enum: ["free", "any"] } }
        ],
        responses: {
          200: {
            description: "A list of generated plans"
          }
        }
      },
      post: {
        summary: "Generate plan suggestions from an onboarding/preferences body",
        requestBody: {
          required: false,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  mood: { type: "string" },
                  when: { type: "string" },
                  district: { type: "string" },
                  categories: { type: "array", items: { type: "string" } },
                  budget: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "A list of generated plans"
          }
        }
      }
    }
  }
};
