import { ApiError } from '../utils/apiError.js';

export function validateBody(schema) {
  return (req, res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      const details = parsed.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      return next(new ApiError(400, 'Please review the highlighted fields.', details));
    }
    req.validatedBody = parsed.data;
    return next();
  };
}
