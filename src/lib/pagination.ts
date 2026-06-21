export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationResult {
  skip: number;
  take: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function getPaginationParams(
  searchParams: URLSearchParams | Record<string, string | string[] | undefined>,
  defaultLimit: number = 12
): PaginationParams {
  const rawPage =
    typeof searchParams === 'object' && 'page' in searchParams
      ? (searchParams.page as string)
      : '1';
  const rawLimit =
    typeof searchParams === 'object' && 'limit' in searchParams
      ? (searchParams.limit as string)
      : String(defaultLimit);

  const page = Math.max(1, parseInt(rawPage, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(rawLimit, 10) || defaultLimit));

  return { page, limit };
}

export function getPagination(total: number, params: PaginationParams): PaginationResult {
  const { page, limit } = params;
  const totalPages = Math.ceil(total / limit);

  return {
    skip: (page - 1) * limit,
    take: limit,
    page,
    limit,
    totalPages,
  };
}
