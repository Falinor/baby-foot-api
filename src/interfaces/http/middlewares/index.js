export const errorHandler = logger =>
  async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      logger.error(err);
    }
  };

export default {
  errorHandler,
};
