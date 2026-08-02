import { FilterQuery, PopulateOptions } from 'mongoose';

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  populate?: string | PopulateOptions | Array<string | PopulateOptions>;
  select?: string;
}

export interface PaginatedResult<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

export interface CursorPaginationOptions {
  limit?: number;
  cursor?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  select?: string;
}

export interface CursorPaginatedResult<T> {
  docs: T[];
  nextCursor: string | null;
  hasMore: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function paginationPlugin(schema: any): void {
  schema.statics['paginate'] = async function <T>(
    filter: FilterQuery<T> = {},
    options: PaginationOptions = {},
  ): Promise<PaginatedResult<T>> {
    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(options.limit) || 20));
    const skip = (page - 1) * limit;

    const sortBy = options.sortBy || 'createdAt';
    const sortOrder = options.sortOrder === 'asc' ? 1 : -1;
    const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const model = this as any;
    const query = model.find(filter).sort(sort).skip(skip).limit(limit);

    if (options.select) {
      query.select(options.select);
    }

    if (options.populate) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      query.populate(options.populate as any);
    }

    const [docs, totalDocs] = await Promise.all([query.exec(), model.countDocuments(filter)]);

    const totalPages = Math.ceil(totalDocs / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      docs,
      totalDocs,
      limit,
      page,
      totalPages,
      hasNextPage,
      hasPrevPage,
      nextPage: hasNextPage ? page + 1 : null,
      prevPage: hasPrevPage ? page - 1 : null,
    };
  };
}
