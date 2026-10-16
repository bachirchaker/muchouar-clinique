// ============================================
// MUCHOUAR CLINIQUE - API Response Helpers
// ============================================

import { NextResponse } from 'next/server';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Success response
 */
export function successResponse<T>(
  data: T,
  message?: string,
  status = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    { success: true, data, message },
    { status }
  );
}

/**
 * Paginated success response
 */
export function paginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  pageSize: number
): NextResponse<ApiResponse<T[]>> {
  return NextResponse.json({
    success: true,
    data,
    meta: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  });
}

/**
 * Error response
 */
export function errorResponse(
  error: string,
  status = 400
): NextResponse<ApiResponse> {
  return NextResponse.json(
    { success: false, error },
    { status }
  );
}

/**
 * Not found response
 */
export function notFoundResponse(
  entity = 'Resource'
): NextResponse<ApiResponse> {
  return errorResponse(`${entity} non trouvé(e)`, 404);
}

/**
 * Unauthorized response
 */
export function unauthorizedResponse(): NextResponse<ApiResponse> {
  return errorResponse('Non autorisé', 401);
}

/**
 * Forbidden response
 */
export function forbiddenResponse(): NextResponse<ApiResponse> {
  return errorResponse('Accès refusé', 403);
}

/**
 * Validation error response
 */
export function validationErrorResponse(
  errors: Record<string, string[]>
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: 'Erreurs de validation',
      data: errors,
    },
    { status: 422 }
  );
}

/**
 * Parse pagination parameters from URL search params
 */
export function parsePaginationParams(searchParams: URLSearchParams): {
  page: number;
  pageSize: number;
  skip: number;
} {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const pageSize = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get('pageSize') || '20', 10))
  );
  const skip = (page - 1) * pageSize;

  return { page, pageSize, skip };
}

/**
 * Parse sort parameters
 */
export function parseSortParams(
  searchParams: URLSearchParams,
  allowedFields: string[],
  defaultField = 'createdAt',
  defaultOrder: 'asc' | 'desc' = 'desc'
): { field: string; order: 'asc' | 'desc' } {
  const field = searchParams.get('sortBy') || defaultField;
  const order = (searchParams.get('sortOrder') || defaultOrder) as 'asc' | 'desc';

  return {
    field: allowedFields.includes(field) ? field : defaultField,
    order: ['asc', 'desc'].includes(order) ? order : defaultOrder,
  };
}
