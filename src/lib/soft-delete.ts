/** Filter condition for non-deleted records */
export const notDeleted = { deletedAt: null } as const;

/** Soft delete data - sets deletedAt to now */
export const softDeleteData = { deletedAt: new Date() };
