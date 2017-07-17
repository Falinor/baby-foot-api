export const vertex = (store) => async (docHandle) =>
  store.vertex(docHandle)
    .then(res => res.vertex);

export const save = (store) => async (data, fromId, toId) =>
  store.save(data, fromId, toId)
    .then(res => res.vertex)
    .catch(err => {
      const error = new Error('Document not found');
      error.code = 404;
      throw error;
    });

export const createModel = (store) => ({
  vertex: vertex(store),
  save: save(store)
});

export default createModel;
