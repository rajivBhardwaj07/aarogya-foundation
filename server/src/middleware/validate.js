/**
 * Zod validation middleware. Validates and REPLACES req.body/query/params
 * with the parsed (coerced, stripped) values so controllers get clean input.
 * Shared schemas live in /server/src/validators (also used by the client).
 */
export const validate = (schema, source = 'body') => (req, res, next) => {
  try {
    const parsed = schema.parse(req[source]);
    req[source] = parsed;
    next();
  } catch (err) {
    next(err); // ZodError formatted by errorHandler
  }
};
