export const getPaginationOptions = query => {
  const page = Math.max(1, parseInt(query.page || '1', 10));
  const limit = Math.max(1, Math.min(100, parseInt(query.limit || '10', 10)));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export const buildPaginationMeta = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };
};
