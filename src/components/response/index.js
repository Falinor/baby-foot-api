export const success = (res, status = 200) => (entity) => {
  if (entity) {
    res.status(status).json(entity);
  }
  return null;
};

export const notFound = (res) => () => {
  res.status(404).end();
  return null;
};
