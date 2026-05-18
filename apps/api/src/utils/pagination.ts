import type { PaginatedResponse, QueryParams } from "../types";

export function paginate<T>(items: T[], query: QueryParams): PaginatedResponse<T> {
  const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 50);
  const page = Math.max(Number(query.page) || 1, 1);
  const start = (page - 1) * limit;

  return {
    data: items.slice(start, start + limit),
    meta: {
      page,
      limit,
      total: items.length,
      totalPages: Math.ceil(items.length / limit)
    }
  };
}
